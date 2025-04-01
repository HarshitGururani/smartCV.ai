"use client";
import { useResumeContext } from "@/components/context/resume-info-provider";
import { cn } from "@/lib/utils";
import PersonalInfo from "./Preview/PersonalInfo";
import Summary from "./Preview/Summary";
import ExperiencePreview from "./Preview/ExperiencePreview";
import EducationPreview from "./Preview/EducationPreview";
import SkillsPreview from "./Preview/SkillsPreview";

const PreviewSection = () => {
  const { resumeInfo, isLoading } = useResumeContext();

  return (
    <div
      className={cn(
        `shadow-lg bg-white w-full flex-[1.02] h-full p-10 dark:border dark:bg-card dark:border-b-gray-800 dark:border-x-gray-800 !font-open_sans`
      )}
      style={{ borderTop: `13px solid ${resumeInfo?.themeColor}` }}
      id="resume-preview-id"
    >
      {/* Personal Info */}
      <PersonalInfo resumeInfo={resumeInfo} isLoading={isLoading} />

      {/* Summary */}
      <Summary resumeInfo={resumeInfo} isLoading={isLoading} />

      {/* Professional exp */}
      <ExperiencePreview resumeInfo={resumeInfo} isLoading={isLoading} />

      {/* Educational Info */}
      <EducationPreview resumeInfo={resumeInfo} isLoading={isLoading} />

      {/* Skills */}
      <SkillsPreview resumeInfo={resumeInfo} isLoading={isLoading} />
    </div>
  );
};
export default PreviewSection;
