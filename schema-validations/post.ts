import { z } from "zod";

export const createPostSchema = z.object({
  type: z.enum(["Post", "Story", "Reel"]),
  desc: z.string().min(1, "Description is required"),
  checkedAccounts: z.array(z.string()),
  dateTime: z.date(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
