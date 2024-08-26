import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlinkProps } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

// Mock Blink component for preview
export const Blink = ({ action, websiteText }: BlinkProps) => (
  <Card className="w-full h-auto  text-white">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <Image
          src="/placeholder.svg"
          alt="Website icon"
          width={24}
          height={24}
          className="rounded-full mr-2"
        />
        <span className="text-sm">{websiteText}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{action.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{action.description}</p>
      {action.fields.map((field: string, index: number) => (
        <Input key={index} placeholder={field} className="mb-2  text-white" />
      ))}
      <Button className="w-full mt-4  text-white">Submit</Button>
    </CardContent>
  </Card>
);
