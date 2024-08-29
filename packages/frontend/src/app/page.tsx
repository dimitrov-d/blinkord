import OwnerFlow from "@/components/user-flow/owner-flow";
import Image from "next/image";
import Link from "next/link";

const Index: React.FC = async () => {
  return (
    <div className="w-full h-screen flex justify-center items-center ">
      <div className="max-w-7xl bg-transparent  text-black dark:text-white rounded-lg shadow-lg border border-0.5 border-gray-300 dark:border-gray-800 p-[1.25rem]">
        <div className="flex flex-col justify-center p-4 bg-inherit gap-10">
          <OwnerFlow />
        </div>
      </div>
    </div>
  );
};

export default Index;
