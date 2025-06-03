import { ACTIVE_TAB_COLOR } from "@/constants";
import path from "@/constants/path";
import { useAppContext } from "@/contexts/app-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const getTabBarIcon = (name: string, focused: boolean) => {
  const styleIcon = {
    color: focused ? ACTIVE_TAB_COLOR : "black",
    size: 24,
  };

  switch (name) {
    case "dashboard":
      return <MaterialCommunityIcons name="view-dashboard-outline" {...styleIcon} />;
    case "schedule":
      return <AntDesign name="calendar" {...styleIcon} />;
    case "connect":
      return <Feather name="user-plus" {...styleIcon} />;
    case "bot":
      return <MaterialCommunityIcons name="robot-outline" {...styleIcon} />;
    case "setting":
      return <Feather name="settings" {...styleIcon} />;
    default:
      return null;
  }
};

const TabBarIcon = ({ focused, name }: { focused: boolean; name: string }) => {
  return <View>{getTabBarIcon(name, focused)}</View>;
};

const TabLayout = () => {
  const { token } = useAppContext();
  if (!token) {
    return <Redirect href={path.signIn} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
        },
        tabBarActiveTintColor: ACTIVE_TAB_COLOR,
      }}
    >
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="schedule" />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="dashboard" />,
        }}
      />

      <Tabs.Screen
        name="connect"
        options={{
          title: "Connect",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="connect" />,
        }}
      />
      <Tabs.Screen
        name="bot"
        options={{
          title: "Bot",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="bot" />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="setting" />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
