"use client";
import useGetDocuments from "@/app/mutations/use-get-documents";
import { DocumentTypes } from "@/types/document-types";
import { Loader2, RotateCw } from "lucide-react";
import ResumeItem from "./ResumeItem";

const ResumeList = () => {
  const { data, isLoading, isError, refetch } = useGetDocuments();

  const resumes: DocumentTypes[] = data?.documents ?? [];

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center mx-5 ">
          <Loader2 className="size-10 animate-spin text-black dark:text-white" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center mx-5">
          <button className="flex items-center gap-1" onClick={() => refetch()}>
            <RotateCw size={"1em"} />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <>
          {resumes?.map((resume) => (
            <ResumeItem
              key={resume.documentId}
              documentId={resume.documentId}
              title={resume.title}
              status={resume.status}
              updatedAt={resume.updatedAt}
              themeColor={resume.themeColor}
              thumbnail={resume.thumbnail}
            />
          ))}
        </>
      )}
    </>
  );
};
export default ResumeList;
