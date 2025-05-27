import path from "@/constants/path";
import { TOKEN_KEY } from "@/constants/token";
import { useAppContext } from "@/contexts/app-context";
import { deleteSecureStore } from "@/utils/secure-store";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setToken } = useAppContext();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError("");
      await signOut();
      await deleteSecureStore(TOKEN_KEY);
      setToken(null);
      router.replace(path.signIn);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err.message || "Failed to sign out");
      console.error("Error signing out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="space-y-2">
      {error && <Text className="text-red-500 text-center text-sm">{error}</Text>}

      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-red-500 px-4 py-2 rounded-lg flex flex-row items-center justify-center gap-2"
        disabled={loading}
      >
        <Text className="text-white font-semibold text-center">Sign Out</Text>
        {loading && <ActivityIndicator color="white" />}
      </TouchableOpacity>
    </View>
  );
};
