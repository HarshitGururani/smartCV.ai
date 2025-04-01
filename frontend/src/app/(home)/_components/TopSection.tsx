"use client";

import { useResumeContext } from "@/components/context/resume-info-provider";
import { AlertCircle } from "lucide-react";
import ResumeTitle from "./ResumeTitle";
import useUpdateDocument from "@/app/mutations/use-update-documents";
import { useCallback } from "react";
import toast from "react-hot-toast";
import ThemeColor from "./ThemeColor";
import PreviewModal from "./Preview/PreviewModal";
import Download from "./Download";

const TopSection = () => {
  const { resumeInfo, isLoading, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();

  const handleTitle = useCallback(
    (title: string) => {
      if (title === "Untitled Resume" && !title) return;
      onUpdate({
        ...resumeInfo,
        title,
      });

      mutateAsync(
        {
          title,
        },
        {
          onSuccess: () => {
            toast.success("Title updated successfully");
          },
          onError: () => {
            toast.error("Failed to update the title");
          },
        }
      );
    },
    [onUpdate, resumeInfo, mutateAsync]
  );
  console.log(resumeInfo?.title);
  return (
    <>
      {resumeInfo?.status === "ARCHIVED" && (
        <div className="absolute z-[9] inset-0 h-6 top-0 bg-rose-500 text-center text-base p-2 text-white flex items-center gap-x-2 justify-center font-medium">
          <AlertCircle className="size-4" />
          This resume is in the trash bin.
        </div>
      )}

      <div className="w-full flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <ResumeTitle
            isLoading={isLoading || isPending}
            status={resumeInfo?.status}
            initialTitle={resumeInfo?.title || ""}
            onSave={(value) => handleTitle(value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <ThemeColor />

          {/* Preview Modal  */}
          <PreviewModal />

          {/* Download Resume */}
          <Download
            title={resumeInfo?.title || "Untitled Resume"}
            isLoading={isLoading}
          />

          {/* Share Resume */}
        </div>
      </div>
    </>
  );
};
export default TopSection;
