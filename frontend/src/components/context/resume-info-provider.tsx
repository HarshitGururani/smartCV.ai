"use client";
import useGetDocumentById from "@/app/mutations/use-get-document-by-id";
import { ResumeDataType } from "@/types/document-types";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type ResumeContextType = {
  resumeInfo: ResumeDataType | undefined;
  onUpdate: (data: ResumeDataType) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
};

export const ResumeInfoContext = createContext<ResumeContextType | undefined>(
  undefined
);

export const ResumeInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();

  const documentId = params.documentId as string;

  const { data, isError, isLoading, refetch, isSuccess } =
    useGetDocumentById(documentId);

  console.log(`Resume Info ${data}`);

  const [resumeInfo, setResumeInfo] = useState<ResumeDataType>();

  useEffect(() => {
    if (!data) return;
    const { data: documentData } = data;
    console.log(`resume info context:" ${documentData}`);

    setResumeInfo(documentData);
  }, []);

  const onUpdate = (data: ResumeDataType) => {
    setResumeInfo(data);
  };
  return (
    <ResumeInfoContext.Provider
      value={{ resumeInfo, onUpdate, isError, isLoading, isSuccess, refetch }}
    >
      {children}
    </ResumeInfoContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeInfoContext);
  if (!context) {
    throw new Error("useResumeContext must be within ResumeInfoProvider");
  }
  return context;
};
