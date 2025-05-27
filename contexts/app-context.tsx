import { create } from "zustand";

import { Post } from "@/types/post";

export const useAppContext = create<{
  token: string | null;
  setToken: (token: string | null) => void;
  post: Post | undefined;
  setPost: (post: Post | undefined) => void;
  reset: () => void;
}>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  post: undefined,
  setPost: (post) => set({ post }),
  reset: () => set({ post: undefined }),
}));
