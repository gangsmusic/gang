var React = require('react/lib/ReactWithAddons');
var classSet = require('react/lib/cx');
var Immutable = require('immutable');
var debounceCore = require('fixed-data-table/internal/debounceCore');


require('./ListView.styl');


var ListView = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    itemHeight: React.PropTypes.number.isRequired,
    itemComponent: React.PropTypes.element.isRequired,
    items: React.PropTypes.shape({
      count: React.PropTypes.func.isRequired,
      get: React.PropTypes.func.isRequired
    }).isRequired,
    onItemClick: React.PropTypes.func
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
    return this.getHeight() - this.getContentHeight();
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

  renderItem(item, idx) {
    return React.addons.cloneWithProps(this.props.itemComponent, {
      key: idx,
      item: item,
      onClick: this.props.onItemClick
    });
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

    var stubTop = null;
    if (scrollTop) {
      sliceStart = Math.floor(-scrollTop / this.props.itemHeight);
      stubTop = <div className='ListView-Stub' style={{height: sliceStart * this.props.itemHeight}} />;
    }

    var stubBottom = null;
    if (scrollTop > this.getMaxScrollTop()) {
      var trailItems = Math.floor((scrollTop - this.getMaxScrollTop()) / this.props.itemHeight);
      stubBottom = <div className='ListView-Stub' style={{height: trailItems * this.props.itemHeight}} />;
      sliceEnd = items.count() - trailItems;
    }

    items = items.slice(sliceStart, sliceEnd);

    return (
      <div className='ListView' style={{height: this.props.height, width: this.props.width}}>
        <div className='ListView-Content' onWheel={this.onWheel} style={{top: this.getScrollTop()}}>
          {stubTop}
          {items.map(this.renderItem).toArray()}
          {stubBottom}
        </div>
        {scrollBar}
      </div>
    )
  }

});


module.exports = ListView;
