import Input from "@/components/input";
import { TOKEN_KEY } from "@/constants/token";
import { signInSchema, SignInSchema } from "@/schema-validations/auth";
import { setSecureStore } from "@/utils/secure-store";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { getToken } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInSchema) => {
    if (!isLoaded) return;

    try {
      setError("");
      setLoading(true);
      const { email, password } = data;
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        const token = await getToken();
        if (token) {
          await setSecureStore(TOKEN_KEY, token);
        }
        router.push("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pt-12 min-h-screen justify-center">
          {/* Header */}
          <View className="items-center mb-12">
            {/* <Image source={require("@/assets/images/logo.png")} className="w-24 h-24 mb-4" resizeMode="contain" />s */}
            <Text className="text-2xl font-bold text-gray-900">Welcome Back</Text>
            <Text className="text-gray-500 mt-2">Sign in to continue</Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 p-4 rounded-lg mb-4">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="flex flex-col gap-4">
            <Input
              label="Email"
              name="email"
              control={control}
              errorMessage={errors.email?.message}
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            <View className="relative">
              <Input
                label="Password"
                name="password"
                control={control}
                errorMessage={errors.password?.message}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2">
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="w-full bg-blue-500 p-4 rounded-lg mt-4" onPress={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold text-lg">Sign In</Text>}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")} disabled={loading}>
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
