"use client";
import { useResumeContext } from "@/components/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import PersonalInfoForm from "./form/PersonalInfoForm";
import SummaryForm from "./form/SummayForm";
import ExperienceForm from "./form/ExperienceForm";
import EducationForm from "./form/EducationForm";
import SkillsForm from "./form/SkillsForm";

const ResumeForm = () => {
  const { resumeInfo } = useResumeContext();
  const [activeFormIndex, setActiveFormIndex] = useState(1);

  const handleNext = () => {
    const newIndex = activeFormIndex + 1;
    setActiveFormIndex(newIndex);
  };
  return (
    <div className="flex flex-1 w-full lg:sticky lg:top-16">
      <div className="shadow-md rounded-md bg-white border-t-primary border-t-4 dark:bg-card dark:border dark:border-gray-800 w-full">
        <div className="flex items-center gap-1 px-3 justify-end border-b py-[7px] min-h-10">
          {activeFormIndex > 1 && (
            <Button
              className="px-2 py-1 h-auto"
              variant={"outline"}
              size={"default"}
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft className="size-4" />
              Previous
            </Button>
          )}

          <Button
            className="px-2 py-1 h-auto"
            variant={"outline"}
            size={"default"}
            disabled={
              activeFormIndex === 5 || resumeInfo?.status === "ARCHIVED"
            }
            onClick={handleNext}
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="px-5 py-3 pb-5">
          {/* Personal Info form */}

          {activeFormIndex === 1 && (
            <PersonalInfoForm handleNext={handleNext} />
          )}
          {activeFormIndex === 2 && <SummaryForm handleNext={handleNext} />}

          {activeFormIndex === 3 && <ExperienceForm handleNext={handleNext} />}

          {activeFormIndex === 4 && <EducationForm handleNext={handleNext} />}

          {activeFormIndex === 5 && <SkillsForm />}
        </div>
      </div>
    </div>
  );
};
export default ResumeForm;
