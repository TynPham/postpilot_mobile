import postApis from "@/apis/post";
import { useQuery } from "@tanstack/react-query";

export const useGetPosts = () => {
  return useQuery({ queryKey: ["posts"], queryFn: () => postApis.getPosts() });
};
