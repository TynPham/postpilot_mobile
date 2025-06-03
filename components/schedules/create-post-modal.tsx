import { useAppContext } from "@/contexts/app-context";
import { useGenerateAIContent } from "@/hooks/useAI";
import { useCredential } from "@/hooks/useCredential";
import { useCreatePostMutation } from "@/hooks/usePost";
import { cn } from "@/lib/utils";
import { createPostSchema, CreatePostSchema } from "@/schema-validations/post";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

const platformIconMap = {
  facebook: "facebook",
  instagram: "instagram",
  x: "x-twitter",
  threads: "threads",
};

const checkBoxColor = "#2563eb";

export const getPlatformIcon = (platform: string, size?: number, color?: string) => {
  return <FontAwesome6 name={platformIconMap[platform as keyof typeof platformIconMap]} size={size ?? 20} color={color ?? "black"} />;
};

const CreatePostModal = ({
  isModalVisible,
  setModalVisible,
  dateActive,
}: {
  isModalVisible: boolean;
  setModalVisible: (bool: boolean) => void;
  dateActive: Date;
}) => {
  const { data } = useCredential();
  const credentials = data?.data?.data;
  const { post, setPost } = useAppContext();
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInput, setAIInput] = useState("");

  const { mutateAsync: generateAIContent, isPending: isGeneratingAIContent } = useGenerateAIContent();
  const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePostMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePostSchema>({
    defaultValues: {
      type: "Post",
      desc: "",
      checkedAccounts: [],
      dateTime: dateActive ?? new Date(),
    },
    resolver: zodResolver(createPostSchema),
  });

  useEffect(() => {
    setValue("dateTime", dateActive ?? new Date());
  }, [dateActive, setValue]);

  useEffect(() => {
    if (post && post.metadata) {
      setValue("desc", post.metadata.content || "");
      setValue("type", post.metadata.type as "Post" | "Story" | "Reel");
      setValue("checkedAccounts", [post.socialCredentialID]);
      setValue("dateTime", new Date(post.publicationTime));
    }
  }, [post, setValue]);

  const desc = watch("desc");
  const checkedAccounts = watch("checkedAccounts");
  const dateTime = watch("dateTime");
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

  const onSubmit: SubmitHandler<CreatePostSchema> = async (data) => {
    if (isCreatingPost) return;
    try {
      const { dateTime } = data;
      dateTime.setSeconds(0);
      const selectedCredentials = credentials?.filter((acc) => checkedAccounts.includes(acc.id));
      const createPostBody = {
        publicationTime: dateTime.toISOString(),
        socialPosts:
          selectedCredentials?.map((acc) => ({
            platform: acc.platform,
            socialCredentialID: acc.id,
            metadata: {
              type: data.type as string,
              content: data.desc,
              assets: [],
            },
          })) ?? [],
      };
      await createPost(createPostBody);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post created successfully",
      });
      setModalVisible(false);
      reset();
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: dateTime,
      mode: "date",
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          const newDate = new Date(dateTime);
          newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
          setValue("dateTime", newDate, { shouldValidate: true });
        }
      },
    });
  };

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: dateTime,
      mode: "time",
      is24Hour: true,
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          const newDate = new Date(dateTime);
          newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
          setValue("dateTime", newDate, { shouldValidate: true });
        }
      },
    });
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={() => {
        setModalVisible(false);
        setPost(undefined);
        reset();
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="bg-white rounded-lg p-4 max-h-[90%]">
          <Text className="font-bold text-lg mb-2">Schedule Post</Text>
          <View className="flex flex-row gap-2 items-center mb-3">
            <Checkbox value={isAllChecked} onValueChange={handleCheckAll} color={checkBoxColor} />
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
                        color={checkBoxColor}
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
                <Text className="font-medium mr-1">{acc.metadata.name}</Text>
                {getPlatformIcon(acc.platform)}
              </View>
            ))}
          </ScrollView>
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
          <TouchableOpacity className="flex flex-row items-center mt-2 mb-4" onPress={() => setShowAIModal(true)}>
            <Text className="text-blue-500 mr-1">✨</Text>
            <Text className="text-blue-500 font-medium">AI Generate</Text>
          </TouchableOpacity>
          {/* media (temporary skip) */}
          <Text className="text-sm font-medium mb-2">Media</Text>
          <View className="h-10 bg-gray-200 rounded-md mb-3 justify-center items-center">
            <Text className="text-gray-500">Not supported</Text>
          </View>
          <Text className="text-sm font-medium mb-2">Date</Text>
          <View className="flex flex-row justify-between items-center mb-3">
            <View className="flex flex-row items-center -ml-2">
              <TouchableOpacity onPress={showDatePicker} className="mr-2 bg-gray-100 px-3 py-2 rounded-md">
                <Text>{dateTime.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={showTimePicker} className="bg-gray-100 px-3 py-2 rounded-md">
                <Text>{dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* preview post */}
          <View className="mt-4 border border-gray-300 rounded-md p-4 bg-gray-50">
            <View className="flex flex-row items-center mb-2 gap-2">
              {(() => {
                {
                  /* temporary avatar */
                }
                const selected = credentials?.find((acc) => checkedAccounts.includes(acc.id)) || credentials?.[0];
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
                <Text className="font-bold text-base">
                  {credentials?.find((acc) => checkedAccounts.includes(acc.id))?.metadata.name || credentials?.[0]?.metadata.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                </Text>
              </View>
            </View>
            <ScrollView className="max-h-40">
              <Text className="text-gray-700 mb-4">{desc || "Your description will appear here..."}</Text>
            </ScrollView>
            <View className="flex flex-row justify-around border-t border-gray-300 pt-2">
              {[
                { icon: "heart", label: "Like" },
                { icon: "commenting", label: "Comment" },
                { icon: "share-square", label: "Share" },
              ].map((item) => (
                <View className="flex flex-row items-center gap-1" key={item.label}>
                  <FontAwesome6 name={item.icon} size={15} color="gray" />
                  <Text className="text-gray-500 text-sm">{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="mt-2 pb-4">
            <Button title="Schedule post" onPress={handleSubmit(onSubmit)} disabled={isCreatingPost} />
            <TouchableOpacity onPress={() => setModalVisible(false)} className="items-center p-4">
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
