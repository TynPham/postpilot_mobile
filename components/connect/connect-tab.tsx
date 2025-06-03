import { PLATFORM_TYPE } from "@/constants";
import { useCredential, useDisconnectSocialAccountMutation } from "@/hooks/useCredential";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import PlatformSkeleton from "../skeleton/platform-skeleton";
import { Facebook, Instagram, Threads, X } from "./";

const getPlatformButton = (platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]) => {
  switch (platform) {
    case PLATFORM_TYPE.FACEBOOK:
      return <Facebook />;
    case PLATFORM_TYPE.THREADS:
      return <Threads />;
    case PLATFORM_TYPE.X:
      return <X />;
    case PLATFORM_TYPE.INSTAGRAM:
      return <Instagram />;
    default:
      return null;
  }
};

const ConnectTab = ({ platform }: { platform: string }) => {
  const { data, isLoading, isFetching } = useCredential(platform);
  const accounts = data?.data?.data;
  const { mutateAsync: disconnectSocialAccount, isPending: isDisconnecting } = useDisconnectSocialAccountMutation(platform);

  const [disconnectingAccountId, setDisconnectingAccountId] = useState<string | null>(null);
  const handleDisconnect = async (id: string) => {
    if (isDisconnecting || disconnectingAccountId) return;

    try {
      setDisconnectingAccountId(id);
      await disconnectSocialAccount(id);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account disconnected successfully",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDisconnectingAccountId(null);
    }
  };

  return (
    <View className="flex-1 bg-white rounded-lg min-h-300 p-4">
      <View className="flex flex-row justify-end ">{getPlatformButton(platform as (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE])}</View>
      {isLoading || isFetching ? (
        <ScrollView>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <PlatformSkeleton key={index} />
            ))}
        </ScrollView>
      ) : accounts && accounts.length > 0 ? (
        <ScrollView>
          {accounts.map((acc) => (
            <View key={acc.id} className="flex flex-row items-center bg-white rounded-lg p-4 border border-gray-200 mt-4">
              {acc.metadata.avatar_url ? (
                <Image source={{ uri: acc.metadata.avatar_url }} className="w-12 h-12 rounded-full mr-4" />
              ) : (
                <View className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <Text className="text-gray-500 font-bold text-2xl">{acc.metadata.name[0].toUpperCase()}</Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="font-bold text-lg line-clamp-1">{acc.metadata.name}</Text>
                <Text className="text-gray-500 text-sm mt-1"> {acc.metadata.fan_count ?? acc.metadata.username}</Text>
              </View>
              <TouchableOpacity
                className="bg-[#b91c1c] rounded-lg size-10 flex items-center justify-center"
                onPress={() => handleDisconnect(acc.id)}
                disabled={isDisconnecting || disconnectingAccountId === acc.id}
              >
                {isDisconnecting && disconnectingAccountId === acc.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <AntDesign name="disconnect" size={18} color="white" />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No accounts connected</Text>
        </View>
      )}
    </View>
  );
};

export default ConnectTab;
