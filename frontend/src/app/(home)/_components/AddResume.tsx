"use client";
import { useCreateMutation } from "@/app/mutations/use-create-document";
import { FileText, Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

const AddResume = () => {
  const router = useRouter();
  const { isPending: isCreating, mutate } = useCreateMutation();
  const [isPending, startTransition] = useTransition();
  const onCreate = useCallback(() => {
    mutate(
      {
        title: "Untitled",
      },
      {
        onSuccess: (response) => {
          console.log(response);

          const documentId = response?.document?.documentId;

          startTransition(() =>
            router.push(`/dashboard/document/${documentId}/edit`)
          );
        },
      }
    );
  }, [mutate, router]);
  return (
    <>
      <div
        className="p-[2px] w-full cursor-pointer max-w-[164px]"
        role="button"
        onClick={onCreate}
      >
        <div className="py-24 h-[183px] flex flex-col rounded-lg gap-2 w-full max-w-full items-center justify-center border bg-white hover:bg-primary transition-colors hover:shadow dark:bg-secondary hover:text-white">
          <span>
            <PlusIcon size={"30px"} />
          </span>
          <p className="text-sm font-semibold">Blank Resume</p>
        </div>
      </div>

      {isCreating && (
        <div className="fixed top-0 left-0 z-[9999] right-0 flex flex-col gap-2 items-center justify-center backdrop-blur bg-black/30 w-full h-full">
          <Loader2 size={"35px"} className="animate-spin" />
          <div className="flex items-center gap-2">
            <FileText />
            Creating Document...
          </div>
        </div>
      )}

      {/* Show loading when navigating */}
      {isPending && (
        <div className="fixed top-0 left-0 z-[9999] right-0 flex flex-col gap-2 items-center justify-center backdrop-blur bg-black/30 w-full h-full">
          <Loader2 size={"35px"} className="animate-spin" />
          <div className="flex items-center gap-2">
            <FileText />
            Redirecting to editor...
          </div>
        </div>
      )}
    </>
  );
};
export default AddResume;
