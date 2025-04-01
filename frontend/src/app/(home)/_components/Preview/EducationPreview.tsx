import { ResumeDataType } from "@/types/document-types";
import { SkeletonLoader } from "./ExperiencePreview";
import { format } from "date-fns";

interface EducationPreviewProps {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const EducationPreview = ({ resumeInfo, isLoading }: EducationPreviewProps) => {
  if (isLoading) {
    return <SkeletonLoader />;
  }
  return (
    <div className="w-full my-5">
      <h5
        className="text-center font-bold mb-2"
        style={{ color: resumeInfo?.themeColor || "" }}
      >
        Education
      </h5>
      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor || "" }}
      />

      <div className="flex flex-col gap-2 min-h-9">
        {resumeInfo?.educations?.map((education, index) => (
          <div key={index}>
            <h5
              className="text-sm font-bold"
              style={{ color: resumeInfo.themeColor || "" }}
            >
              {education.universityName}
            </h5>
            <div className="flex items-start justify-between ">
              <h5 className="text-[13px]">
                {education.degree}
                {education.degree && education.major && " in "}{" "}
                {" " + education.major}
              </h5>

              <span className="text-[13px] flex flex-col gap-2">
                {education.startDate &&
                  format(new Date(education.startDate), "MMM yyyy")}

                {education.startDate &&
                  (education.endDate || education.currentlyPursuing) &&
                  " - "}
                {education.currentlyPursuing
                  ? "Currently Pursuing"
                  : education.endDate &&
                    format(new Date(education.endDate), "MMM yyyy")}
              </span>
            </div>
            <p className="text-[13px] leading-4 mt-2">
              {resumeInfo?.summary ||
                "Enter a brief description of your professional background"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EducationPreview;
