"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.skillSchema = exports.educationSchema = exports.experienceSchema = exports.personalInfoSchema = exports.documentSchema = exports.StatusEnum = void 0;
const zod_1 = require("zod");
exports.StatusEnum = zod_1.z.enum(["ARCHIVED", "PRIVATE", "PUBLIC"]);
// Document Schema
exports.documentSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    documentId: zod_1.z.string(),
    userId: zod_1.z.string(),
    title: zod_1.z
        .string()
        .min(1, { message: "Title is required." })
        .max(255, { message: "Title cannot exceed 255 characters." }),
    summary: zod_1.z.string().optional(),
    themeColor: zod_1.z.string().default("#7c3aed"),
    thumbnail: zod_1.z.string().optional(),
    currentPosition: zod_1.z.number().int().positive().default(1),
    status: exports.StatusEnum.default("PRIVATE"),
    authorName: zod_1.z
        .string()
        .max(255, { message: "Author name cannot exceed 255 characters." }),
    authorEmail: zod_1.z
        .string()
        .email({ message: "Email is not valid." })
        .max(255, { message: "Email cannot exceed 255 characters." }),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
// Personal Info Schema
exports.personalInfoSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    docId: zod_1.z.number().int().positive(),
    firstName: zod_1.z
        .string()
        .max(255, { message: "First name cannot exceed 255 characters." })
        .optional(),
    lastName: zod_1.z
        .string()
        .max(255, { message: "Last name cannot exceed 255 characters." })
        .optional(),
    jobTitle: zod_1.z
        .string()
        .max(255, { message: "Job title cannot exceed 255 characters." })
        .optional(),
    address: zod_1.z
        .string()
        .max(500, { message: "Address cannot exceed 500 characters." })
        .optional(),
    phone: zod_1.z
        .string()
        .max(50, { message: "Phone number cannot exceed 50 characters." })
        .optional(),
    email: zod_1.z
        .string()
        .email({ message: "Email is not valid." })
        .max(255, { message: "Email cannot exceed 255 characters." })
        .optional(),
});
// Experience Schema
exports.experienceSchema = zod_1.z
    .object({
    id: zod_1.z.number().int().positive(),
    docId: zod_1.z.number().int().positive(),
    title: zod_1.z
        .string()
        .max(255, { message: "Title cannot exceed 255 characters." })
        .optional(),
    companyName: zod_1.z
        .string()
        .max(255, { message: "Company name cannot exceed 255 characters." })
        .optional(),
    city: zod_1.z
        .string()
        .max(255, { message: "City name cannot exceed 255 characters." })
        .optional(),
    state: zod_1.z
        .string()
        .max(255, { message: "State name cannot exceed 255 characters." })
        .optional(),
    currentlyWorking: zod_1.z.boolean().default(false),
    workSummary: zod_1.z.string().optional(),
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
})
    .refine((data) => {
    if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
    }
    return true;
}, {
    message: "End date must be after start date.",
    path: ["endDate"],
});
//  Education Schema
exports.educationSchema = zod_1.z
    .object({
    id: zod_1.z.number().int().positive(),
    docId: zod_1.z.number().int().positive(),
    universityName: zod_1.z
        .string()
        .max(255, { message: "University name cannot exceed 255 characters." })
        .optional(),
    degree: zod_1.z
        .string()
        .max(255, { message: "Degree name cannot exceed 255 characters." })
        .optional(),
    major: zod_1.z
        .string()
        .max(255, { message: "Major name cannot exceed 255 characters." })
        .optional(),
    description: zod_1.z.string().optional(),
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
})
    .refine((data) => {
    if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
    }
    return true;
}, {
    message: "End date must be after start date.",
    path: ["endDate"],
});
//  Skill Schema
exports.skillSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    docId: zod_1.z.number().int().positive(),
    name: zod_1.z
        .string()
        .max(255, { message: "Skill name cannot exceed 255 characters." })
        .optional(),
    rating: zod_1.z
        .number()
        .int()
        .min(0, { message: "Rating must be at least 0." })
        .max(5, { message: "Rating cannot exceed 5." })
        .default(0),
});
//Update Schema (Using `.partiaSchema
exports.updateSchema = exports.documentSchema
    .omit({ id: true, documentId: true })
    .extend({
    personalInfo: exports.personalInfoSchema.optional(),
    education: zod_1.z.array(exports.educationSchema).optional(),
    experience: zod_1.z.array(exports.experienceSchema).optional(),
    skills: zod_1.z.array(exports.skillSchema).optional(),
})
    .partial();
