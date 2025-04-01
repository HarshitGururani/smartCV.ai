import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "./_components/Header";

const MainLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full h-auto min-h-screen !bg-[#f8f8f8] dark:!bg-background">
      <Header />
      <div>{children}</div>
    </div>
  );
};
export default MainLayout;
