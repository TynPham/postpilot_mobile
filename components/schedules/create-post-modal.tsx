import { useGenerateAIContent } from "@/hooks/useAI";
import { useCredential } from "@/hooks/useCredential";
import { cn } from "@/lib/utils";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Image, Keyboard, ScrollView, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Modal from "react-native-modal";
import { z } from "zod";

const platformIconMap = {
  facebook: "facebook",
  instagram: "instagram",
  x: "x-twitter",
  threads: "threads",
};

export const getPlatformIcon = (platform: string, size?: number, color?: string) => {
  return <FontAwesome6 name={platformIconMap[platform as keyof typeof platformIconMap]} size={size ?? 20} color={color ?? "black"} />;
};

const createPostSchema = z.object({
  type: z.enum(["Post", "Story", "Reel"]),
  desc: z.string().min(1, "Description is required"),
  scheduled: z.boolean(),
  checkedAccounts: z.array(z.string()),
});

type CreatePostSchema = z.infer<typeof createPostSchema>;

const CreatePostModal = ({ isModalVisible, setModalVisible }: { isModalVisible: boolean; setModalVisible: (bool: boolean) => void }) => {
  const { data } = useCredential();
  const credentials = data?.data?.data;
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInput, setAIInput] = useState("");
  const { mutateAsync: generateAIContent, isPending: isGeneratingAIContent } = useGenerateAIContent();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePostSchema>({
    defaultValues: {
      type: "Post",
      desc: "",
      scheduled: false,
      checkedAccounts: [],
    },
    resolver: zodResolver(createPostSchema),
  });

  const desc = watch("desc");
  const checkedAccounts = watch("checkedAccounts");
  const allIds = credentials?.map((acc) => acc.id) ?? [];
  const isAllChecked = allIds.length > 0 && allIds.every((id) => checkedAccounts.includes(id));

  const handleCheckAll = (checked: boolean) => {
    setValue("checkedAccounts", checked ? allIds : []);
  };

  const handleAIGenerate = async () => {
    const result = await generateAIContent(aiInput);
    setValue("desc", result);
    setShowAIModal(false);
  };

  const onSubmit = (data: CreatePostSchema) => {
    // Xử lý submit ở đây
    setModalVisible(false);
  };

  return (
    <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="bg-white rounded-lg p-4 max-h-[90%]">
          <Text className="font-bold text-lg mb-2">Schedule Post</Text>
          <View className="flex flex-row gap-2 items-center mb-3">
            <Checkbox value={isAllChecked} onValueChange={handleCheckAll} color="#2563eb" />
            <Text className="text-gray-500 text-sm">Schedule all</Text>
          </View>

          <ScrollView className="max-h-32">
            {credentials?.map((acc) => (
              <View key={acc.id} className="flex flex-row gap-2 items-center mb-3">
                <Controller
                  control={control}
                  name="checkedAccounts"
                  render={({ field: { value, onChange } }) => {
                    const isChecked = value.includes(acc.id);
                    return (
                      <Checkbox
                        value={isChecked}
                        onValueChange={(checked) => {
                          if (checked) {
                            onChange([...value, acc.id]);
                          } else {
                            onChange(value.filter((id) => id !== acc.id));
                          }
                        }}
                        color="#2563eb"
                      />
                    );
                  }}
                />
                {acc.metadata.avatar_url ? (
                  <Image source={{ uri: acc.metadata.avatar_url }} className="size-8 rounded-full" />
                ) : (
                  <View className="size-8 rounded-full bg-amber-500 items-center justify-center">
                    <Text className="text-white font-bold">{acc.metadata.name[0]}</Text>
                  </View>
                )}
                <Text style={{ fontWeight: "500", marginRight: 4 }}>{acc.metadata.name}</Text>
                {getPlatformIcon(acc.platform)}
              </View>
            ))}
          </ScrollView>
          {/* type */}
          <Text className="text-sm font-medium mb-2">Type *</Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <View className="flex flex-row gap-2 mb-3">
                {["Post", "Story", "Reel"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    className={cn("rounded-full px-4 py-2", value === item ? "bg-blue-500" : "bg-gray-200")}
                    onPress={() => onChange(item)}
                  >
                    <Text className={cn(value === item ? "text-white" : "text-gray-700")}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {/* description */}
          <Text className="text-sm font-medium mb-2">Description *</Text>
          <Controller
            control={control}
            name="desc"
            render={({ field: { value, onChange } }) => (
              <TextInput
                className="border border-gray-300 rounded-md p-2 min-h-20 max-h-40 placeholder:text-gray-400"
                placeholder="Enter your description"
                multiline
                value={value}
                onChangeText={onChange}
                scrollEnabled
              />
            )}
          />
          {errors.desc && <Text className="text-red-500 text-xs mb-2">{errors.desc.message}</Text>}
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
              <Controller
                control={control}
                name="scheduled"
                render={({ field: { value, onChange } }) => <Switch value={value} onValueChange={onChange} />}
              />
            </View>
          </View>
          {/* preview post */}
          <View className="mt-4 border border-gray-300 rounded-md p-4 bg-gray-50">
            <View className="flex flex-row items-center mb-2 gap-2">
              {(() => {
                const selected = credentials?.[0];
                if (selected?.metadata.avatar_url) {
                  return <Image source={{ uri: selected.metadata.avatar_url }} className="size-10 rounded-full" />;
                } else {
                  return (
                    <View className="size-10 rounded-full bg-amber-500 items-center justify-center">
                      <Text className="text-white font-bold">{selected?.metadata.name.charAt(0).toUpperCase() ?? "A"}</Text>
                    </View>
                  );
                }
              })()}
              <View>
                <Text className="font-bold text-base">{credentials?.[0]?.metadata.name ?? "Admin"}</Text>
                <Text className="text-gray-500 text-sm">01:15</Text>
              </View>
            </View>
            <ScrollView className="max-h-40">
              <Text className="text-gray-700 mb-4">{desc || "Your description will appear here..."}</Text>
            </ScrollView>
            <View className="flex flex-row justify-around border-t border-gray-300 pt-2">
              <View className="flex flex-row items-center gap-1">
                <FontAwesome6 name="heart" size={15} color="gray" />
                <Text className="text-gray-500 text-sm">Like</Text>
              </View>
              <View className="flex flex-row items-center gap-1">
                <FontAwesome6 name="commenting" size={15} color="gray" />
                <Text className="text-gray-500 text-sm">Comment</Text>
              </View>
              <View className="flex flex-row items-center gap-1">
                <FontAwesome5 name="share-square" size={15} color="gray" />
                <Text className="text-gray-500 text-sm">Share</Text>
              </View>
            </View>
          </View>
          {/* action button */}
          <View className="mt-2 pb-4">
            <Button title="Schedule post" onPress={handleSubmit(onSubmit)} />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 12, alignItems: "center" }}>
              <Text className="text-gray-500">Cancel</Text>
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
                  className="items-center"
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
