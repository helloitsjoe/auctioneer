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
// import data from '../data';
// import auctionData from '../data.json';
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this.updateData = _this.updateData.bind(_this);
        _this.url = 'http://localhost:3001/data';
        // this.url = 'https://server-nmpfdegzrw.now.sh/';
        // this.getData();
        _this.state = { data: _this.getData() };
        return _this;
    }
    App.prototype.getData = function () {
        var _this = this;
        return fetch(this.url).then(function (response) {
            console.log(response.status);
            response.json().then(function (jsonData) {
                console.log(jsonData);
                _this.setState({ data: jsonData });
            });
        });
    };
    App.prototype.updateData = function (newData, i) {
        var _this = this;
        var data = this.state.data.slice();
        data[i] = newData;
        return fetch(this.url, {
            method: 'POST',
            body: data
        }).then(function (res) {
            console.log(res);
            _this.setState({ data: data });
        });
    };
    App.prototype.render = function () {
        return (React.createElement("div", { className: "u-full-width well" },
            React.createElement(Nav_1.default, null),
            React.createElement(List_1.default, { data: this.state.data, updateData: this.updateData })));
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
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(props) {
        var _this = _super.call(this) || this;
        _this.quickBid = _this.quickBid.bind(_this);
        _this.toggleDescription = _this.toggleDescription.bind(_this);
        _this.bids = [];
        for (var j = 0; j < props.data.bids.length; j++) {
            _this.bids.push(props.data.bids[j].bid);
        }
        _this.state = {
            highBid: _this.getHighBid()
        };
        return _this;
    }
    Item.prototype.render = function () {
        return (React.createElement("div", { className: "item-group clearfix", onClick: this.toggleDescription },
            React.createElement("div", { className: "item-container" },
                React.createElement("div", { className: "item-title u-pull-left" },
                    React.createElement("span", null, this.props.data.title)),
                React.createElement("div", { className: "button-box u-pull-right" },
                    React.createElement("span", { className: "bid-text", id: "bid-text" + this.props.id }, "High bid:"),
                    React.createElement("button", { className: "high-bid", id: "high-bid-" + this.props.id }, this.state.highBid),
                    React.createElement("button", { className: "bid btn", onClick: this.quickBid },
                        "Bid ",
                        this.state.highBid + 5))),
            React.createElement("div", { className: "description", id: "description-" + this.props.id }, this.props.data.description)));
    };
    ;
    Item.prototype.getHighBid = function () {
        return Math.max.apply(null, this.bids);
    };
    Item.prototype.quickBid = function (e) {
        e.stopPropagation();
        var newBid = this.getHighBid() + 5;
        this.bids.push(newBid);
        this.props.data.bids.push({ name: 'user01', bid: newBid });
        this.setState({ highBid: this.getHighBid() });
        document.getElementById('high-bid-' + this.props.id).classList.add('bid-bg');
        var yourBid = document.getElementById('bid-text' + this.props.id);
        yourBid.innerHTML = 'Your bid:';
        yourBid.classList.add('yours');
        this.props.updateData(this.props.data, this.props.id);
        // TODO: Update DB
    };
    Item.prototype.toggleDescription = function (e) {
        e.stopPropagation();
        var description = document.getElementById('description-' + this.props.id);
        description.classList.toggle('open');
        // TODO: Add photos
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
var List = (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.render = function () {
        var items = [];
        for (var i = 0, datum = void 0; datum = this.props.data[i]; i++) {
            items.push(React.createElement(Item_1.default, { data: datum, key: i, id: i, updateData: this.props.updateData }));
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
/* 6 */,
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