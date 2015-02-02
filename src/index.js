if (typeof Object.assign === 'undefined') {
  Object.assign = require('react/lib/Object.assign');
}

var debug = require('debug');
debug.enable('gang:*');

var React = require('react/lib/ReactWithAddons');
var App = require('./App');

React.initializeTouchEvents(true);


// var Immutable = require('immutable');
// var ListView = require('./ListView');

// var Item = React.createClass({

//   mixins: [React.addons.PureRenderMixin],

//   onClick() {
//     if (this.props.onClick) {
//       this.props.onClick(this.props.item);
//     }
//   },

//   render() {
//     var {item, onClick, ...props} = this.props;
//     return <div style={{lineHeight: '25px', textIndent: '8px', borderBottom: '1px solid #ccc'}} onClick={this.onClick} {...props}>{item.toString()}</div>;
//   }

// })

React.render(<App />, document.body);

// var items = Immutable.Range(0, 100);

// function onItemClick(item) {
//   console.log(item.toString());
// }

// React.render(<ListView items={items} onItemClick={onItemClick} height={100} itemHeight={25} itemComponent={<Item />} />, document.body);
