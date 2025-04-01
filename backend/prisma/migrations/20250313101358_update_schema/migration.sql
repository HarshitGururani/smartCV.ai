/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'ARCHIVED';

-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "document" (
    "id" SERIAL NOT NULL,
    "document_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "summary" TEXT,
    "theme_color" TEXT NOT NULL DEFAULT '#7c3aed',
    "thumbnail" TEXT,
    "current_position" INTEGER NOT NULL DEFAULT 1,
    "status" "Status" NOT NULL DEFAULT 'PRIVATE',
    "author_name" VARCHAR(255) NOT NULL,
    "author_email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_info" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "job_title" VARCHAR(255),
    "address" VARCHAR(500),
    "phone" VARCHAR(50),
    "email" VARCHAR(255),

    CONSTRAINT "personal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "company_name" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "currently_working" BOOLEAN NOT NULL DEFAULT false,
    "work_summary" TEXT,
    "start_date" DATE,
    "end_date" DATE,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "university_name" VARCHAR(255),
    "degree" VARCHAR(255),
    "major" VARCHAR(255),
    "description" TEXT,
    "start_date" DATE,
    "end_date" DATE,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "rating" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_document_id_key" ON "document"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_info_document_id_key" ON "personal_info"("document_id");

-- AddForeignKey
ALTER TABLE "personal_info" ADD CONSTRAINT "personal_info_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
