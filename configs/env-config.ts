const envConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY || "",
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "",
  geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  instagramAppId: process.env.EXPO_PUBLIC_INSTAGRAM_APP_ID || "",
  instagramRedirectUri: process.env.EXPO_PUBLIC_INSTAGRAM_REDIRECT_URI || "",
  facebookAppId: process.env.EXPO_PUBLIC_FB_APP_ID || "",
  facebookClientToken: process.env.EXPO_PUBLIC_FB_CLIENT_TOKEN || "",
  facebookScheme: process.env.EXPO_PUBLIC_FB_SCHEME || "",
  threadsAppId: process.env.EXPO_PUBLIC_THREADS_APP_ID || "",
  threadsRedirectUri: process.env.EXPO_PUBLIC_THREADS_REDIRECT_URI || "",
  xClientId: process.env.EXPO_PUBLIC_X_CLIENT_ID || "",
  xRedirectUri: process.env.EXPO_PUBLIC_X_REDIRECT_URI || "",
};

export default envConfig;
