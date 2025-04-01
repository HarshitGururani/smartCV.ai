import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";

const LandingLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};
export default LandingLayout;
