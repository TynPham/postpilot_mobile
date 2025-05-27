import path from "@/constants/path";
import { useAppContext } from "@/contexts/app-context";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { token } = useAppContext();
  if (token) {
    return <Redirect href={path.schedule} />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
