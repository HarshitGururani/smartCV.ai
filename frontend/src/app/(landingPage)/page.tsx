import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import boradImage from "../../images/board-img.png";
const page = () => {
  return (
    <div className="w-full">
      <div className="her-section w-full min-h-screen">
        <div className="flex flex-col items-center justify-center py-10 max-w-4xl mx-auto">
          <div className="flex flex-col mt-10 items-center text-center">
            <h1 className="text-6xl font-bold">
              <p>Get dream job with our</p>
              <p>
                <span className="bg-gradient-to-r from-primary via-purple-300 to-primary bg-clip-text text-transparent animate-sparkle">
                  AI Powered
                </span>
                {"  "}
                resume builder
              </p>
            </h1>
            <p className=" block text-xl mt-3 font-medium text-black/70">
              Build a professional,resume with our free builder, and download it
            </p>
            <br />
            <div className="flex items-center gap-2">
              <Button className="h-12 text-base font-medium min-w-32" asChild>
                <SignInButton>Get Started</SignInButton>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl relative mx-auto px-4 md:px-6 lg:px-8">
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full h-[400px] bg-gradient-to-r from-primary to-blue-500 rounded-full blur-3xl opacity-40 z-0" />
          <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl shadow-lg bg-background">
            <div className="relative w-full h-full rounded-md">
              <Image
                src={boradImage}
                alt="App dashboard"
                fill
                className="object-contain w-full h-full rounded-md"
              />
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};
export default page;
