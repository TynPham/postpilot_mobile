import { useGenerateAIContent } from "@/hooks/useAI";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Button, Image, Keyboard, ScrollView, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Modal from "react-native-modal";

const ACCOUNTS = [
  {
    id: 1,
    name: "Mang tien ve cho me",
    avatar: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    platform: "facebook",
    checked: false,
  },
  {
    id: 2,
    name: "Ve que an tet",
    avatar: null,
    platform: "facebook",
    checked: false,
  },
];

const CreatePostModal = ({ isModalVisible, setModalVisible }: { isModalVisible: boolean; setModalVisible: (bool: boolean) => void }) => {
  const [type, setType] = useState<"Post" | "Story" | "Reel">("Post");
  const [desc, setDesc] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [isChecked, setChecked] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInput, setAIInput] = useState("");

  const { mutateAsync: generateAIContent, isPending: isGeneratingAIContent } = useGenerateAIContent();

  const handleAIGenerate = async () => {
    const result = await generateAIContent(aiInput);
    setDesc(result);
    setShowAIModal(false);
  };

  return (
    <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="bg-white rounded-lg p-4 max-h-[90%]">
          <Text className="font-bold text-lg mb-2">Schedule Post</Text>
          <View className="flex flex-row gap-2 items-center mb-3">
            <Checkbox value={isChecked} onValueChange={setChecked} color="#2563eb" />
            <Text className="text-gray-500 text-sm">Schedule all</Text>
          </View>
          {accounts.map((acc) => (
            <View key={acc.id} className="flex flex-row gap-2 items-center mb-3">
              <Checkbox value={isChecked} onValueChange={setChecked} color="#2563eb" />
              {acc.avatar ? (
                <Image source={{ uri: acc.avatar }} className="size-8 rounded-full" />
              ) : (
                <View className="size-8 rounded-full bg-amber-500 items-center justify-center">
                  <Text className="text-white font-bold">{acc.name[0]}</Text>
                </View>
              )}
              <Text style={{ fontWeight: "500", marginRight: 4 }}>{acc.name}</Text>
              <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/733/733547.png" }} style={{ width: 16, height: 16, marginLeft: 2 }} />
            </View>
          ))}
          {/* type */}
          <Text className="text-sm font-medium mb-2">Type *</Text>
          <View className="flex flex-row gap-2 mb-3">
            {["Post", "Story", "Reel"].map((item) => (
              <TouchableOpacity
                key={item}
                className={`${type === item ? "bg-blue-500" : "bg-gray-200"} rounded-full px-4 py-2`}
                onPress={() => setType(item as any)}
              >
                <Text className={`${type === item ? "text-white" : "text-gray-700"}`}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* description */}
          <Text className="text-sm font-medium mb-2">Description *</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2 min-h-20 max-h-40"
            placeholder="Nhập mô tả..."
            multiline
            value={desc}
            onChangeText={setDesc}
            scrollEnabled
          />
          {/* AI Generate button */}
          <TouchableOpacity className="flex flex-row items-center mt-2 mb-4" onPress={() => setShowAIModal(true)}>
            <Text className="text-blue-500 mr-1">✨</Text>
            <Text className="text-blue-500 font-medium">AI Generate</Text>
          </TouchableOpacity>
          {/* media (temporary skip) */}
          <Text className="text-sm font-medium mb-2">Media</Text>
          <View className="h-10 bg-gray-200 rounded-md mb-3 justify-center items-center">
            <Text className="text-gray-500">Not supported</Text>
          </View>
          {/* date */}
          <Text className="text-sm font-medium mb-2">Date</Text>
          <View className="flex flex-row justify-between items-center mb-3">
            <View className="flex flex-row items-center">
              <Text>05/23/2025</Text>
              <Text className="mx-2">-</Text>
              <Text>01:15 AM</Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Text>Recurring</Text>
              <Switch value={scheduled} onValueChange={setScheduled} />
            </View>
          </View>
          {/* preview post */}
          <View className="mt-4 border border-gray-300 rounded-md p-4 bg-gray-50">
            <View className="flex flex-row items-center mb-2">
              {(() => {
                const selected = accounts.find((acc) => acc.checked) || accounts[0];
                if (selected.avatar) {
                  return <Image source={{ uri: selected.avatar }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} />;
                } else {
                  return (
                    <View className="size-8 rounded-full bg-amber-500 items-center justify-center">
                      <Text className="text-white font-bold">{selected.name[0]}</Text>
                    </View>
                  );
                }
              })()}
              <View>
                <Text className="font-bold text-base">{accounts.find((acc) => acc.checked)?.name || accounts[0].name}</Text>
                <Text className="text-gray-500 text-sm">01:15</Text>
              </View>
            </View>
            <ScrollView className="max-h-40">
              <Text className="text-gray-700 mb-4">{desc || "Your description will appear here..."}</Text>
            </ScrollView>
            <View className="flex flex-row justify-around border-t border-gray-300 pt-2">
              <View className="flex flex-row items-center">
                <Text className="mr-1">♡</Text>
                <Text className="text-gray-500 text-sm">Like</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text className="mr-1">💬</Text>
                <Text className="text-gray-500 text-sm">Comment</Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="mr-1">↗</Text>
                <Text className="text-gray-500 text-sm">Share</Text>
              </View>
            </View>
          </View>
          {/* action button */}
          <View className="mt-2 pb-4">
            <Button title="Schedule post" onPress={() => setModalVisible(false)} />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 12, alignItems: "center" }}>
              <Text style={{ color: "#64748b" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {/* AI Modal */}
          <Modal isVisible={showAIModal} onBackdropPress={() => setShowAIModal(false)}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="bg-white rounded-lg p-4 max-h-[90%]">
                <Text className="font-bold text-lg mb-2">AI Generated</Text>
                <Text className="text-gray-500 text-sm mb-2">Describe the post you are submitting to generate ideas</Text>
                <TextInput
                  className="border border-gray-300 rounded-md p-2 max-h-40 placeholder:text-gray-400 placeholder:text-xs"
                  placeholder="e.g. Promote my blog post about the best trekking tour"
                  value={aiInput}
                  onChangeText={setAIInput}
                  scrollEnabled
                  multiline
                />
                <Button title={isGeneratingAIContent ? "Generating..." : "Generate"} onPress={handleAIGenerate} disabled={isGeneratingAIContent} />
                <TouchableOpacity
                  onPress={() => {
                    setShowAIModal(false);
                    setAIInput("");
                  }}
                  style={{ marginTop: 12, alignItems: "center" }}
                >
                  <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-gray-500 text-sm mt-2 text-center">
                  AI Assistant can generate inaccurate or misleading information. Always review generated content before posting.
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreatePostModal;
