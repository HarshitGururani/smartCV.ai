"use client";
import EditResume from "@/app/(home)/_components/EditResume";
import { ResumeInfoProvider } from "@/components/context/resume-info-provider";

const page = () => {
  return (
    <ResumeInfoProvider>
      <EditResume />
    </ResumeInfoProvider>
  );
};
export default page;
