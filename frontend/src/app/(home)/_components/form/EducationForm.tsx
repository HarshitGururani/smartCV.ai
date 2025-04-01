"use client";

import useUpdateDocument from "@/app/mutations/use-update-documents";
import { useResumeContext } from "@/components/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateThumbnail } from "@/lib/helper";
import { EducationType } from "@/types/document-types";
import { Loader2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ExperienceFormProps {
  handleNext: () => void;
}

const initialState = {
  universityName: "",
  degree: "",
  description: "",
  endDate: "",
  major: "",
  startDate: "",
  currentlyPursuing: false,
};

const EducationForm = ({ handleNext }: ExperienceFormProps) => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [educationList, setEducationList] = useState<EducationType[]>(
    Array.isArray(resumeInfo?.educations) && resumeInfo.educations.length
      ? resumeInfo.educations
      : [initialState]
  );

  useEffect(() => {
    if (!resumeInfo) return;

    onUpdate({
      ...resumeInfo,
      educations: educationList,
    });
  }, [educationList]);

  const handleChange = (
    e: {
      target: { name: string; value: string; type: string; checked?: boolean };
    },
    index: number
  ) => {
    const { name, value, type, checked } = e.target;

    setEducationList((prev) =>
      prev.map((item, i) =>
        index === i
          ? { ...item, [name]: type === "checkbox" ? checked : value }
          : item
      )
    );
  };

  const addNewEducation = () => {
    setEducationList([...educationList, initialState]);
  };

  const removeNewEducation = (index: number) => {
    const updatedEducation = [...educationList];
    updatedEducation.splice(index, 1);

    setEducationList(updatedEducation);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const payload = {
        currentPosition: resumeInfo?.currentPosition
          ? resumeInfo.currentPosition + 1
          : 1,
        thumbnail: await generateThumbnail(),
        education: educationList,
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
    },
    [educationList, handleNext, mutateAsync, resumeInfo?.currentPosition]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Education</h2>
        <p className="text-sm">Add your education details</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {educationList?.map((edu, index) => (
            <div key={index}>
              <div className="relative grid grid-cols-2 mb-5 pt-4 gap-3">
                {educationList.length > 1 && (
                  <Button
                    variant={"secondary"}
                    type="button"
                    className="size-5 text-center rounded-full absolute -top-3 -right-5 bg-black dark:bg-gray-600 text-white"
                    size={"icon"}
                    disabled={isPending}
                    onClick={() => removeNewEducation(index)}
                  >
                    <X className="size-3" />
                  </Button>
                )}

                <div className="col-span-2">
                  <Label className="text-sm">University Name</Label>
                  <Input
                    name="universityName"
                    required
                    value={edu.universityName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="">
                  <Label className="text-sm">Degree</Label>
                  <Input
                    name="degree"
                    required
                    value={edu.degree || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="">
                  <Label className="text-sm">Major</Label>
                  <Input
                    name="major"
                    required
                    value={edu.major || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="">
                  <Label className="text-sm">Start Date</Label>
                  <Input
                    name="startDate"
                    required
                    value={edu.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                    type="date"
                  />
                </div>
                <div className="">
                  <Label className="text-sm">End Date</Label>
                  <Input
                    name="endDate"
                    required
                    value={edu.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                    type="date"
                    disabled={edu.currentlyPursuing}
                  />
                </div>

                <div className="col-span-2 flex items-center space-x-2">
                  <Checkbox
                    id={`currentlyPursuing-${index}`}
                    name="currentlyPursuing"
                    checked={edu.currentlyPursuing}
                    onCheckedChange={(checked) =>
                      handleChange(
                        {
                          target: {
                            name: "currentlyPursuing",
                            value: "",
                            type: "checkbox",
                            checked: !!checked,
                          },
                        },
                        index
                      )
                    }
                  />
                  <Label
                    htmlFor={`currentlyPursuing-${index}`}
                    className="text-sm"
                  >
                    I am currently pursuing this degree
                  </Label>
                </div>

                <div className="col-span-2">
                  <Label className="text-sm">Description</Label>
                  <Textarea
                    name="description"
                    required
                    value={edu.description || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                {index === educationList.length - 1 &&
                  educationList.length < 5 && (
                    <Button
                      className="gap-1 text-primary border-primary/50"
                      variant={"outline"}
                      type="button"
                      onClick={addNewEducation}
                      disabled={isPending}
                    >
                      <Plus className="size-4" />
                      Add More Education
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
export default EducationForm;
