/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, Sparkle } from "lucide-react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  Separator,
} from "react-simple-wysiwyg";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import { experiencePromt } from "@/lib/prompt";
import { AiChatSession } from "@/lib/google-ai";

interface RichTextEditorProps {
  jobTitle: string | null;
  initialValue: string;
  index: number; // ✅ Accept index as a prop
  onEditorChange: (name: string, index: number, value: string) => void;
}

const RichTextEditor = ({
  initialValue,
  jobTitle,
  index,
  onEditorChange,
}: RichTextEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(initialValue);

  const GenerateExperienceSummaryFromAi = async () => {
    try {
      if (!jobTitle) {
        toast.error("Must provide Job title");
        return;
      }
      setIsLoading(true);
      const PROMPT = experiencePromt.replace("{jobTitle}", jobTitle as string);

      const result = await AiChatSession.sendMessage(PROMPT);
      const responseText = result.response.text();

      const parsedResponse =
        typeof responseText === "string"
          ? JSON.parse(responseText)
          : responseText;
      console.log("Parsed Response:", parsedResponse);

      const formattedText = Array.isArray(parsedResponse)
        ? parsedResponse.join("")
        : parsedResponse;
      setValue(formattedText);
      onEditorChange("workSummary", index, formattedText);
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <Label>Work Summary</Label>
        <Button
          variant={"outline"}
          className="gap-1"
          type="button"
          onClick={() => GenerateExperienceSummaryFromAi()}
          disabled={isLoading}
        >
          <Sparkle className="size-4 text-purple-400" />
          Generate with AI
          {isLoading && <Loader2 className="animate-spin size-4" />}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          containerProps={{
            style: {
              resize: "vertical",
              lineHeight: 1.2,
              fontSize: "13.5px",
            },
          }}
          onChange={(e) => {
            setValue(e.target.value);
            onEditorChange("workSummary", index, e.target.value);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};
export default RichTextEditor;
