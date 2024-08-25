import { z } from "zod";

// Zod schema for Discord server's form data
export const serverFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  details: z.string().min(1, "Details are required"),
  roles: z.array(z.string()).min(1, "At least one role is required"),
});

// Type inference based on the schema
export type ServerFormData = z.infer<typeof serverFormSchema>;
