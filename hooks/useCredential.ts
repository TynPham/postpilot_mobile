import credentialApis from "@/apis/credential";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCredential = (platform?: string) => {
  return useQuery({ queryKey: ["credentials", platform], queryFn: () => credentialApis.getCredentials(platform) });
};

export const useCreateCredentialMutation = (platform?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => credentialApis.createCredential(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials", platform] });
    },
  });
};

export const useDisconnectSocialAccountMutation = (platform?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => credentialApis.disconnectSocialAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials", platform] });
    },
  });
};
