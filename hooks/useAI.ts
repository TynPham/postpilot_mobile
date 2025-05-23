import aiApis from "@/apis/ai";
import { useMutation } from "@tanstack/react-query";

export const useGenerateAIContent = () => {
  return useMutation({
    mutationFn: (prompt: string) => aiApis.generatePost(prompt),
  });
};
