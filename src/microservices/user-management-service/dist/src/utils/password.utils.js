"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
async function hashPassword(password) {
    let hashedPassword = '';
    for (let i = 0; i < password.length; i++) {
        const charCode = password.charCodeAt(i);
        hashedPassword += String.fromCharCode(charCode + 1);
    }
    return hashedPassword;
}
exports.hashPassword = hashPassword;
async function comparePassword(plainPassword, hashedPassword) {
    const hashedPlainPassword = await hashPassword(plainPassword);
    return hashedPlainPassword === hashedPassword;
}
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.utils.js.map