/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import useUpdateDocument from "@/app/mutations/use-update-documents";
import { useResumeContext } from "@/components/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiChatSession } from "@/lib/google-ai";
import { generateThumbnail } from "@/lib/helper";
import { prompt } from "@/lib/prompt";
import { ResumeDataType } from "@/types/document-types";
import { Loader2, Sparkle } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface SummaryFormProps {
  handleNext: () => void;
}
interface GenerateSummaryType {
  fresher: string;
  mid: string;
  experienced: string;
}

const SummaryForm = ({ handleNext }: SummaryFormProps) => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] =
    useState<GenerateSummaryType | null>(null);

  const { mutateAsync, isPending } = useUpdateDocument();

  const handleChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updateResumeInfo = {
      ...resumeDataInfo,
      summary: value,
    };
    onUpdate(updateResumeInfo);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!resumeInfo) return;
      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo.currentPosition
        ? resumeInfo.currentPosition + 1
        : 1;

      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail,
          summary: resumeInfo.summary,
        },
        {
          onSuccess: () => {
            toast.success("Summary Updated successfully");
            handleNext();
          },
        }
      );
    },
    [mutateAsync, resumeInfo, handleNext]
  );

  const handleSelect = useCallback(
    (summary: string) => {
      if (!summary) {
        return;
      }

      const resumeDataInfo = resumeInfo as ResumeDataType;

      onUpdate({
        ...resumeDataInfo,
        summary,
      });
      setAiGeneratedSummary(null);
    },
    [onUpdate, resumeInfo]
  );

  const GenerateSummaryFromAi = async () => {
    try {
      const jobTitle = resumeInfo?.personalInfo?.jobTitle;
      if (!jobTitle) return;
      setIsLoading(true);

      const PROMPT = prompt.replace("{jobTitle}", jobTitle);

      const result = await AiChatSession.sendMessage(PROMPT);
      const responseText = result.response.text();
      const parsedData = JSON.parse(responseText);

      const formattedSummary: GenerateSummaryType = {
        fresher:
          parsedData.find(
            (item: { experience_level: string }) =>
              item.experience_level === "fresher"
          )?.summary || "",
        mid:
          parsedData.find(
            (item: { experience_level: string }) =>
              item.experience_level === "mid"
          )?.summary || "",
        experienced:
          parsedData.find(
            (item: { experience_level: string }) =>
              item.experience_level === "senior"
          )?.summary || "",
      };

      setAiGeneratedSummary(formattedSummary);
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Summary</h2>
        <p className="text-sm">Add summary for your resume</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-end justify-between">
          <Label>Add summary</Label>
          <Button
            variant={"outline"}
            className="gap-1"
            onClick={() => GenerateSummaryFromAi()}
            type="button"
            disabled={isLoading || isPending}
          >
            <Sparkle className="size-4 text-purple-400" />
            Generate with AI
          </Button>
        </div>
        <Textarea
          required
          className="mt-5 min-h-36"
          value={resumeInfo?.summary || ""}
          onChange={handleChange}
        />

        {aiGeneratedSummary && (
          <div>
            <h5 className="font-semibold text-[15px] my-4">Suggestions</h5>
            {Object?.entries(aiGeneratedSummary)?.map(
              ([experienceType, summary], index) => (
                <Card
                  role="button"
                  key={index}
                  className="my-4 bg-primary/5 shadow-none border-primary/30"
                  onClick={() => handleSelect(summary)}
                >
                  <CardHeader className="py-2">
                    <CardTitle className="font-semibold text-md">
                      {experienceType?.charAt(0)?.toUpperCase() +
                        experienceType?.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>{summary}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}

        <Button
          className="mt-4"
          type="submit"
          disabled={isLoading || resumeInfo?.status === "ARCHIVED" || isPending}
        >
          {isPending && <Loader2 className="animate-spin size-4" />}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};
export default SummaryForm;
