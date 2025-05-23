import ConnectTab from "@/components/connect/connect-tab";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const TABS = [
  { key: "facebook", label: "Facebook" },
  { key: "threads", label: "Threads" },
  { key: "x", label: "X" },
  { key: "instagram", label: "Instagram" },
];

const ACCOUNTS_BY_PLATFORM: Record<string, { id: number; name: string; avatar: string | null; posts: number }[]> = {
  facebook: [
    {
      id: 1,
      name: "Mang tien ve cho me",
      avatar: "https://i.imgur.com/0y0y0y0.png",
      posts: 3,
    },
    {
      id: 2,
      name: "Ve que an tet",
      avatar: null,
      posts: 1,
    },
  ],
  threads: [
    {
      id: 3,
      name: "Threader",
      avatar: null,
      posts: 2,
    },
  ],
  x: [
    {
      id: 4,
      name: "Xman",
      avatar: null,
      posts: 5,
    },
  ],
  instagram: [
    {
      id: 5,
      name: "Insta Life",
      avatar: null,
      posts: 4,
    },
  ],
};

const MAX_VISIBLE_TABS = 3;

const ConnectScreen = () => {
  const [tabOrder, setTabOrder] = useState(TABS.map((t) => t.key));
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [showMore, setShowMore] = useState(false);

  const visibleTabs = tabOrder
    .slice(0, MAX_VISIBLE_TABS)
    .map((key) => TABS.find((t) => t.key === key))
    .filter(Boolean);
  const moreTabs = tabOrder
    .slice(MAX_VISIBLE_TABS)
    .map((key) => TABS.find((t) => t.key === key))
    .filter(Boolean);

  const handleSelectMoreTab = (tabKey: string) => {
    const newOrder = [tabKey, ...tabOrder.filter((k) => k !== tabKey)];
    setTabOrder(newOrder);
    setActiveTab(tabKey);
    setShowMore(false);
  };

  // Lấy danh sách account theo activeTab
  const accounts = ACCOUNTS_BY_PLATFORM[activeTab] || [];

  return (
    <View className="flex-1 bg-[#e5edf5] p-6 flex flex-col gap-8">
      {/* Header */}
      <View>
        <Text className="text-2xl font-bold text-gray-900">Connect Platforms</Text>
        <Text className="text-gray-500 mt-2">Connect social platforms to manage your posts</Text>
      </View>

      {/* Tabs */}
      <View className="flex flex-row bg-[#d1deeb] rounded-lg overflow-hidden">
        {visibleTabs.map((tab) =>
          tab ? (
            <TouchableOpacity key={tab.key} className={cn("w-1/4 py-3", activeTab === tab.key && "bg-white")} onPress={() => setActiveTab(tab.key)}>
              <Text className={cn("text-gray-900 text-center", activeTab === tab.key && "font-bold")}>{tab.label}</Text>
            </TouchableOpacity>
          ) : null
        )}
        {moreTabs.length > 0 && (
          <TouchableOpacity
            className="w-1/4 py-3"
            style={{ backgroundColor: showMore ? "#fff" : "#d1deeb", paddingVertical: 10, alignItems: "center" }}
            onPress={() => setShowMore(true)}
          >
            <Text className={cn("text-gray-900 text-center", showMore && "font-bold")}>More ...</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* More Modal */}
      <Modal visible={showMore} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }} onPress={() => setShowMore(false)}>
          <View style={{ position: "absolute", top: 120, left: 40, right: 40, backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>More Platforms</Text>
            {moreTabs.map((tab) =>
              tab ? (
                <TouchableOpacity key={tab.key} style={{ paddingVertical: 10 }} onPress={() => handleSelectMoreTab(tab.key)}>
                  <Text style={{ color: "#222", fontWeight: activeTab === tab.key ? "bold" : "normal" }}>{tab.label}</Text>
                </TouchableOpacity>
              ) : null
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Content */}
      <ConnectTab platform={activeTab} />
    </View>
  );
};

export default ConnectScreen;
