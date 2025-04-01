"use client";
import "@smastrom/react-rating/style.css";
import useUpdateDocument from "@/app/mutations/use-update-documents";
import { useResumeContext } from "@/components/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateThumbnail } from "@/lib/helper";
import { SkillType } from "@/types/document-types";
import { Rating } from "@smastrom/react-rating";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const initialState = {
  name: "",
  rating: 0,
};

const SkillsForm = () => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [skillsList, setSkillsList] = useState<SkillType[]>(
    Array.isArray(resumeInfo?.skills) && resumeInfo?.skills.length
      ? resumeInfo?.skills
      : [initialState]
  );

  useEffect(() => {
    if (!resumeInfo) return;

    onUpdate({
      ...resumeInfo,
      skills: skillsList,
    });
  }, [skillsList]);

  const handleChange = (
    value: string | number,
    name: string,
    index: number
  ) => {
    setSkillsList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const handleRemove = (index: number) => {
    const updatedSkills = [...skillsList];
    updatedSkills.splice(index, 1);
    setSkillsList(updatedSkills);
  };

  const addNewSkill = () => {
    setSkillsList([...skillsList, initialState]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      currentPosition: resumeInfo?.currentPosition
        ? resumeInfo.currentPosition + 1
        : 1,
      thumbnail: await generateThumbnail(),
      skills: skillsList,
    };

    console.log("Final Payload Sent to Backend:", payload);

    try {
      await mutateAsync(payload);
      toast.success("Experience Updated successfully");
    } catch (error) {
      console.error("Mutation error:", error);
      toast.error("Failed to update experience");
    }
  };

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Education</h2>
        <p className="text-sm">Add your education details</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {skillsList.map((item, index) => (
            <div key={index}>
              <div className="relative flex items-center mb-5 pt-4 gap-3 ">
                {skillsList.length > 1 && (
                  <div className="">
                    <Button
                      variant={"secondary"}
                      className="size-5 text-center rounded-full absolute -top-3 -right-5 bg-black dark:bg-gray-600 text-white"
                      size={"icon"}
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRemove(index)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                )}

                <div className="flex-1">
                  <Label className="text-sm">Name</Label>
                  <Input
                    name="name"
                    placeholder=""
                    required
                    autoComplete="off"
                    value={item.name || ""}
                    onChange={(e) =>
                      handleChange(e.target.value, "name", index)
                    }
                  />
                </div>

                <div className="shrink-0 pt-5">
                  <Rating
                    style={{ maxWidth: 120 }}
                    isDisabled={!item.name}
                    value={item.rating || 0}
                    onChange={(value: number) =>
                      handleChange(value, "rating", index)
                    }
                  />
                </div>
              </div>
              {index === skillsList.length - 1 && skillsList.length < 5 && (
                <Button
                  className="gap-1 text-primary border-primary/50"
                  variant={"outline"}
                  type="button"
                  onClick={addNewSkill}
                  disabled={isPending}
                >
                  <Plus className="size-4" />
                  Add More Skill
                </Button>
              )}
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
export default SkillsForm;
