import Input from "@/components/input";
import PendingVerification from "@/components/pending-verification";
import { signUpSchema, SignUpSchema } from "@/schema-validations/auth";
import { useSignUp } from "@clerk/clerk-expo";

import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchema) => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
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

  if (pendingVerification) {
    return <PendingVerification />;
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pt-12 min-h-screen justify-center">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-2xl font-bold text-gray-900">Create Account</Text>
            <Text className="text-gray-500 mt-2">Sign up to get started</Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 p-4 rounded-lg mb-4">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="flex flex-col gap-4">
            <Input label="Username" name="username" control={control} errorMessage={errors.username?.message} placeholder="Enter your username" />

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
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                className="pr-12"
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2">
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="w-full bg-blue-500 p-4 rounded-lg mt-4" onPress={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold text-lg">Sign Up</Text>}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")} disabled={loading}>
              <Text className="text-blue-500 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
