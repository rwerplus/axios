"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeConfig = void 0;
var util_1 = require("../tools/util");
var strategy = Object.create(null);
function defaultStrategy(valX, valY) {
    return typeof valY !== 'undefined' ? valY : valX;
}
/*只取val2*/
function fromVal2Strategy(val1, val2) {
    if (typeof val2 !== 'undefined')
        return val2;
}
var strategyKeysFromVal2 = ['url', 'params', 'data'];
strategyKeysFromVal2.forEach(function (key) {
    strategy[key] = fromVal2Strategy;
});
function deepMergeStrat(val1, val2) {
    if (util_1.isPlainObject(val2)) {
        return util_1.deepMerge(val1, val2);
    }
    else if (typeof val2 !== 'undefined') {
        return val2;
    }
    else if (util_1.isPlainObject(val1)) {
        return util_1.deepMerge(val1);
    }
    else if (typeof val1 !== 'undefined') {
        return val1;
    }
}
var stratKeysDeepMerge = ['headers'];
stratKeysDeepMerge.forEach(function (key) {
    strategy[key] = deepMergeStrat;
});
/*
* 深度合并请求头信息*/
function mergeConfig(conf1, conf2) {
    if (!conf2)
        conf2 = {};
    var config = Object.create(null);
    for (var key in conf2) {
        mergeField(key);
    }
    for (var key in conf1) {
        if (!conf2[key])
            mergeField(key);
    }
    function mergeField(key) {
        var strat = strategy[key] || defaultStrategy;
        config[key] = strat(conf1[key], conf2[key]);
    }
    return config;
}
exports.mergeConfig = mergeConfig;
//# sourceMappingURL=mergeConfig.js.map