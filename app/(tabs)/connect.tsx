import ConnectTab from "@/components/connect/connect-tab";
import { ACTIVE_TAB_COLOR } from "@/constants";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";

const TABS = [
  { key: "facebook", label: "Facebook" },
  { key: "threads", label: "Threads" },
  { key: "x", label: "X" },
  { key: "instagram", label: "Instagram" },
];

const Tab = createMaterialTopTabNavigator();

const width = Dimensions.get("window").width;

const paddingContainer = 16;

const ConnectScreen = () => {
  const [headerTabWidth, setHeaderTabWidth] = useState(0);
  const isScrollable = headerTabWidth > width - paddingContainer;
  const params = useLocalSearchParams();
  const initialTab = (params.tab as string) || TABS[0].label;
  return (
    <View className="flex-1 bg-[#e5edf5] p-6 flex flex-col gap-8">
      {/* Header */}
      <View>
        <Text className="text-2xl font-bold text-gray-900">Connect Platforms</Text>
        <Text className="text-gray-500 mt-2">Connect social platforms to manage your posts</Text>
      </View>

      {/* Tabs */}
      <View className="flex-1" onLayout={(e) => setHeaderTabWidth(e.nativeEvent.layout.width)}>
        <Tab.Navigator
          initialRouteName={initialTab}
          screenOptions={{
            tabBarStyle: { backgroundColor: "#d1deeb", borderTopLeftRadius: 8, borderTopRightRadius: 8 },
            tabBarIndicatorStyle: { backgroundColor: ACTIVE_TAB_COLOR },
            tabBarLabelStyle: {
              color: "#000",
              textTransform: "none",
              flexShrink: 1,
              flexWrap: "nowrap",
            },
            tabBarItemStyle: isScrollable ? { width: "auto", paddingHorizontal: 16 } : { paddingHorizontal: 16 },
            tabBarScrollEnabled: isScrollable,
          }}
        >
          {TABS.map((tab, index) => (
            <Tab.Screen
              key={tab.key}
              name={tab.label}
              options={{
                tabBarLabel: ({ focused }) => (
                  <View>
                    <Text style={{ fontWeight: focused ? "bold" : "normal" }}>{tab.label}</Text>
                  </View>
                ),
              }}
            >
              {() => <ConnectTab platform={tab.key} />}
            </Tab.Screen>
          ))}
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default ConnectScreen;
