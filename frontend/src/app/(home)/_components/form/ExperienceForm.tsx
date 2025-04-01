/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useUpdateDocument from "@/app/mutations/use-update-documents";
import { useResumeContext } from "@/components/context/resume-info-provider";
import RichTextEditor from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateThumbnail } from "@/lib/helper";
import { ExperienceType } from "@/types/document-types";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ExperienceFormProps {
  handleNext: () => void;
}

const initialState = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
  currentlyWorking: false,
};

const ExperienceForm = ({ handleNext }: ExperienceFormProps) => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { isPending, mutateAsync } = useUpdateDocument();

  const [experiencedList, setExperiencedList] = useState<ExperienceType[]>(
    Array.isArray(resumeInfo?.experiences) && resumeInfo.experiences.length
      ? resumeInfo.experiences
      : [initialState]
  );

  useEffect(() => {
    if (!resumeInfo) return;

    onUpdate({
      ...resumeInfo,
      experiences: experiencedList,
    });
  }, [experiencedList]);

  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;

    //this because experienced list is an array
    setExperiencedList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const addNewExperience = () => {
    setExperiencedList([...experiencedList, initialState]);
  };

  const removeNewExperience = (index: number) => {
    const updatedExperience = [...experiencedList];
    updatedExperience.splice(index, 1);
    setExperiencedList(updatedExperience);
  };

  const handleEditor = (name: string, index: number, value: string) => {
    setExperiencedList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      currentPosition: resumeInfo?.currentPosition
        ? resumeInfo.currentPosition + 1
        : 1,
      thumbnail: await generateThumbnail(),
      experience: experiencedList,
    };

    console.log("Final Payload Sent to Backend:", payload);

    try {
      await mutateAsync(payload);
      toast.success("Experience Updated successfully");
      handleNext();
    } catch (error) {
      console.error("Mutation error:", error);
      toast.error("Failed to update experience");
    }
  };

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p className="text-sm">Add previous job experience</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {experiencedList?.map((item, index) => (
            <div key={index}>
              <div
                className="relative grid 
                  grid-cols-2 mb-5 pt-4 gap-3"
              >
                {experiencedList.length > 1 && (
                  <Button
                    variant={"secondary"}
                    type="button"
                    className="size-5 text-center rounded-full absolute -top-3 -right-5 bg-black dark:bg-gray-600 text-white"
                    size={"icon"}
                    onClick={() => removeNewExperience(index)}
                  >
                    <X className="size-3" />
                  </Button>
                )}
                <div>
                  <Label className="text-sm">Position title</Label>
                  <Input
                    name="title"
                    placeholder=""
                    required
                    value={item.title || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <Label className="text-sm">Company name</Label>
                  <Input
                    name="companyName"
                    placeholder=""
                    required
                    value={item.companyName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">City</Label>
                  <Input
                    name="city"
                    placeholder=""
                    required
                    value={item.city || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">State</Label>
                  <Input
                    name="state"
                    placeholder=""
                    required
                    value={item.state || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Start Date</Label>
                  <Input
                    name="startDate"
                    type="date"
                    placeholder=""
                    required
                    value={item.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">End Date</Label>
                  <Input
                    name="endDate"
                    type="date"
                    placeholder=""
                    required
                    value={item.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div className="col-span-2 mt-1">
                  <RichTextEditor
                    jobTitle={item.title}
                    initialValue={item.workSummary || ""}
                    index={index}
                    onEditorChange={handleEditor}
                  />
                </div>
                {index === experiencedList.length - 1 &&
                  experiencedList.length < 5 && (
                    <Button
                      className="gap-1 text-primary border-primary/50"
                      variant={"outline"}
                      type="button"
                      onClick={addNewExperience}
                    >
                      <Plus className="size-4" />
                      Add More Experience
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin size-4" />}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};
export default ExperienceForm;
