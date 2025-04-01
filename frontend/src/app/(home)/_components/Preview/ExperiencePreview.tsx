import { Skeleton } from "@/components/ui/skeleton";
import { ResumeDataType } from "@/types/document-types";
import { format } from "date-fns";

interface ExperiencePreviewProps {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const ExperiencePreview = ({
  resumeInfo,
  isLoading,
}: ExperiencePreviewProps) => {
  if (isLoading) {
    return (
      <>
        <SkeletonLoader />
      </>
    );
  }
  return (
    <div className="w-full my-5">
      <h5
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor || "" }}
      >
        Professional Experience
      </h5>
      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor || "" }}
      />

      <div className="flex flex-col gap-2 min-h-9">
        {resumeInfo?.experiences?.map((experience, index) => (
          <div className="" key={index}>
            <h5
              className="text-[15px] font-bold"
              style={{ color: resumeInfo.themeColor || "" }}
            >
              {experience.title}
            </h5>
            <div className="flex items-start justify-between mb-2">
              <h5 className="text-[13px]">
                {experience.companyName}
                {experience.companyName && experience.city && ", "}
                {experience.city}
                {experience.companyName && experience.state && ", "}
                {experience.state}
              </h5>

              <span className="text-[13px]">
                {experience.startDate
                  ? format(new Date(experience.startDate), "MMM yyyy")
                  : ""}
                {experience.startDate && " - "}
                {experience.currentlyWorking
                  ? "Present"
                  : experience.endDate
                  ? format(new Date(experience.endDate), "MMM yyyy")
                  : ""}
              </span>
            </div>

            <div
              className="exp-preview leading-[14.6px] text-black dark:text-white"
              style={{ fontSize: "13px" }}
              dangerouslySetInnerHTML={{
                __html: experience?.workSummary || "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-2 pt-3">
      <Skeleton className="h-6 w-1/4 mx-auto mb-2" />
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-2">
          <Skeleton className="h-6 w-1/2 mb-1" />
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-3 w-1/2 mt-1" />
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;
