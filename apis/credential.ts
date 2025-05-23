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
};

export default credentialApis;
