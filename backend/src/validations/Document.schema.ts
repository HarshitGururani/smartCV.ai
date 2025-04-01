import { z } from "zod";

export const StatusEnum = z.enum(["ARCHIVED", "PRIVATE", "PUBLIC"]);

// Document Schema
export const documentSchema = z.object({
  id: z.number().int().positive(),
  documentId: z.string(),
  userId: z.string(),
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(255, { message: "Title cannot exceed 255 characters." }),
  summary: z.string().optional(),
  themeColor: z.string().default("#7c3aed"),
  thumbnail: z.string().optional(),
  currentPosition: z.number().int().positive().default(1),
  status: StatusEnum.default("PRIVATE"),
  authorName: z
    .string()
    .max(255, { message: "Author name cannot exceed 255 characters." }),
  authorEmail: z
    .string()
    .email({ message: "Email is not valid." })
    .max(255, { message: "Email cannot exceed 255 characters." }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Personal Info Schema
export const personalInfoSchema = z.object({
  id: z.number().int().positive(),
  docId: z.number().int().positive(),
  firstName: z
    .string()
    .max(255, { message: "First name cannot exceed 255 characters." })
    .optional(),
  lastName: z
    .string()
    .max(255, { message: "Last name cannot exceed 255 characters." })
    .optional(),
  jobTitle: z
    .string()
    .max(255, { message: "Job title cannot exceed 255 characters." })
    .optional(),
  address: z
    .string()
    .max(500, { message: "Address cannot exceed 500 characters." })
    .optional(),
  phone: z
    .string()
    .max(50, { message: "Phone number cannot exceed 50 characters." })
    .optional(),
  email: z
    .string()
    .email({ message: "Email is not valid." })
    .max(255, { message: "Email cannot exceed 255 characters." })
    .optional(),
});

// Experience Schema
export const experienceSchema = z
  .object({
    id: z.number().int().positive(),
    docId: z.number().int().positive(),
    title: z
      .string()
      .max(255, { message: "Title cannot exceed 255 characters." })
      .optional(),
    companyName: z
      .string()
      .max(255, { message: "Company name cannot exceed 255 characters." })
      .optional(),
    city: z
      .string()
      .max(255, { message: "City name cannot exceed 255 characters." })
      .optional(),
    state: z
      .string()
      .max(255, { message: "State name cannot exceed 255 characters." })
      .optional(),
    currentlyWorking: z.boolean().default(false),
    workSummary: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    }
  );

//  Education Schema
export const educationSchema = z
  .object({
    id: z.number().int().positive(),
    docId: z.number().int().positive(),
    universityName: z
      .string()
      .max(255, { message: "University name cannot exceed 255 characters." })
      .optional(),
    degree: z
      .string()
      .max(255, { message: "Degree name cannot exceed 255 characters." })
      .optional(),
    major: z
      .string()
      .max(255, { message: "Major name cannot exceed 255 characters." })
      .optional(),
    description: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    }
  );

//  Skill Schema
export const skillSchema = z.object({
  id: z.number().int().positive(),
  docId: z.number().int().positive(),
  name: z
    .string()
    .max(255, { message: "Skill name cannot exceed 255 characters." })
    .optional(),
  rating: z
    .number()
    .int()
    .min(0, { message: "Rating must be at least 0." })
    .max(5, { message: "Rating cannot exceed 5." })
    .default(0),
});

//Update Schema (Using `.partiaSchema
export const updateSchema = documentSchema
  .omit({ id: true, documentId: true })
  .extend({
    personalInfo: personalInfoSchema.optional(),
    education: z.array(educationSchema).optional(),
    experience: z.array(experienceSchema).optional(),
    skills: z.array(skillSchema).optional(),
  })
  .partial();

export type DocumentSchema = z.infer<typeof documentSchema>;
export type PersonalInfoSchema = z.infer<typeof personalInfoSchema>;
export type ExperienceSchema = z.infer<typeof experienceSchema>;
export type EducationSchema = z.infer<typeof educationSchema>;
export type SkillSchema = z.infer<typeof skillSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
