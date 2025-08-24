import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z.string("Name must be a string.").nonempty("Name is required"),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

export const updateDivisionSchema = z.object({
  name: z
    .string("Name must be a string.")
    .nonempty("Name is required")
    .min(1)
    .optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
