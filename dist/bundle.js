/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Nav_1 = __webpack_require__(5);
var List_1 = __webpack_require__(4);
var data_1 = __webpack_require__(6);
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this.state = { data: data_1.default };
        return _this;
    }
    // componentDidMount() {
    //     this.refresh = setInterval(() => {
    //         // Will this update the data from data.ts?
    //         this.setState({ data });
    //     }, 3000);
    // }
    App.prototype.clicked = function () {
        // this.setState({ data.bids })
    };
    App.prototype.render = function () {
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "twelve columns well" },
                React.createElement(Nav_1.default, null),
                React.createElement(List_1.default, { data: this.state.data, onQuickBid: this.clicked }))));
    };
    return App;
}(React.Component));
exports.App = App;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
// import data from '../data';
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(props) {
        var _this = _super.call(this) || this;
        _this.quickBid = _this.quickBid.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.bids = props.bids;
        _this.state = {
            highBid: _this.getHighBid()
        };
        return _this;
    }
    Item.prototype.render = function () {
        return (React.createElement("div", { className: "item-group clearfix", onClick: this.handleClick },
            React.createElement("div", { className: "item-container" },
                React.createElement("div", { className: "item-title u-pull-left" },
                    React.createElement("span", null, this.props.title)),
                React.createElement("div", { className: "button-box u-pull-right" },
                    React.createElement("span", { className: "your-bid hidden", id: this.props.id }, "Your bid:"),
                    React.createElement("button", { className: "btn", id: "your-bid-" + this.props.id }, this.state.highBid),
                    React.createElement("button", { className: "bid btn", onClick: this.quickBid }, "Bid +$5"))),
            React.createElement("div", { className: "description", id: "description-" + this.props.id }, this.props.description)));
    };
    ;
    Item.prototype.getHighBid = function () {
        return Math.max.apply(null, this.bids);
    };
    Item.prototype.quickBid = function (e) {
        e.stopPropagation();
        this.bids.push(this.getHighBid() + 5);
        this.setState({ highBid: this.getHighBid() });
        document.getElementById(this.props.id).classList.remove('hidden');
        document.getElementById('your-bid-' + this.props.id).classList.add('bid-bg');
        // TODO: Update DB
    };
    Item.prototype.handleClick = function (e) {
        e.stopPropagation();
        console.log(this.props.description);
        document.getElementById('description-' + this.props.id).classList.toggle('open');
        // If tap on title, open up description/photos
    };
    return Item;
}(React.Component));
exports.default = Item;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Item_1 = __webpack_require__(3);
// import data from '../data';
var List = (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.render = function () {
        var data = this.props.data;
        var items = [];
        for (var i = 0, datum = void 0; datum = data[i]; i++) {
            var bids = [];
            for (var j = 0; j < datum.bids.length; j++) {
                bids.push(datum.bids[j].bid);
            }
            console.log('BIDS', bids);
            var highBid = Math.max.apply(null, bids);
            console.log(highBid);
            items.push(React.createElement(Item_1.default, { title: datum.title, description: datum.description, key: i, id: i, bids: bids, highBid: highBid }));
        }
        return (React.createElement("div", { className: "list" }, items));
    };
    return List;
}(React.Component));
exports.default = List;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Nav = (function (_super) {
    __extends(Nav, _super);
    function Nav() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Nav.prototype.render = function () {
        return (React.createElement("div", { className: "centered nav-bg" },
            React.createElement("div", { className: "nav-tab active" }, "Auction Items"),
            React.createElement("div", { className: "nav-tab" }, "My Bids")));
    };
    return Nav;
}(React.Component));
exports.default = Nav;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Initial setup:
//     Collection of items up for bid, each with an array of bids, initialized with minimum bid
//     How to connect names with bids? Add { name: bid } to array? Or [ name, bid ]?
//
//     Something like:
//         let bids = {
//             newport_weekend: [ { null: 150 } ],
//             wine_tasting: [ { null: 30 } ],
//         }
//
//     bids.newport_weekend.push({ 'user_01': 155 });
Object.defineProperty(exports, "__esModule", { value: true });
var data = [
    {
        bids: [{ name: 'min', bid: 150 }],
        title: 'Lowell Weekend',
        description: "Enjoy a relaxing weekend in beautiful Lowell Massachussets. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        photos: null
    },
    {
        bids: [{ name: 'min', bid: 30 }],
        title: 'Ice Cream Tasting',
        description: "Taste some delicious ice cream! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        photos: null
    },
    {
        bids: [{ name: 'min', bid: 75 }],
        title: 'Wrestling Lessons',
        description: "Learn how to wrestle from the semi-pros! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        photos: null
    },
    {
        bids: [{ name: 'min', bid: 40 }],
        title: 'Game Night',
        description: "Fun and games! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        photos: null
    },
];
exports.default = data;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(2);
var App_1 = __webpack_require__(1);
ReactDOM.render(React.createElement(App_1.App, null), document.getElementById('main'));


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map