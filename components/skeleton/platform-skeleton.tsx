import { View } from "react-native";

const PlatformSkeleton = () => (
  <View className="flex flex-row items-center bg-white rounded-lg p-4 border border-gray-200 mt-4">
    <View className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mr-4" />
    <View className="flex-1">
      <View className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
      <View className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mt-2" />
    </View>
    <View className="bg-gray-200 rounded-lg size-10 animate-pulse" />
  </View>
);

export default PlatformSkeleton;
