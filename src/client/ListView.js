import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';
import classSet from 'react/lib/cx';
import Immutable from 'immutable';
import debounce from 'debounce';
import {VBox} from './Layout';
import {rgba, translate3d} from './StyleUtils';

const ListViewStyle = {
  self: {
    overflow: 'hidden',
    outline: 'none'
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
    selectedItem: React.PropTypes.any,
    keyboardNav: React.PropTypes.bool
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

  selectItem(mod) {
    const {items, selectedItem, onItemClick} = this.props;
    if (!items.count()) {
      return;
    }
    var index = items.indexOf(selectedItem);
    index += mod;
    index = Math.min(Math.max(0, index), items.count() - 1);
    onItemClick(items.get(index));
  },

  onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      this.selectItem(1);
    } else if (e.key === 'ArrowUp') {
      this.selectItem(-1);
    }
  },

  getScrollSlice() {
    const {items, itemHeight} = this.props;
    const scrollTop = this.getScrollTop();

    var sliceStart = 0;
    var sliceEnd = items.count();

    var stubTopHeight = 0;
    if (scrollTop) {
      sliceStart = Math.floor(-scrollTop / itemHeight);
      if (sliceStart < 0) {
        sliceStart = 0;
      }
      stubTopHeight = sliceStart * itemHeight;
    }

    if (scrollTop > this.getMaxScrollTop()) {
      sliceEnd = items.count() - Math.floor((scrollTop - this.getMaxScrollTop()) / itemHeight);
    }
    return {sliceStart, sliceEnd, stubTopHeight};
  },

  componentDidUpdate(prevProps) {
    const {items, selectedItem, itemHeight} = this.props;
    if (Immutable.is(items, prevProps.items) &&
        Immutable.is(selectedItem, prevProps.selectedItem) &&
        itemHeight === prevProps.itemHeight) {
      return;
    }
    const selectedIndex = items.indexOf(selectedItem);
    if (selectedIndex === -1) {
      return;
    }
    const {sliceStart, sliceEnd} = this.getScrollSlice();
    var scrollTop = this.getScrollTop();
    if ((selectedIndex < sliceStart + 1) || (selectedIndex >= sliceEnd)) {
      this.setState({
        scrollTop: -(selectedIndex * itemHeight)
      });
    }
  },

  render() {
    const {height, itemHeight, itemComponent, items, onItemClick, selectedItem, keyboardNav, ...props} = this.props;
    const {scrollBarAnimate, scrollBarShow} = this.state;
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
    const scrollTop = this.getScrollTop();
    const {sliceStart, sliceEnd, stubTopHeight} = this.getScrollSlice();
    const itemsInView = items.slice(sliceStart, sliceEnd);
    return (
      <VBox {...props} style={{...ListViewStyle.self, height: this.props.height}} onKeyDown={keyboardNav && this.onKeyDown}>
        <VBox
          onWheel={this.onWheel}
          style={{transform: translate3d(0, scrollTop + stubTopHeight, 0)}}>
            {itemsInView.map(this.renderItem).toArray()}
        </VBox>
        {scrollBar}
      </VBox>
    );
  }

});


module.exports = ListView;
