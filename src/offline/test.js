"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var memkvstore_1 = require("circular_buffer/src/modules/memkvstore");
var persistable_circularbuffer_1 = require("circular_buffer/src/modules/persistable_circularbuffer");
var index_1 = require("./index");
var EventHandler_1 = require("@hichestan/ui-misc/src/EventHandler");
var Model = /** @class */ (function () {
    function Model() {
    }
    return Model;
}());
var Model2 = /** @class */ (function () {
    function Model2() {
    }
    return Model2;
}());
var Main = function () { return __awaiter(_this, void 0, void 0, function () {
    var store, buffer, eventHandler, offRepo, i, newModel, newModel2, searchResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                store = new memkvstore_1["default"]();
                buffer = new persistable_circularbuffer_1["default"](1000, store, "test");
                eventHandler = EventHandler_1["default"].getInstance("test");
                offRepo = new index_1["default"](new Model(), eventHandler, buffer, function (x) { return x.p1; });
                eventHandler.on(index_1.EVENTS_CONST.BEFORE_ADD, function (x) {
                    console.log(index_1.EVENTS_CONST.BEFORE_ADD, x);
                });
                eventHandler.on(index_1.EVENTS_CONST.AFTER_ADD, function (x) {
                    console.log(index_1.EVENTS_CONST.AFTER_ADD, x);
                });
                eventHandler.on(index_1.EVENTS_CONST.BEFORE_SEARCH, function (x) {
                    console.log(index_1.EVENTS_CONST.BEFORE_SEARCH, x);
                });
                eventHandler.on(index_1.EVENTS_CONST.AFTER_SEARCH, function (x) {
                    console.log(index_1.EVENTS_CONST.AFTER_SEARCH, x);
                });
                for (i = 0; i < 3; i++) {
                    newModel = new Model();
                    newModel.p1 = i;
                    newModel.p2 = "model 1 " + i;
                    newModel2 = new Model2();
                    newModel2.p1 = i;
                    newModel2.p2 = "model 2 " + i;
                    newModel2.p3 = newModel;
                    offRepo.add(newModel2);
                }
                return [4 /*yield*/, offRepo.search({ $or: [{ p1: 1 }, { 'p3.p1': 2 }] })];
            case 1:
                searchResult = _a.sent();
                console.log("searchResult: ", searchResult);
                return [2 /*return*/];
        }
    });
}); };
Main();
