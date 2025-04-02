"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
app.use(express_1.default.json()); // Parse JSON request body
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded body (optional)
const allowedOrigins = [
    "http://localhost:3000", // Local frontend
    "https://smart-cv-ai-pi.vercel.app", // Production frontend
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use((0, express_2.clerkMiddleware)({
    authorizedParties: ["https://smart-cv-ai-pi.vercel.app"],
    jwtKey: process.env.CLERK_JWT_PUBLIC_KEY,
}));
app.use((req, res, next) => {
    console.log("Request Headers:", req.headers);
    next();
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: "test data" });
}));
app.get("/test", validateRequest_1.validateRequest, (req, res) => {
    const auth = req.auth;
    res.status(200).json({ message: auth });
});
app.use("/api/document", document_1.default);
app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});
