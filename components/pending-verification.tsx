import { TEMPLATE_TOKEN } from "@/constants";
import { TOKEN_KEY } from "@/constants/token";
import { verifyEmailSchema, VerifyEmailSchema } from "@/schema-validations/auth";
import { setSecureStore } from "@/utils/secure-store";
import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Input from "./input";

const PendingVerification = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { getToken } = useAuth();

  const {
    control: verifyEmailControl,
    handleSubmit: verifyEmailHandleSubmit,
    formState: { errors: verifyEmailErrors },
  } = useForm<VerifyEmailSchema>({
    defaultValues: { code: "" },
    resolver: zodResolver(verifyEmailSchema),
  });

  const onVerifyPress = async (data: VerifyEmailSchema) => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        const token = await getToken({ template: TEMPLATE_TOKEN });
        if (token) {
          await setSecureStore(TOKEN_KEY, token);
        }
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError("Something went wrong. Please try again.");
      }
    } catch (err: any) {
      console.log("err", err);
      setError(err.errors?.[0]?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pt-12 min-h-screen justify-center">
          <View className="items-center mb-12">
            <Text className="text-2xl font-bold text-gray-900">Verify Email</Text>
            <Text className="text-gray-500 mt-2">Enter the code sent to your email</Text>
          </View>

          {error && (
            <View className="bg-red-50 p-4 rounded-lg mb-4">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          )}

          <View className="flex flex-col gap-6">
            <Input
              label="Verification Code"
              name="code"
              control={verifyEmailControl}
              errorMessage={verifyEmailErrors.code?.message}
              placeholder="Enter verification code"
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity className="w-full bg-blue-500 p-4 rounded-lg" onPress={verifyEmailHandleSubmit(onVerifyPress)} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold text-lg">Verify Email</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PendingVerification;
