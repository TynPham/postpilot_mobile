import { PLATFORM_TYPE } from "@/constants";
import { useCreateCredentialMutation } from "@/hooks/useCredential";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager, Settings } from "react-native-fbsdk-next";

const Facebook = () => {
  const { mutateAsync: createCredential, isPending: isCreating } = useCreateCredentialMutation(PLATFORM_TYPE.FACEBOOK);

  useEffect(() => {
    const requestTracking = async () => {
      const { status } = await requestTrackingPermissionsAsync();
      Settings.initializeSDK();
      if (status === "granted") {
        await Settings.setAdvertiserTrackingEnabled(true);
      }
    };
    requestTracking();
  }, []);

  const loginWithFacebook = () => {
    if (isCreating) return;
    LoginManager.logInWithPermissions([
      "email",
      "read_insights",
      "pages_show_list",
      "instagram_basic",
      "instagram_manage_insights",
      "pages_read_engagement",
      "pages_manage_metadata",
      "pages_read_user_content",
      "pages_manage_posts",
      "pages_manage_engagement",
      "public_profile",
    ]).then(
      function (result) {
        console.log(result);
        if (result.isCancelled) {
          console.log("==> Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            if (!data) return;
            console.log("==> Access Token:", data);
            getPages()
              .then(async (response: any) => {
                const pageData = response.data;
                if (pageData.length > 0) {
                  const body = pageData.map((item: any) => ({
                    platform: "facebook",
                    socialOwnerId: data.userID,
                    socialId: item.id,
                    credentials: {
                      page_id: item.id,
                      code: item.access_token,
                    },
                    metadata: {
                      avatar_url: item.picture.data.url,
                      name: item.name,
                      fan_count: item.fan_count,
                    },
                  }));
                  await createCredential(body);
                }
              })
              .catch((error) => {
                console.error(error);
              });
          });
        }
      },
      function (error) {
        console.log("==> Login fail with error: " + error);
      }
    );
  };

  const getPages = () => {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest("/me/accounts?fields=id,name,picture,access_token,fan_count", {}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
      new GraphRequestManager().addRequest(request).start();
    });
  };

  return (
    <TouchableOpacity className="bg-primary px-4 py-3 rounded-lg" onPress={loginWithFacebook} disabled={isCreating}>
      <Text className="text-white font-bold">Connect Account</Text>
    </TouchableOpacity>
  );
};

export default Facebook;
