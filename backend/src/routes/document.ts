import express, { Request, Response } from "express";

import { clerkClient } from "@clerk/express";
import prisma from "../../primsa";
import { extractAuth, generateUniqueId } from "../lib/helper";
import { validateRequest } from "../middlewares/validateRequest";
import { UpdateSchema } from "../validations/Document.schema";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.post("/create", validateRequest, async (req: Request, res: Response) => {
  const { title } = req.body;
  const auth = extractAuth(req);

  try {
    const user = await clerkClient.users.getUser(auth.userId as string);
    const authorEmail =
      user.emailAddresses[0]?.emailAddress || "unknown@example.com";
    const newDocument = await prisma.document.create({
      data: {
        documentId: generateUniqueId(),
        userId: auth.userId as string,
        title,
        authorName: user.fullName as string,
        authorEmail,
      },
    });
    console.log(newDocument);
    res
      .status(200)
      .json({ message: "Document created", document: newDocument });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all", validateRequest, async (req: Request, res: Response) => {
  const auth = extractAuth(req);
  try {
    const user = await clerkClient.users.getUser(auth.userId as string);
    const userId = user.id;

    const documents = await prisma.document.findMany({
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
  } catch (error) {
    console.log("Error fetching documents", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error,
    });
  }
});

router.get(
  "/:documentId",
  validateRequest,
  async (req: Request, res: Response) => {
    const auth = extractAuth(req);
    try {
      const { documentId } = req.params;
      const documentData = await prisma.document.findUnique({
        where: {
          userId: auth.userId as string,
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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch document",
        error: error,
      });
    }
  }
);

router.patch(
  "/updated/:documentId",
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { documentId } = req.params;

      type PersonalInfoType = Prisma.PersonalInfoUncheckedCreateInput;

      const {
        title,
        status,
        summary,
        themeColor,
        currentPosition,
        personalInfo,
        experience,
        education,
        skills,
        thumbnail,
      }: {
        title?: string;
        status?: string;
        summary?: string;
        themeColor?: string;
        currentPosition?: number;
        personalInfo?: PersonalInfoType;
        experience?: Prisma.ExperienceUncheckedCreateInput[];
        education?: Prisma.EducationUncheckedCreateInput[];
        skills?: Prisma.SkillUncheckedCreateInput[];
        thumbnail?: string;
      } = req.body;

      console.log(education);

      const userId = extractAuth(req).userId as string;
      if (!documentId) {
        res.status(400).json({ error: "DocumentId is required" });
      }
      await prisma.$transaction(async (trx) => {
        const existingDocument = await prisma.document.findUnique({
          where: {
            documentId,
            userId,
          },
        });

        if (!existingDocument) {
          return res.status(400).json({ error: "document not found" });
        }

        const resumeUpdate: Prisma.DocumentUpdateInput = {};
        if (title) resumeUpdate.title = title;
        if (thumbnail) resumeUpdate.thumbnail = thumbnail;
        if (summary) resumeUpdate.summary = summary;
        if (themeColor) resumeUpdate.themeColor = themeColor;
        if (status) resumeUpdate.status = status as any;
        if (currentPosition)
          resumeUpdate.currentPosition = currentPosition || 1;

        const documentData = await trx.document.update({
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

          const { docId: _, ...cleanPersonal } = personalInfo;
          await trx.personalInfo.upsert({
            where: { docId: existingDocument.id },
            update: personalInfo,
            create: { docId: existingDocument.id, ...cleanPersonal },
          });
        }

        if (experience?.length) {
          await Promise.all(
            experience.map(async (exp) => {
              const { docId: _, ...cleanExp } = exp;
              await trx.experience.upsert({
                where: { id: cleanExp.id ?? 0, docId: existingDocument.id },
                update: {
                  ...exp,
                  startDate: cleanExp.startDate
                    ? new Date(cleanExp.startDate)
                    : null,
                  endDate: cleanExp.endDate ? new Date(cleanExp.endDate) : null,
                },
                create: {
                  docId: existingDocument.id,
                  ...cleanExp,
                  startDate: cleanExp.startDate
                    ? new Date(cleanExp.startDate)
                    : null,
                  endDate: cleanExp.endDate ? new Date(cleanExp.endDate) : null,
                },
              });
            })
          );
        }

        if (education?.length) {
          await Promise.all(
            education.map(async (edu) => {
              const { docId: _, ...cleanEdu } = edu;

              await trx.education.upsert({
                where: { id: cleanEdu.id ?? 0, docId: existingDocument.id },
                update: {
                  ...edu,
                  startDate: cleanEdu.startDate
                    ? new Date(cleanEdu.startDate)
                    : null,
                  endDate: cleanEdu.endDate ? new Date(cleanEdu.endDate) : null,
                },
                create: {
                  docId: existingDocument.id,
                  ...cleanEdu,
                  startDate: cleanEdu.startDate
                    ? new Date(cleanEdu.startDate)
                    : null,
                  endDate: cleanEdu.endDate ? new Date(cleanEdu.endDate) : null,
                },
              });
            })
          );
        }

        if (skills && Array.isArray(skills)) {
          await Promise.all(
            skills.map(async (skill) => {
              const { docId: _, ...cleanSkill } = skill;

              await trx.skill.upsert({
                where: { id: cleanSkill.id ?? 0, docId: existingDocument.id },
                update: cleanSkill,
                create: { docId: existingDocument.id, ...cleanSkill },
              });
            })
          );
        }
        return res.status(200).json({
          success: true,
          message: "Document updated successfully",
        });
      });
    } catch (error: any) {
      console.log(error.stack);
      res.status(500).json({
        success: false,
        message: "Failed to update document",
        error: error,
      });
    }
  }
);

export default router;
