import { useBlinkStore } from '@/lib/contexts/zustand/blinkStore';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BlinkMock = () => {
  const { formData } = useBlinkStore();

  return (
    <Card className="w-full h-auto text-white">

      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={formData.iconUrl || "/placeholder.svg"}
            alt="Website icon"
            width={100}
            height={100}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <h1 className="text-primary text-lg font-semibold block mb-1">{formData.title || "Your Blink Title"}</h1>
        <p className="text-sm text-gray-400 mb-4">{formData.description || 'Your Blink Description'}</p>
        {formData.fields.map((field: string, index: number) => (
          <Input key={index} placeholder={field} className="mb-2 text-white" />
        ))}
      </CardContent>
    </Card>
  );
};

export default BlinkMock;
