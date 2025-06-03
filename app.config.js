import "dotenv/config";

console.log("FB App ID:", process.env.EXPO_PUBLIC_FB_APP_ID);
console.log("FB Client Token:", process.env.EXPO_PUBLIC_FB_CLIENT_TOKEN);
console.log("FB Scheme:", process.env.EXPO_PUBLIC_FB_SCHEME);

export default {
  expo: {
    name: "postpilot",
    slug: "postpilot",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "postpilot",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        SKAdNetworkItems: [{ SKAdNetworkIdentifier: "v9wttpbfk9.skadnetwork" }, { SKAdNetworkIdentifier: "n38lu8286q.skadnetwork" }],
      },
    },
    android: {
      package: "com.postpilot.facebookloginapp",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: ["android.permission.INTERNET", "com.google.android.gms.permission.AD_ID"],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "react-native-fbsdk-next",
        {
          appID: process.env.EXPO_PUBLIC_FB_APP_ID,
          clientToken: process.env.EXPO_PUBLIC_FB_CLIENT_TOKEN,
          displayName: "FacebookLoginApp",
          scheme: process.env.EXPO_PUBLIC_FB_SCHEME,
        },
      ],
      "expo-tracking-transparency",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "167c18c5-d8b9-40f4-b1d7-5369ef2e5d4c",
      },
    },
    owner: "tyn1104",
  },
};
