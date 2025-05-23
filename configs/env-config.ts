const envConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY || "",
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "",
  geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
};

export default envConfig;
