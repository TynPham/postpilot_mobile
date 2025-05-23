import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const getTabBarIcon = (name: string, focused: boolean) => {
  const color = focused ? "hsl(215.24, 98.1%, 58.82%)" : "black";
  switch (name) {
    case "home":
      return <MaterialCommunityIcons name="view-dashboard-outline" size={24} color={color} />;
    case "calendar":
      return <AntDesign name="calendar" size={24} color={color} />;
    case "connect":
      return <Feather name="user-plus" size={24} color={color} />;
    case "bot":
      return <MaterialCommunityIcons name="robot-outline" size={24} color={color} />;
    default:
      return null;
  }
};

const TabBarIcon = ({ focused, name }: { focused: boolean; name: string }) => {
  return <View>{getTabBarIcon(name, focused)}</View>;
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
        },
        tabBarActiveTintColor: "hsl(215.24, 98.1%, 58.82%)",
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="calendar" />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" />,
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
    </Tabs>
  );
};

export default TabLayout;
