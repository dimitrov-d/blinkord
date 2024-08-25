import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
// Mock Blink component for preview
export const Blink = ({ action, websiteText }) => (
  <div className="blink x-dark p-4 rounded-xl bg-[#202327] text-white">
    <div className="flex items-center mb-2">
      <img
        src="/placeholder.svg?height=24&width=24"
        alt="Website icon"
        className="w-6 h-6 rounded-full mr-2"
      />
      <span className="text-sm">{websiteText}</span>
    </div>
    <h3 className="text-lg font-bold mb-2">{action.title}</h3>
    <p className="text-sm text-gray-400 mb-4">{action.description}</p>
    {action.fields.map((field, index) => (
      <Input
        key={index}
        placeholder={field}
        className="mb-2 bg-[#202327] border-[#3d4144] text-white"
      />
    ))}
    <Button className="w-full bg-[#1d9bf0] hover:bg-[#3087da] text-white">
      Submit!
    </Button>
  </div>
);
