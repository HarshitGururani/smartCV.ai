"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
require("dotenv/config");
const validateRequest_1 = require("./middlewares/validateRequest");
const document_1 = __importDefault(require("./routes/document"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:3000", // Local frontend
    "https://smart-cv-ai-pi.vercel.app", // Production frontend
];
app.use(express_1.default.json()); // Parse JSON request body
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded body (optional)
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use((0, express_2.clerkMiddleware)());
app.use("/api/document", document_1.default);
app.get("/", validateRequest_1.validateRequest, (req, res) => {
    const auth = req.auth;
    res.status(200).json({ message: auth });
});
app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});
