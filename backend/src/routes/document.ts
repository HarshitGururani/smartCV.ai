import express, { Request, Response } from "express";

import { clerkClient } from "@clerk/express";
import prisma from "../primsa";
import { extractAuth, generateUniqueId } from "../lib/helper";
import { validateRequest } from "../middlewares/validateRequest";
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
      console.log(documentData);

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

      // Make sure documentId is present in params
      if (!documentId) {
        res.status(400).json({ error: "DocumentId is required" });
        return;
      }

      // Extract userId from auth and check it
      const userId = extractAuth(req).userId as string;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized: Missing userId" });
        return;
      }

      // Define types for incoming data
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

      // Log education for debugging
      console.log(education);

      // Simple flag to track if response has been sent
      let responseSent = false;

      try {
        // Start transaction
        await prisma.$transaction(async (trx) => {
          const existingDocument = await trx.document.findUnique({
            where: {
              documentId,
              userId,
            },
          });

          if (!existingDocument) {
            res.status(400).json({ error: "Document not found" });
            responseSent = true;
            return;
          }

          // Prepare the data for updating the document
          const resumeUpdate: Prisma.DocumentUpdateInput = {};
          if (title) resumeUpdate.title = title;
          if (thumbnail) resumeUpdate.thumbnail = thumbnail;
          if (summary) resumeUpdate.summary = summary;
          if (themeColor) resumeUpdate.themeColor = themeColor;
          if (status) resumeUpdate.status = status as any;
          if (currentPosition)
            resumeUpdate.currentPosition = currentPosition || 1;

          // Update document data
          const documentData = await trx.document.update({
            where: {
              userId,
              documentId,
            },
            data: resumeUpdate,
          });

          if (!documentData) {
            res.status(400).json({ error: "Failed to update document" });
            responseSent = true;
            return;
          }

          // Update personalInfo if present
          if (personalInfo) {
            if (!personalInfo.firstName && !personalInfo.lastName) {
              // If both firstName and lastName are missing, skip update
              res.status(400).json({
                error:
                  "Personal info must contain either firstName or lastName",
              });
              responseSent = true;
              return;
            }

            const { docId: _, ...cleanPersonal } = personalInfo;
            await trx.personalInfo.upsert({
              where: { docId: existingDocument.id },
              update: personalInfo,
              create: { docId: existingDocument.id, ...cleanPersonal },
            });
          }

          // Handle experience updates
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
                    endDate: cleanExp.endDate
                      ? new Date(cleanExp.endDate)
                      : null,
                  },
                  create: {
                    docId: existingDocument.id,
                    ...cleanExp,
                    startDate: cleanExp.startDate
                      ? new Date(cleanExp.startDate)
                      : null,
                    endDate: cleanExp.endDate
                      ? new Date(cleanExp.endDate)
                      : null,
                  },
                });
              })
            );
          }

          // Handle education updates
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
                    endDate: cleanEdu.endDate
                      ? new Date(cleanEdu.endDate)
                      : null,
                  },
                  create: {
                    docId: existingDocument.id,
                    ...cleanEdu,
                    startDate: cleanEdu.startDate
                      ? new Date(cleanEdu.startDate)
                      : null,
                    endDate: cleanEdu.endDate
                      ? new Date(cleanEdu.endDate)
                      : null,
                  },
                });
              })
            );
          }

          // Handle skill updates
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
        });

        // Send success response only if we haven't sent an error response yet
        if (!responseSent) {
          res.status(200).json({
            success: true,
            message: "Document updated successfully",
          });
        }
      } catch (transactionError: any) {
        // Only send error response if we haven't sent one already
        if (!responseSent) {
          console.error("Transaction error:", transactionError);
          res.status(500).json({
            success: false,
            message: "Transaction failed",
            error: transactionError.message || transactionError,
          });
        }
      }
    } catch (error: any) {
      console.error(error.stack);
      res.status(500).json({
        success: false,
        message: "Failed to update document",
        error: error.message || error,
      });
    }
  }
);

export default router;
