import { z } from "zod";

export const defaultSchema = {
  id: "",
  name: "",
  iconUrl: "",
  description: "",
  address: "",
  website: "",
  // details: "",
  roles: [],
  useUsdc: false,
  limitedTimeRoles: false,
  limitedTimeQuantity: "1",
  limitedTimeUnit: "Months",
};

export const serverFormSchema = z
  .object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Blink title is required"),
    iconUrl: z
      .string()
      .min(3, "Image URL is required")
      .refine(
        (url) => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Invalid URL. Please enter a valid URL.",
        }
      ),
    description: z.string().min(1, "Description is required"),
    address: z.string(),
    website: z
      .string()
      .nullable()
      .refine(
        (url) => {
          if (!url) return true;
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i.test(
            url
          );
        },
        {
          message: "Invalid URL. Please enter a valid URL.",
        }
      ),
    roles: z
      .array(
        z.object({
          id: z.string().min(1, "Role ID is required"),
          name: z.string().min(1, "Role name is required"),
          amount: z
            .string()
            .refine((val) => /^\d*\.?\d+$/.test(val) && parseFloat(val) > 0, {
              message:
                "Amount must be a valid number or decimal greater than 0",
            })
            .transform((val) => parseFloat(val).toString()),
        })
      )
      .min(1, "At least one role is required"),
    useUsdc: z.boolean().default(false),
    limitedTimeRoles: z.boolean().default(false),
    limitedTimeQuantity: z
      .string()
      .default("1")
      .transform((val) => parseInt(val).toString()),
    limitedTimeUnit: z
      .string()
      .refine((val) => ["Hours", "Days", "Weeks", "Months"].includes(val))
      .default("Months"),
  })
  .default(defaultSchema);

// Type inference based on the schema
export type ServerFormData = z.infer<typeof serverFormSchema>;
