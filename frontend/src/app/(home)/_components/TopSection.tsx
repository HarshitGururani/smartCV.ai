"use client";

import useUpdateDocument from "@/app/mutations/use-update-documents";
import { useResumeContext } from "@/components/context/resume-info-provider";
import { useCallback } from "react";
import toast from "react-hot-toast";
import Download from "./Download";
import PreviewModal from "./Preview/PreviewModal";
import ResumeTitle from "./ResumeTitle";
import ThemeColor from "./ThemeColor";

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
