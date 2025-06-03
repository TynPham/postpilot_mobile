import envConfig from "@/configs/env-config";
import { PLATFORM_TYPE } from "@/constants";
import { useCreateCredentialMutation } from "@/hooks/useCredential";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

const scopes = ["threads_basic"].join(",");

const authorizationEndpoint = "https://threads.net/oauth/authorize";

const Threads = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: envConfig.threadsAppId,
      redirectUri: "https://tynpham.com/api/connect/threads",
      responseType: "code",
      scopes: scopes.split(","),
    },
    {
      authorizationEndpoint,
    }
  );
  const createCredentialMutation = useCreateCredentialMutation(PLATFORM_TYPE.THREADS);

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const { queryParams } = Linking.parse(event.url);
      const code = queryParams?.code;

      if (code) {
        const data = [
          {
            platform: PLATFORM_TYPE.THREADS,
            credentials: {
              code,
              redirect_uri: envConfig.threadsRedirectUri,
            },
          },
        ];
        await createCredentialMutation.mutateAsync(data);
      }
    };
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <TouchableOpacity className="bg-primary px-4 py-3 rounded-lg" onPress={() => promptAsync()}>
      <Text className="text-white font-bold">Connect Account</Text>
    </TouchableOpacity>
  );
};

export default Threads;
