import envConfig from "@/configs/env-config";
import { PLATFORM_TYPE } from "@/constants";
import { useCreateCredentialMutation } from "@/hooks/useCredential";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

const scopes = [
  "instagram_business_basic",
  "instagram_business_manage_messages",
  "instagram_business_manage_comments",
  "instagram_business_content_publish",
  "instagram_business_manage_insights",
].join(",");

const authorizationEndpoint = "https://www.instagram.com/oauth/authorize";

const Instagram = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: envConfig.instagramAppId,
      redirectUri: envConfig.instagramRedirectUri,
      responseType: "code",
      scopes: scopes.split(","),
      state: "instagram",
    },
    {
      authorizationEndpoint,
    }
  );

  const createCredentialMutation = useCreateCredentialMutation(PLATFORM_TYPE.INSTAGRAM);

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const { queryParams } = Linking.parse(event.url);
      const code = queryParams?.code;

      if (code) {
        const data = [
          {
            platform: PLATFORM_TYPE.INSTAGRAM,
            credentials: {
              code,
              redirect_uri: envConfig.instagramRedirectUri,
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

export default Instagram;
