import AddResume from "../_components/AddResume";
import ResumeList from "../_components/ResumeList";

const page = () => {
  return (
    <div className="w-full">
      <div className="w-full mx-auto max-w-7xl py-5 px-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <p className="text-base dark:text-inherit">
              Create your own custom resume with AI
            </p>
          </div>
        </div>

        <div className="w-full pt-11">
          <h5 className="text-xl font-semibold dark:text-inherit mb-3">
            All Resume
          </h5>
          <div className="flex flex-wrap w-full gap-4">
            <AddResume />
            <ResumeList />
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
