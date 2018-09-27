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
exports.__esModule = true;
var sift_1 = require("sift");
var consts_1 = require("../consts");
var OfflineRepository = /** @class */ (function () {
    function OfflineRepository(modelClass, eventHandler, buffer, modelToPkFn) {
        this.modelClass = modelClass;
        this.eventHandler = eventHandler;
        this.buffer = buffer;
        this.modelToPkFn = modelToPkFn;
    }
    OfflineRepository.prototype.add = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var eventPayload, pk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventPayload = {
                            model: model,
                            repo: this
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_ADD, eventPayload);
                        pk = this.modelToPkFn(model);
                        return [4 /*yield*/, this.buffer.set(this.getPk(pk), model)];
                    case 1:
                        _a.sent();
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_ADD, eventPayload);
                        return [2 /*return*/, model];
                }
            });
        });
    };
    OfflineRepository.prototype["delete"] = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var eventPayload, pk, pkStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventPayload = {
                            model: model,
                            repo: this
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_DELETE, eventPayload);
                        if (model instanceof this.modelClass) {
                            pk = this.modelToPkFn(model);
                        }
                        else {
                            pk = model;
                        }
                        pkStr = this.getPk(pk);
                        return [4 /*yield*/, this.buffer.del(pkStr)];
                    case 1:
                        _a.sent();
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_DELETE, eventPayload);
                        return [2 /*return*/, model];
                }
            });
        });
    };
    OfflineRepository.prototype.edit = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var eventPayload, pk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventPayload = {
                            repo: this,
                            model: model
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_EDIT, eventPayload);
                        pk = this.modelToPkFn(model);
                        return [4 /*yield*/, this.buffer.set(this.getPk(pk), model)];
                    case 1:
                        _a.sent();
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_EDIT, eventPayload);
                        return [2 /*return*/, model];
                }
            });
        });
    };
    OfflineRepository.prototype.get = function (primaryKey) {
        return __awaiter(this, void 0, void 0, function () {
            var eventPayload, model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventPayload = {
                            repo: this,
                            primaryKey: primaryKey,
                            model: null
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_GET, eventPayload);
                        return [4 /*yield*/, this.buffer.get(this.getPk(primaryKey))];
                    case 1:
                        model = _a.sent();
                        eventPayload.model = model;
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_GET, eventPayload);
                        return [2 /*return*/, model];
                }
            });
        });
    };
    OfflineRepository.prototype.search = function (mongoQuery, skip, limit) {
        if (skip === void 0) { skip = 0; }
        if (limit === void 0) { limit = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var eventPayload, dataArray, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventPayload = {
                            repo: this,
                            mongoQuery: mongoQuery,
                            skip: skip,
                            limit: limit,
                            models: null
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_SEARCH, eventPayload);
                        return [4 /*yield*/, this.buffer.toArray(function (v) { return !!v; })];
                    case 1:
                        dataArray = _a.sent();
                        result = sift_1["default"](mongoQuery, dataArray)
                            .splice(skip, limit);
                        // fixme:: handle order in query
                        eventPayload.models = result;
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_SEARCH, eventPayload);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    OfflineRepository.prototype.getPk = function (primaryKey) {
        var key = typeof primaryKey === "string" ? primaryKey : JSON.stringify(primaryKey);
        return key;
    };
    return OfflineRepository;
}());
exports["default"] = OfflineRepository;
