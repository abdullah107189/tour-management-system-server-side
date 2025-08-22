import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z.string("Name must be a string.").nonempty("Name is required"),
  slug: z.string("Slug must be a string.").nonempty("Name is required"),
});
