"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
const saltRounds = 10;
async function hashPassword(password) {
    return (0, bcrypt_1.hash)(password, saltRounds);
}
exports.hashPassword = hashPassword;
async function comparePassword(plainPassword, hashedPassword) {
    return (0, bcrypt_1.compare)(plainPassword, hashedPassword);
}
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.utils.js.map