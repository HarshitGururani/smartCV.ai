import { cn } from "@/lib/utils";
import { FileText, Globe, Lock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ResumeTitleProps {
  initialTitle: string;
  status?: "ARCHIVED" | "PRIVATE" | "PUBLIC";
  onSave?: (newTitle: string) => void;
  isLoading: boolean;
}

const ResumeTitle = ({
  initialTitle,
  status,
  onSave,
  isLoading,
}: ResumeTitleProps) => {
  const [title, setTitle] = useState("Untitled Resume");

  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
  }, [initialTitle]);

  const handleBlur = (e: React.FocusEvent<HTMLHeadElement>) => {
    const newTitle = e.target.innerText;
    setTitle(newTitle);
    if (onSave && typeof onSave === "function") {
      onSave(newTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center gap-1 pr-4">
      <FileText className="stroke-primary size-5" />
      <h5
        className={cn(
          `text-xl px-1 text-gray-700 dark:text-gray-300 font-semibold opacity-100`,
          {
            "opacity-70 pointer-events-none":
              isLoading === true || status === "ARCHIVED",
          }
        )}
        contentEditable={isLoading || status === "ARCHIVED" ? false : true}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      >
        {title}
      </h5>

      <span>
        {status === "PRIVATE" ? (
          <Lock size={"14px"} />
        ) : status === "PUBLIC" ? (
          <Globe size={"14px"} />
        ) : status === "ARCHIVED" ? (
          <Trash2 size={"14px"} />
        ) : null}
      </span>
    </div>
  );
};
export default ResumeTitle;
