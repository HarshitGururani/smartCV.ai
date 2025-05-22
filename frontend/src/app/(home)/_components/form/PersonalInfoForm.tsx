import useUpdateDocument from "@/app/mutations/use-update-documents";
import { useResumeContext } from "@/components/context/resume-info-provider";
import PersonalInfoSkeletonLoader from "@/components/skeleton-loader/PersonalInfoLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateThumbnail } from "@/lib/helper";
import { PersonalInfoType } from "@/types/document-types";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PersonalInfoForm {
  handleNext: () => void;
}

const initialState = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  address: "",
  phone: "",
  email: "",
};

const PersonalInfoForm = ({ handleNext }: PersonalInfoForm) => {
  const { resumeInfo, onUpdate, isLoading } = useResumeContext();
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfoType>(initialState);

  const { mutateAsync, isPending } = useUpdateDocument();

  useEffect(() => {
    if (!resumeInfo) {
      return;
    }

    if (resumeInfo) {
      setPersonalInfo({
        ...(resumeInfo.personalInfo || initialState),
      });
    }
  }, [resumeInfo, resumeInfo?.personalInfo]);

  const handleChange = useCallback(
    (e: { target: { name: string; value: string } }) => {
      const { name, value } = e.target;

      //this because personalInfo list is an object so we can directly do this
      setPersonalInfo({
        ...personalInfo,
        [name]: value,
      });

      if (!resumeInfo) {
        return;
      }

      onUpdate({
        ...resumeInfo,
        personalInfo: {
          ...resumeInfo.personalInfo,
          [name]: value,
        },
      });
    },
    [onUpdate, personalInfo, resumeInfo]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const thumbnail = await generateThumbnail();
      const currentNumber = resumeInfo?.currentPosition
        ? resumeInfo.currentPosition + 1
        : 1;

      await mutateAsync(
        {
          currentPosition: currentNumber,
          thumbnail: thumbnail,
          personalInfo: personalInfo,
        },
        {
          onSuccess: () => {
            toast.success("Personal Information updated successfully");
            handleNext();
          },
          onError: () => {
            toast.error("Failed to update personal information");
          },
        }
      );
    },
    [handleNext, mutateAsync, personalInfo, resumeInfo?.currentPosition]
  );

  if (isLoading) {
    return (
      <>
        <PersonalInfoSkeletonLoader />
      </>
    );
  }

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Personal Information</h2>
        <p className="text-sm">Get Started with the personal information</p>

        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 mt-5 gap-3">
              <div>
                <Label className="text-sm mb-2">First Name</Label>

                <Input
                  name="firstName"
                  required
                  autoComplete="off"
                  placeholder=""
                  value={personalInfo.firstName || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="text-sm mb-2">Last Name</Label>

                <Input
                  name="lastName"
                  required
                  autoComplete="off"
                  placeholder=""
                  value={personalInfo.lastName || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <Label className="text-sm mb-2">Job Title</Label>

                <Input
                  name="jobTitle"
                  required
                  autoComplete="off"
                  placeholder=""
                  value={personalInfo.jobTitle || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <Label className="text-sm mb-2">Address</Label>

                <Input
                  name="address"
                  required
                  autoComplete="off"
                  placeholder=""
                  value={personalInfo.address || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <Label className="text-sm mb-2 ">Phone</Label>

                <Input
                  name="phone"
                  required
                  autoComplete="off"
                  placeholder=""
                  value={personalInfo.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <Label className="text-sm mb-2">Email</Label>

                <Input
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  placeholder=""
                  value={personalInfo.email || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              className="mt-4"
              type="submit"
              disabled={resumeInfo?.status === "ARCHIVED" || isPending}
            >
              {isPending && <Loader2 className="animate-spin size-4" />}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default PersonalInfoForm;
