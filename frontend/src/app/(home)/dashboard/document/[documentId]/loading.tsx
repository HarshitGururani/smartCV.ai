import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="fixed top-0 left-0 z-[9999] right-0 flex flex-col gap-2 
      items-center justify-center backdrop-blur bg-black/30 w-full h-full"
    >
      <span className="animate-spin text-gray-500 text-xl">
        <Loader2 />
      </span>
    </div>
  );
}
