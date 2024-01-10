"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBoolean = void 0;
function toBoolean(value) {
    value = value.toLowerCase();
    return value === 'true' || value === 'true' || value === '1' ? true : false;
}
exports.toBoolean = toBoolean;
//# sourceMappingURL=cast.helpers.js.map