import { useResumeContext } from "@/components/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, FileText } from "lucide-react";
import PreviewSection from "../PreviewSection";

const PreviewModal = () => {
  const { resumeInfo, isLoading } = useResumeContext();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            disabled={resumeInfo?.status === "ARCHIVED" || isLoading}
            className="bg-white border gap-1 dark:bg-gray-800 w-10 p-2 lg:w-auto lg:p-4"
          >
            <div className="flex items-center gap-1">
              <Eye size={"17px"} />
              <span className="hidden lg:flex">Preview</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl p-0 w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader
            className="pb-0 m-0 sticky top-0 backdrop-blur bg-white dark:black/80 z-10
          "
          >
            <DialogTitle className="flex items-center gap-1 text-[20px] pt-2 px-3 font-semibold opacity-100">
              <FileText className="stroke-primary size-5" />
              {resumeInfo?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full h-full px-2 pb-4">
            <PreviewSection />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default PreviewModal;
