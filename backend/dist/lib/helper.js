"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAuth = exports.generateUniqueId = void 0;
const uuid_1 = require("uuid");
const generateUniqueId = () => {
    const uuid = (0, uuid_1.v4)().replace(/-/g, "");
    return `doc-${uuid.substring(0, 16)}`;
};
exports.generateUniqueId = generateUniqueId;
const extractAuth = (req) => {
    return req.auth;
};
exports.extractAuth = extractAuth;
