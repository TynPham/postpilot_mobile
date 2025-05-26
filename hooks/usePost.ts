import postApis from "@/apis/post";
import { CreatePostRequest } from "@/types/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPosts = () => {
  return useQuery({ queryKey: ["posts"], queryFn: () => postApis.getPosts() });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostRequest) => postApis.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
