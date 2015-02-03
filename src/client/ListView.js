var React = require('react/lib/ReactWithAddons');
var classSet = require('react/lib/cx');
var Immutable = require('immutable');
var debounceCore = require('fixed-data-table/internal/debounceCore');


require('./ListView.styl');


var ListView = React.createClass({

  mixins: [require('./Pure')],

  propTypes: {
    height: React.PropTypes.number.isRequired,
    itemHeight: React.PropTypes.number.isRequired,
    itemComponent: React.PropTypes.element.isRequired,
    items: React.PropTypes.shape({
      count: React.PropTypes.func.isRequired,
      get: React.PropTypes.func.isRequired
    }).isRequired,
    onItemClick: React.PropTypes.func,
    selectedItem: React.PropTypes.any
  },

  getDefaultProps() {
    return {
      height: 100,
      itemHeight: 30,
      items: Immutable.Range(0, 1000)
    };
  },

  getInitialState() {

    this.hideScrollAnimate = debounceCore(function() {
      this.setState({
        scrollBarAnimate: false
      });
    }, 1000, this);

    this.hideScrollShow = debounceCore(function() {
      this.setState({
        scrollBarShow: false
      });
    }, 1300, this);

    return {
      scrollTop: 0,
      scrollBarAnimate: false,
      scrollBarShow: false
    };
  },

  hideScroll() {
    this.hideScrollAnimate();
    this.hideScrollShow();
  },

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.items, this.props.items)) {
      this.setState({
        scrollTop: 0
      });
    }
  },

  getScrollTop() {
    return Math.max(this.getMaxScrollTop(), Math.min(0, this.state.scrollTop));
  },

  getMaxScrollTop() {
    return Math.min(0, this.getHeight() - this.getContentHeight());
  },

  getHeight() {
    return this.props.height;
  },

  getContentHeight() {
    return this.props.itemHeight * this.props.items.count();
  },

  getScrollHandleHeight() {
    return Math.max(20, Math.round(this.getHeight() * this.getHeight() / this.getContentHeight()));
  },

  getScrollHandleTop() {
    var scrollWindow = this.getHeight() - this.getScrollHandleHeight();
    return Math.round(scrollWindow * (this.getScrollTop() / this.getMaxScrollTop()));
  },

  onWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.getContentHeight() <= this.getHeight()) {
      this.setState({
        scrollBarShow: false,
        scrollBarAnimate: false,
        scrollTop: 0
      });
    } else {
      this.setState({
        scrollBarShow: true,
        scrollBarAnimate: true,
        scrollTop: Math.max(this.getMaxScrollTop(), Math.min(0, this.getScrollTop() - Math.ceil(e.deltaY / 3)))
      });
      this.hideScroll();
    }
  },

  renderItem(item, key) {
    var selected = Immutable.is(item, this.props.selectedItem);
    var onClick = this.props.onItemClick;
    return React.addons.cloneWithProps(this.props.itemComponent, {key, item, selected, onClick});
  },

  render() {
    var items = this.props.items;

    var scrollBar = null;
    if (this.state.scrollBarShow) {
      scrollBar = (
        <div className={classSet({'ListView-Scroll': true, 'ListView-Scroll--animate': this.state.scrollBarAnimate})}>
          <div className='ListView-ScrollHandle' style={{height: this.getScrollHandleHeight(), top: this.getScrollHandleTop()}} />
        </div>
      );
    }
    var scrollTop = this.getScrollTop();

    var sliceStart = undefined;
    var sliceEnd = undefined;

    var stubTopHeight = 0;
    if (scrollTop) {
      sliceStart = Math.floor(-scrollTop / this.props.itemHeight);
      if (sliceStart < 0) {
        sliceStart = 0;
      }
      stubTopHeight = sliceStart * this.props.itemHeight;
    }

    if (scrollTop > this.getMaxScrollTop()) {
      sliceEnd = items.count() - Math.floor((scrollTop - this.getMaxScrollTop()) / this.props.itemHeight);
    }

    items = items.slice(sliceStart, sliceEnd);

    return (
      <div className='ListView' style={{height: this.props.height}}>
        <div className='ListView-Content' onWheel={this.onWheel} style={{top: this.getScrollTop() + stubTopHeight}}>
          {items.map(this.renderItem).toArray()}
        </div>
        {scrollBar}
      </div>
    )
  }

});


module.exports = ListView;
