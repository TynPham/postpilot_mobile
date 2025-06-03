import { Credential } from "@/types/credential";
import { SuccessResponse } from "@/types/utils";
import http from "@/utils/http";

const CREDENTIAL_URI = "/social-credentials";

const credentialApis = {
  getCredentials: (platform?: string) => {
    return http.get<SuccessResponse<Credential[]>>(CREDENTIAL_URI, {
      params: {
        platform,
      },
    });
  },

  createCredential: (body: any) => {
    return http.post<SuccessResponse<Credential>>(CREDENTIAL_URI, body);
  },

  disconnectSocialAccount(id: string) {
    return http.patch<{ message: string }>(`${CREDENTIAL_URI}/${id}/disconnect`);
  },
};

export default credentialApis;
