import { z } from "zod";

// Define StatusEnum
export const StatusEnum = z.enum(["PRIVATE", "PUBLIC", "ARCHIVED"]);

export const documentSchema = z.object({
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
  createdAt: z.string().optional(), // API returns as an ISO date string
  updatedAt: z.string().optional(), // API returns as an ISO date string
});

// Type inference
export type DocumentTypes = z.infer<typeof documentSchema>;

export type StatusType = "ARCHIVED" | "PRIVATE" | "PUBLIC";

export type ExperienceType = {
  id?: number; // Only include if updating an existing record
  title: string | null;
  companyName: string | null;
  city: string | null;
  state: string | null;
  startDate: string | null; // Must be in "YYYY-MM-DD" format
  endDate?: string | null;
  currentlyWorking: boolean;
  workSummary: string | null;
};

export type EducationType = {
  id?: number;
  universityName: string | null;
  startDate: string | null; // Must be in "YYYY-MM-DD" format
  endDate: string | null;
  degree: string | null;
  major: string | null;
  description: string | null;
  currentlyPursuing?: boolean;
};

export type SkillType = {
  id?: number;
  name: string | null;
  rating?: number;
};

export type PersonalInfoType = {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type ResumeDataType = {
  id?: number;
  documentId?: string;
  title?: string;
  status?: StatusType;
  thumbnail?: string | null;
  personalInfo?: PersonalInfoType | null;
  themeColor?: string | null;
  currentPosition?: number | null;
  summary?: string | null;
  experiences?: ExperienceType[] | null;
  educations?: EducationType[] | null;
  skills?: SkillType[] | null;
  updatedAt?: string;
};
