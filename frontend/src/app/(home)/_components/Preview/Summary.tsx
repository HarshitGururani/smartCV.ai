import { Skeleton } from "@/components/ui/skeleton";
import { ResumeDataType } from "@/types/document-types";

interface SummaryProps {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}
const Summary = ({ isLoading, resumeInfo }: SummaryProps) => {
  return (
    <div className="w-full min-h-10">
      {isLoading ? (
        <Skeleton className="h-6 w-full" />
      ) : (
        <p className="text-[13px] leading-4">
          {resumeInfo?.summary ||
            "Enter a brief description of your professional background"}
        </p>
      )}
    </div>
  );
};

export default Summary;
