"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_1 = require("@clerk/express");
const validateRequest = (req, res, next) => {
    const auth = (0, express_1.getAuth)(req);
    if (!auth.sessionId) {
        res.status(401).json({ message: "Unauth`orized" });
        return;
    }
    req.auth = auth;
    next();
};
exports.validateRequest = validateRequest;
