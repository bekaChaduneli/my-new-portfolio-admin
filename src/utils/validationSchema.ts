import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  releaseDate: z.string().optional(),
});

export type BookFormData = z.infer<typeof bookSchema>;
