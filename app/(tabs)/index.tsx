import BestPostingTimesChart from "@/components/dashboard/best-posting-times-chart";
import EngagementMetricsChart from "@/components/dashboard/engagement-metrics-chart";
import PlatformDistributionChart from "@/components/dashboard/platform-distribution-chart";
import PostStatusChart from "@/components/dashboard/post-status-chart";
import { getPlatformIcon } from "@/components/schedules/create-post-modal";
import { useStatisticalQuery } from "@/hooks/useStatistical";
import { Statistical } from "@/types/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const Tab = createMaterialTopTabNavigator();

const paddingContainer = 16;
const paddingTab = 14;

export default function Dashboard() {
  const [headerTabWidth, setHeaderTabWidth] = useState(0);
  const isScrollable = headerTabWidth > width - paddingContainer - paddingTab;

  const { data, isLoading, error } = useStatisticalQuery();
  const statisticalData = data?.data.data;
  const engagementMetricsDataMap = {
    facebook: {
      platform: "facebook",
      data: statisticalData?.engagementData?.facebookEngagementData,
    },
    instagram: {
      platform: "instagram",
      data: statisticalData?.engagementData?.instagramEngagementData,
    },
    x: {
      platform: "x",
      data: statisticalData?.engagementData?.xEngagementData,
    },
    threads: {
      platform: "threads",
      data: statisticalData?.engagementData?.threadsEngagementData,
    },
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-bold text-xl">Analytics Dashboard</Text>
        <TouchableOpacity className="bg-blue-600 rounded-lg px-4 py-2">
          <Text className="text-white font-bold">Export</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between mb-4">
        <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4 w-[48%] mb-3 flex flex-row justify-between items-end">
          <View>
            <Text className=" text-sm mb-1">Total Posts</Text>
            <Text className="font-bold text-xl leading-none">{statisticalData?.overallMetrics?.totalPosts ?? 0}</Text>
          </View>
          <View>
            <AntDesign name="filetext1" size={24} color="black" />
          </View>
        </View>
        <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4 w-[48%] mb-3 flex flex-row justify-between items-end">
          <View>
            <Text className=" text-sm mb-1">Total Interactions</Text>
            <Text className="font-bold text-xl leading-none">{statisticalData?.overallMetrics?.totalEngagements ?? 0}</Text>
          </View>
          <View>
            <AntDesign name="user" size={24} color="black" />
          </View>
        </View>
        <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4 w-[48%] mb-3 flex flex-row justify-between items-end">
          <View>
            <Text className=" text-sm mb-1">Scheduled Posts</Text>
            <Text className="font-bold text-xl leading-none">{statisticalData?.overallMetrics?.scheduledPosts ?? 0}</Text>
          </View>
          <View>
            <AntDesign name="calendar" size={24} color="black" />
          </View>
        </View>
        <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4 w-[48%] mb-3 flex flex-row justify-between items-end">
          <View>
            <Text className=" text-sm mb-1">Average Reach</Text>
            <Text className="font-bold text-xl leading-none">{statisticalData?.overallMetrics?.averageReach ?? 0}</Text>
          </View>
          <View>
            <AntDesign name="eye" size={24} color="black" />
          </View>
        </View>
      </View>

      <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4 mb-4">
        <Text className="font-bold text-lg mb-2">Engagement Metrics by Platform</Text>
        <View className="h-[400px]" onLayout={(e) => setHeaderTabWidth(e.nativeEvent.layout.width)}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: "hsl(210, 38.68%, 86.2%)",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              },
              tabBarIndicatorStyle: { backgroundColor: "#2563eb" },
              tabBarLabelStyle: { color: "#000", textTransform: "none" },
              tabBarItemStyle: isScrollable ? { width: "auto", paddingHorizontal: 16 } : { paddingHorizontal: 16 },
              tabBarScrollEnabled: isScrollable,
            }}
          >
            {Object.entries(engagementMetricsDataMap).map(([platform, data]) => (
              <Tab.Screen
                key={platform}
                name={platform}
                options={{
                  tabBarLabel: ({ focused }) => (
                    <View>
                      <Text style={{ fontWeight: focused ? "bold" : "normal" }}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
                    </View>
                  ),
                }}
              >
                {() => <EngagementMetricsChart platform={platform as keyof typeof engagementMetricsDataMap} data={data.data ?? {}} />}
              </Tab.Screen>
            ))}
          </Tab.Navigator>
        </View>
      </View>

      <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4 mb-4">
        <Text className="font-bold text-lg mb-2">Platform Distribution</Text>
        <PlatformDistributionChart data={statisticalData?.postsByPlatform as Statistical["postsByPlatform"]} />
      </View>

      <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4 mb-4">
        <Text className=" font-bold text-lg mb-2">Post Performance</Text>
        <PostStatusChart data={statisticalData?.postByStatusResult ?? {}} />
      </View>

      <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4 mb-4">
        <Text className="font-bold text-lg mb-2">Best Time to Post</Text>
        <BestPostingTimesChart data={statisticalData?.postsByTimeRange ?? {}} />
      </View>

      <View className="border-primary border-[1px] bg-muted/10 rounded-xl p-4">
        <Text className="font-bold text-lg mb-2">Recent Posts</Text>
        {statisticalData?.recentPosts?.map((post) => (
          <View key={post.id} className="flex-row items-center bg-muted/50 rounded-lg p-2 mb-2">
            {post.socialCredential.metadata.avatar_url ? (
              <Image source={{ uri: post.socialCredential.metadata.avatar_url }} className="w-10 h-10 rounded-full mr-2.5" />
            ) : (
              <View className="w-10 h-10 rounded-full bg-amber-400 items-center justify-center mr-2.5">
                <Text className="font-bold text-lg">{post.socialCredential.metadata.name[0]}</Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="font-bold">
                {post.socialCredential.metadata.name} <Text className="text-blue-600">{getPlatformIcon(post.platform, 15, "black")}</Text>
              </Text>
              <Text className=" line-clamp-1">{post.metadata.content}</Text>
              <Text className="text-green-500 font-bold mt-1">
                {post.status} | {new Date(post.publicationTime).toLocaleDateString()}{" "}
                {new Date(post.publicationTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
