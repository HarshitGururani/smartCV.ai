"use client";
import { useResumeContext } from "@/components/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { formatFileName } from "@/lib/helper";
import { StatusType } from "@/types/document-types";
import html2canvas from "html2canvas";
import { DownloadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

interface DownloadProps {
  title: string;
  status?: StatusType;
  isLoading: boolean;
}
const Download = ({ title, isLoading }: DownloadProps) => {
  const { resumeInfo } = useResumeContext();
  const [loading, setLoading] = useState(false);
  const handleDownload = useCallback(async () => {
    const resumeElement = document.getElementById("resume-preview-id");

    if (!resumeElement) {
      toast.error("Could not Download");
      return;
    }
    setLoading(true);
    const fileName = formatFileName(title);
    try {
      const canvas = await html2canvas(resumeElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imageWidth = 210; //A4 size in mm
      const pageHeight = 295;
      const imgHeight = (canvas.height * imageWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(fileName);
    } catch (error) {
      console.log("Error Generating Pdf");
      toast.error("Error Generating Pdf");
    } finally {
      setLoading(false);
    }
  }, [title]);
  return (
    <div>
      <Button
        variant={"secondary"}
        disabled={
          resumeInfo?.status === "ARCHIVED"
            ? true
            : false || loading || isLoading
        }
        className="bg-white border gap-1 dark:bg-gray-800 w-10 p-2 lg:w-auto lg:p-4"
        onClick={handleDownload}
      >
        <div className="flex items-center gap-1">
          <DownloadCloud size={"17px"} />
          <span className="hidden lg:flex">
            {loading ? "Generating PDF" : "Download"}
          </span>
        </div>
      </Button>
    </div>
  );
};
export default Download;
