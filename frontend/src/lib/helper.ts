import html2canvas from "html2canvas";
export const generateThumbnail = async () => {
  const resultElement = document.getElementById(
    "resume-preview-id"
  ) as HTMLElement;

  if (!resultElement) {
    console.error("Resume preview not found");
    return;
  }

  try {
    const canvas = await html2canvas(resultElement, { scale: 0.4 });
    const thumbnailImage = canvas.toDataURL("image/png");
    return thumbnailImage;
  } catch (error) {
    console.error("Thumbnail generation failed");
  }
};

export const formatFileName = (title: string, useHyphen: boolean = true) => {
  const delimiter = useHyphen ? "-" : "_";
  return title.trim().replace(/\s+/g, delimiter) + "pdf";
};
