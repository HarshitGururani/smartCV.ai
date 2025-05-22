"use client";
import useDebounce from "@/app/hooks/use-debounce";
import useUpdateDocument from "@/app/mutations/use-update-documents";
import { useResumeContext } from "@/components/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateThumbnail } from "@/lib/helper";
import { ChevronDown, Palette } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ThemeColor = () => {
  const initialColor = "#7c3aed";
  const themeColors = [
    "#1E1E2E",
    "#3A3A55",
    "#8B5CF6",
    "#E0E7FF",
    "#F4F4F5", // Modern & Professional
    "#F8F9FA",
    "#E9ECEF",
    "#6C757D",
    "#343A40",
    "#495057", // Minimal & Elegant
    "#121212",
    "#1E1E1E",
    "#BB86FC",
    "#03DAC6",
    "#CF6679", // Dark & Sleek
    "#FF5733",
    "#FFBD33",
    "#33FF57",
    "#33A1FF",
    "#9D33FF", // Vibrant & Creative
    "#6B4226",
    "#BF9270",
    "#E3B782",
    "#F2E3D5",
    "#DAD7CD", // Earthy & Warm
  ];

  const { resumeInfo, onUpdate } = useResumeContext();

  const { mutateAsync, isPending } = useUpdateDocument();

  const [selectedColor, setSelectedColor] = useState(initialColor);

  const onColorSelect = (color: string) => {
    setSelectedColor(color);
    if (!resumeInfo) return;

    onUpdate({ ...resumeInfo, themeColor: selectedColor });
  };

  const debouncedColor = useDebounce<string>(selectedColor, 1000);

  useEffect(() => {
    if (debouncedColor) onSave();
  }, [debouncedColor]);

  const onSave = useCallback(async () => {
    if (!selectedColor) return;
    if (selectedColor === initialColor) return;

    const payload = {
      thumbnail: await generateThumbnail(),
      themeColor: selectedColor,
    };
    try {
      await mutateAsync(payload, {
        onSuccess: () => {
          toast.success("Theme updated successfully");
        },
        onError: () => {
          toast.error("Failed to update theme");
        },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    }
  }, [mutateAsync, selectedColor]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"secondary"}
            disabled={resumeInfo?.status === "ARCHIVED" || isPending}
            className="bg-white border gap-1 dark:bg-gray-800 w-10 p-2 lg:w-auto lg:p-4"
          >
            <div className="flex items-center gap-1">
              <Palette size={"17px"} />
              <span className="hidden lg:flex">Themes</span>
            </div>
            <ChevronDown size={"14px"} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="bg-background">
          <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>

          <div className="grid grid-cols-5 gap-3">
            {themeColors.map((item: string, index: number) => (
              <div
                key={index}
                onClick={() => onColorSelect(item)}
                role="button"
                className={`h-5 w-8 rounded-[5px] hover:border-black border ${
                  selectedColor === item && "border border-black"
                }`}
                style={{ background: item }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default ThemeColor;
