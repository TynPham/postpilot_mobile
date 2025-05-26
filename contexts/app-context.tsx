import { create } from "zustand";

import { Post } from "@/types/post";

export const useAppContext = create<{
  post: Post | undefined;
  setPost: (post: Post | undefined) => void;
  reset: () => void;
}>((set) => ({
  post: undefined,
  setPost: (post) => set({ post }),
  reset: () => set({ post: undefined }),
}));
