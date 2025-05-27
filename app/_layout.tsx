import envConfig from "@/configs/env-config";
import { TOKEN_KEY } from "@/constants/token";
import { useAppContext } from "@/contexts/app-context";
import { getSecureStore } from "@/utils/secure-store";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "./global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

const RenderLayout = () => {
  const { setToken } = useAppContext();

  useEffect(() => {
    const getToken = async () => {
      const token = await getSecureStore(TOKEN_KEY);
      if (token) {
        setToken(token);
      }
    };
    getToken();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={envConfig.clerkPublishableKey}>
        <RenderLayout />
        <Toast />
      </ClerkProvider>
    </QueryClientProvider>
  );
}
