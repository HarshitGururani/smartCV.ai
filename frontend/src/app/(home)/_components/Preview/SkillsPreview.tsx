import { ResumeDataType } from "@/types/document-types";
import { SkeletonLoader } from "./ExperiencePreview";

interface SkillsPreviewProps {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}
const SkillsPreview = ({ resumeInfo, isLoading }: SkillsPreviewProps) => {
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full my-5">
      <h5
        className="text-center font-bold mb-2"
        style={{ color: resumeInfo?.themeColor || "" }}
      >
        Skills
      </h5>

      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor || "" }}
      />

      <div className="grid grid-cols-2 gap-3 pt-3 my-1 min-h-9">
        {resumeInfo?.skills?.map((skill, index) => (
          <div
            className="flex items-center justify-between md:gap-0 gap-2"
            key={index}
          >
            <h5 className="text-[13px]">{skill.name}</h5>
            {skill.rating && skill.name ? (
              <div className="h-2 bg-gray-200 w-[120px]">
                <div
                  className="h-2"
                  style={{
                    backgroundColor: resumeInfo.themeColor || "",
                    width: skill?.rating * 20 + "%",
                  }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPreview;
