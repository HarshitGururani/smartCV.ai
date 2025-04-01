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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
const primsa_1 = __importDefault(require("../primsa"));
const helper_1 = require("../lib/helper");
const validateRequest_1 = require("../middlewares/validateRequest");
const router = express_1.default.Router();
router.post("/create", validateRequest_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title } = req.body;
    const auth = (0, helper_1.extractAuth)(req);
    try {
        const user = yield express_2.clerkClient.users.getUser(auth.userId);
        const authorEmail = ((_a = user.emailAddresses[0]) === null || _a === void 0 ? void 0 : _a.emailAddress) || "unknown@example.com";
        const newDocument = yield primsa_1.default.document.create({
            data: {
                documentId: (0, helper_1.generateUniqueId)(),
                userId: auth.userId,
                title,
                authorName: user.fullName,
                authorEmail,
            },
        });
        console.log(newDocument);
        res
            .status(200)
            .json({ message: "Document created", document: newDocument });
    }
    catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/all", validateRequest_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = (0, helper_1.extractAuth)(req);
    try {
        const user = yield express_2.clerkClient.users.getUser(auth.userId);
        const userId = user.id;
        const documents = yield primsa_1.default.document.findMany({
            where: {
                userId,
                status: {
                    not: "ARCHIVED",
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
        res.status(200).json({ success: true, documents });
    }
    catch (error) {
        console.log("Error fetching documents", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch documents",
            error: error,
        });
    }
}));
router.get("/:documentId", validateRequest_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = (0, helper_1.extractAuth)(req);
    try {
        const { documentId } = req.params;
        const documentData = yield primsa_1.default.document.findUnique({
            where: {
                userId: auth.userId,
                documentId,
            },
            include: {
                personalInfo: true,
                educations: true,
                experiences: true,
                skills: true,
            },
        });
        res.status(200).json({ success: true, data: documentData });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch document",
            error: error,
        });
    }
}));
router.patch("/updated/:documentId", validateRequest_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentId } = req.params;
        const { title, status, summary, themeColor, currentPosition, personalInfo, experience, education, skills, thumbnail, } = req.body;
        console.log(education);
        const userId = (0, helper_1.extractAuth)(req).userId;
        if (!documentId) {
            res.status(400).json({ error: "DocumentId is required" });
        }
        yield primsa_1.default.$transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const existingDocument = yield primsa_1.default.document.findUnique({
                where: {
                    documentId,
                    userId,
                },
            });
            if (!existingDocument) {
                return res.status(400).json({ error: "document not found" });
            }
            const resumeUpdate = {};
            if (title)
                resumeUpdate.title = title;
            if (thumbnail)
                resumeUpdate.thumbnail = thumbnail;
            if (summary)
                resumeUpdate.summary = summary;
            if (themeColor)
                resumeUpdate.themeColor = themeColor;
            if (status)
                resumeUpdate.status = status;
            if (currentPosition)
                resumeUpdate.currentPosition = currentPosition || 1;
            const documentData = yield trx.document.update({
                where: {
                    userId,
                    documentId,
                },
                data: resumeUpdate,
            });
            if (!documentData) {
                return res.status(400).json({ error: "Failed to update document" });
            }
            if (personalInfo) {
                if (!personalInfo.firstName && !personalInfo.lastName) {
                    return;
                }
                const { docId: _ } = personalInfo, cleanPersonal = __rest(personalInfo, ["docId"]);
                yield trx.personalInfo.upsert({
                    where: { docId: existingDocument.id },
                    update: personalInfo,
                    create: Object.assign({ docId: existingDocument.id }, cleanPersonal),
                });
            }
            if (experience === null || experience === void 0 ? void 0 : experience.length) {
                yield Promise.all(experience.map((exp) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    const { docId: _ } = exp, cleanExp = __rest(exp, ["docId"]);
                    yield trx.experience.upsert({
                        where: { id: (_a = cleanExp.id) !== null && _a !== void 0 ? _a : 0, docId: existingDocument.id },
                        update: Object.assign(Object.assign({}, exp), { startDate: cleanExp.startDate
                                ? new Date(cleanExp.startDate)
                                : null, endDate: cleanExp.endDate ? new Date(cleanExp.endDate) : null }),
                        create: Object.assign(Object.assign({ docId: existingDocument.id }, cleanExp), { startDate: cleanExp.startDate
                                ? new Date(cleanExp.startDate)
                                : null, endDate: cleanExp.endDate ? new Date(cleanExp.endDate) : null }),
                    });
                })));
            }
            if (education === null || education === void 0 ? void 0 : education.length) {
                yield Promise.all(education.map((edu) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    const { docId: _ } = edu, cleanEdu = __rest(edu, ["docId"]);
                    yield trx.education.upsert({
                        where: { id: (_a = cleanEdu.id) !== null && _a !== void 0 ? _a : 0, docId: existingDocument.id },
                        update: Object.assign(Object.assign({}, edu), { startDate: cleanEdu.startDate
                                ? new Date(cleanEdu.startDate)
                                : null, endDate: cleanEdu.endDate ? new Date(cleanEdu.endDate) : null }),
                        create: Object.assign(Object.assign({ docId: existingDocument.id }, cleanEdu), { startDate: cleanEdu.startDate
                                ? new Date(cleanEdu.startDate)
                                : null, endDate: cleanEdu.endDate ? new Date(cleanEdu.endDate) : null }),
                    });
                })));
            }
            if (skills && Array.isArray(skills)) {
                yield Promise.all(skills.map((skill) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    const { docId: _ } = skill, cleanSkill = __rest(skill, ["docId"]);
                    yield trx.skill.upsert({
                        where: { id: (_a = cleanSkill.id) !== null && _a !== void 0 ? _a : 0, docId: existingDocument.id },
                        update: cleanSkill,
                        create: Object.assign({ docId: existingDocument.id }, cleanSkill),
                    });
                })));
            }
            return res.status(200).json({
                success: true,
                message: "Document updated successfully",
            });
        }));
    }
    catch (error) {
        console.log(error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to update document",
            error: error,
        });
    }
}));
exports.default = router;
