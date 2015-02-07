import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';
import classSet from 'react/lib/cx';
import Immutable from 'immutable';
import debounce from 'debounce';
import {VBox} from './Layout';
import {border, borderStyle, rgba, translate3d} from './StyleUtils';

const ListViewStyle = {
  self: {
    overflow: 'hidden'
  },
  scrollHandle: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 8,
    background: rgba(0, 0, 0, 0.2)
  },
  scrollBar: {
    position: 'absolute',
    right: '-9px',
    top: 0,
    bottom: 0,
    width: '9px',
    transition: 'right 0.3s'
  },
  scrollBarAnimate: {
    right: 0
  }
};

const ListView = React.createClass({

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

    this.hideScrollAnimate = debounce(function() {
      this.setState({
        scrollBarAnimate: false
      });
    }.bind(this), 1000);

    this.hideScrollShow = debounce(function() {
      this.setState({
        scrollBarShow: false
      });
    }.bind(this), 1300);

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
    return cloneWithProps(this.props.itemComponent, {key, item, selected, onClick});
  },

  render() {
    var items = this.props.items;
    var {scrollBarAnimate, scrollBarShow} = this.state;
    var scrollBar = null;
    if (scrollBarShow) {
      scrollBar = (
        <div 
          style={{...ListViewStyle.scrollBar, ...(scrollBarAnimate && ListViewStyle.scrollBarAnimate)}}>
          <div
            style={{
              ...ListViewStyle.scrollHandle,
              height: this.getScrollHandleHeight(),
              top: this.getScrollHandleTop()
            }}
            />
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
      <VBox style={{...ListViewStyle.self, height: this.props.height}}>
        <VBox
          onWheel={this.onWheel}
          style={{transform: translate3d(0, this.getScrollTop() + stubTopHeight, 0)}}>
          {items.map(this.renderItem).toArray()}
        </VBox>
        {scrollBar}
      </VBox>
    )
  }

});


module.exports = ListView;
