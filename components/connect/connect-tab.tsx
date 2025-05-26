import { useCredential } from "@/hooks/useCredential";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const ConnectTab = ({ platform }: { platform: string }) => {
  const { data } = useCredential(platform);
  const accounts = data?.data?.data;
  return (
    <View className="flex-1 bg-white rounded-lg min-h-300 p-4">
      <View className="flex flex-row justify-end ">
        <TouchableOpacity className="bg-primary px-4 py-3 rounded-lg">
          <Text className="text-white font-bold">Connect Account</Text>
        </TouchableOpacity>
      </View>
      {accounts && accounts.length > 0 && (
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
              {/* Actions */}
              <TouchableOpacity className="bg-[#b91c1c] rounded-lg size-10 flex items-center justify-center">
                <AntDesign name="disconnect" size={18} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ConnectTab;
