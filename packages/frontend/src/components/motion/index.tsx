import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input, InputNumber } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const MotionCard = motion(Card);
export const MotionCardContent = motion(CardContent);
export const MotionInput = motion(Input);
export const MotionNumberInput = motion(InputNumber);
export const MotionTextarea = motion(Textarea);
export const MotionButton = motion(Button);
