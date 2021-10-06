"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Axios_1 = require("./core/Axios");
var util_1 = require("./tools/util");
var defaults_1 = require("./defaults");
var mergeConfig_1 = require("./core/mergeConfig");
var CancelToken_1 = require("./cancel/CancelToken");
var Cancel_1 = require("./cancel/Cancel");
function createInstance(conf) {
    var context = new Axios_1.default(conf);
    var instance = Axios_1.default.prototype.request.bind(context);
    util_1.extend(instance, context);
    return instance;
}
var axios = createInstance(defaults_1.default);
axios.create = function (conf) {
    return createInstance(mergeConfig_1.mergeConfig(defaults_1.default, conf));
};
axios.CancelToken = CancelToken_1.default;
axios.Cancel = Cancel_1.default;
axios.isCancel = Cancel_1.isCancel;
exports.default = axios;
//# sourceMappingURL=axios.js.map