import PreviewSection from "./PreviewSection";
import ResumeForm from "./ResumeForm";
import TopSection from "./TopSection";

const EditResume = () => {
  return (
    <div className="relative w-full ">
      <div className="w-full mx-auto max-w-7xl py-4 px-5">
        <TopSection />
        <div className="w-full mt-1">
          <div className="w-full flex flex-col lg:flex-row items-start py-3 gap-4">
            {/* {form section} */}
            <ResumeForm />
            {/*Preview section*/}
            <PreviewSection />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditResume;
