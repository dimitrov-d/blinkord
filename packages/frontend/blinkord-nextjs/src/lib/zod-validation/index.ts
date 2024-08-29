import { z } from "zod";

// Zod schema for Discord server's form data
export const serverFormSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  iconUrl: z.string().min(3, "image url is required"),
  description: z.string().min(1, "Description is required"),
  details: z.string().min(1, "Details are required"),
  roles: z.array(
    z.object({
      id: z.string().min(1, "Role ID is required"),
      name: z.string().min(1, "Role name is required"),
      amount: z.string().min(1, "Amount is required"),
    })
  ).min(1, "At least one role is required"),
  address: z.string().min(1, "Address is required"),
  message: z.string().min(1, "Message is required"),
  signature: z.string().min(1, "Signature is required"),
});

// Type inference based on the schema
export type ServerFormData = z.infer<typeof serverFormSchema>;
