import credentialApis from "@/apis/credential";
import { useQuery } from "@tanstack/react-query";

export const useCredential = (platform?: string) => {
  return useQuery({ queryKey: ["credentials", platform], queryFn: () => credentialApis.getCredentials(platform) });
};
