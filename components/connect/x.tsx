import envConfig from "@/configs/env-config";
import { PLATFORM_TYPE } from "@/constants";
import { useCreateCredentialMutation } from "@/hooks/useCredential";
import { deleteSecureStore, getSecureStore, setSecureStore } from "@/utils/secure-store";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

const scopes = "tweet.read tweet.write users.read follows.read offline.access media.write like.read like.write";

const authorizationEndpoint = "https://x.com/i/oauth2/authorize";

const X = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: envConfig.xClientId,
      redirectUri: envConfig.xRedirectUri,
      responseType: "code",
      scopes: scopes.split(" "),
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      state: "state",
    },
    {
      authorizationEndpoint,
    }
  );

  useEffect(() => {
    if (request?.codeVerifier) {
      setSecureStore("x_code_verifier", request.codeVerifier);
    }
  }, [request?.codeVerifier]);

  const createCredentialMutation = useCreateCredentialMutation(PLATFORM_TYPE.X);

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const { queryParams } = Linking.parse(event.url);
      const code = queryParams?.code;

      if (code) {
        const codeVerifier = await getSecureStore("x_code_verifier");

        if (!codeVerifier) {
          return;
        }

        const data = [
          {
            platform: PLATFORM_TYPE.X,
            credentials: {
              code,
              redirect_uri: envConfig.xRedirectUri,
              code_verifier: codeVerifier,
            },
          },
        ];
        await createCredentialMutation.mutateAsync(data);
        await deleteSecureStore("x_code_verifier");
      }
    };
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  const handlePress = async () => {
    const codeVerifier = await getSecureStore("x_code_verifier");
    if (!codeVerifier) {
      return;
    }
    promptAsync();
  };

  return (
    <TouchableOpacity className="bg-primary px-4 py-3 rounded-lg" onPress={handlePress}>
      <Text className="text-white font-bold">Connect Account</Text>
    </TouchableOpacity>
  );
};

export default X;
