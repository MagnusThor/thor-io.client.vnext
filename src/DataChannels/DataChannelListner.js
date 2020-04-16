"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Listener_1 = require("../Listener");
var DataChannelListner = (function (_super) {
    __extends(DataChannelListner, _super);
    function DataChannelListner(channelName, topic, fn) {
        var _this = _super.call(this, topic, fn) || this;
        _this.channelName = channelName;
        _this.count = 0;
        return _this;
    }
    return DataChannelListner;
}(Listener_1.Listener));
exports.DataChannelListner = DataChannelListner;
