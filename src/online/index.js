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
var consts_1 = require("../consts");
var OnlineRepository = /** @class */ (function () {
    function OnlineRepository(eventHandler, restProvider, modelToPkFn, baseUrl, urlBuilder) {
        this.eventHandler = eventHandler;
        this.restProvider = restProvider;
        this.modelToPkFn = modelToPkFn;
        this.baseUrl = baseUrl;
        this.urlBuilder = urlBuilder || this.defaultUrlBuilder;
    }
    OnlineRepository.prototype.defaultUrlBuilder = function (repoAction, baseUrl, params) {
        switch (repoAction) {
            case consts_1.REPO_ACTIONS.ADD:
                return baseUrl;
            case consts_1.REPO_ACTIONS.EDIT:
            case consts_1.REPO_ACTIONS.GET:
            case consts_1.REPO_ACTIONS.DELETE:
                return baseUrl + "/" + params.id;
            case consts_1.REPO_ACTIONS.SEARCH:
                return baseUrl + "/" + params.skip + "/" + params.limit;
        }
        return baseUrl;
    };
    OnlineRepository.prototype.add = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var url, eventPayload, resultModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.urlBuilder(consts_1.REPO_ACTIONS.ADD, this.baseUrl);
                        eventPayload = {
                            model: model,
                            repo: this,
                            url: url
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_ADD, eventPayload);
                        return [4 /*yield*/, this.restProvider.create(url, model)];
                    case 1:
                        resultModel = _a.sent();
                        eventPayload.model = resultModel;
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_ADD, eventPayload);
                        return [2 /*return*/, resultModel];
                }
            });
        });
    };
    OnlineRepository.prototype["delete"] = function (pk) {
        return __awaiter(this, void 0, void 0, function () {
            var pkStr, url, eventPayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pkStr = this.getPk(pk);
                        url = this.urlBuilder(consts_1.REPO_ACTIONS.DELETE, this.baseUrl, { id: pkStr });
                        eventPayload = {
                            primaryKey: pk,
                            repo: this,
                            url: url
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_DELETE, eventPayload);
                        return [4 /*yield*/, this.restProvider["delete"](url)];
                    case 1:
                        _a.sent();
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_DELETE, eventPayload);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    OnlineRepository.prototype.edit = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var pk, pkStr, url, eventPayload, resultModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pk = this.modelToPkFn(model);
                        pkStr = this.getPk(pk);
                        url = this.urlBuilder(consts_1.REPO_ACTIONS.EDIT, this.baseUrl, { id: pkStr });
                        eventPayload = {
                            model: model,
                            repo: this,
                            url: url
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_EDIT, eventPayload);
                        return [4 /*yield*/, this.restProvider.edit(url, model)];
                    case 1:
                        resultModel = _a.sent();
                        eventPayload.model = resultModel;
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_EDIT, eventPayload);
                        return [2 /*return*/, resultModel];
                }
            });
        });
    };
    OnlineRepository.prototype.get = function (primaryKey) {
        return __awaiter(this, void 0, void 0, function () {
            var pkStr, url, eventPayload, resultModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pkStr = this.getPk(primaryKey);
                        url = this.urlBuilder(consts_1.REPO_ACTIONS.GET, this.baseUrl, { id: pkStr });
                        eventPayload = {
                            model: null,
                            primaryKey: primaryKey,
                            repo: this,
                            url: url
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_GET, eventPayload);
                        return [4 /*yield*/, this.restProvider.get(url)];
                    case 1:
                        resultModel = _a.sent();
                        eventPayload.model = resultModel;
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_GET, eventPayload);
                        return [2 /*return*/, resultModel];
                }
            });
        });
    };
    OnlineRepository.prototype.search = function (mongoQuery, skip, limit) {
        if (skip === void 0) { skip = 0; }
        if (limit === void 0) { limit = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var url, eventPayload, dataArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.urlBuilder(consts_1.REPO_ACTIONS.SEARCH, this.baseUrl, { skip: skip, limit: limit });
                        eventPayload = {
                            limit: limit,
                            models: null,
                            mongoQuery: mongoQuery,
                            repo: this,
                            skip: skip,
                            url: url
                        };
                        this.eventHandler.emit(consts_1.EVENTS_CONST.BEFORE_SEARCH, eventPayload);
                        return [4 /*yield*/, this.restProvider.search(url, mongoQuery)];
                    case 1:
                        dataArray = _a.sent();
                        eventPayload.models = dataArray;
                        this.eventHandler.emit(consts_1.EVENTS_CONST.AFTER_SEARCH, eventPayload);
                        return [2 /*return*/, dataArray];
                }
            });
        });
    };
    OnlineRepository.prototype.getPk = function (primaryKey) {
        var key = typeof primaryKey === "string" ? primaryKey : JSON.stringify(primaryKey);
        return key;
    };
    return OnlineRepository;
}());
exports["default"] = OnlineRepository;
