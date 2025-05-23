import CreatePostModal, { getPlatformIcon } from "@/components/schedules/create-post-modal";
import { useGetPosts } from "@/hooks/usePost";
import React, { useState } from "react";
import { Button, Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Calendar, Mode } from "react-native-big-calendar";

const CalendarScreen = () => {
  const { data } = useGetPosts();
  const posts = data?.data?.data;

  const events =
    posts?.map((post) => ({
      title: post.metadata.content,
      start: new Date(post.publicationTime),
      end: new Date(post.publicationTime),
      platform: post.platform,
      id: post.id,
    })) ?? [];

  const normalizedEvents = events.map((ev) => {
    if (ev.start.getTime() === ev.end.getTime()) {
      return {
        ...ev,
        end: new Date(ev.end.getTime() + 1000),
      };
    }
    return ev;
  });

  const [mode, setMode] = useState<Mode>("week");
  const [date, setDate] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);

  const onSetModalVisible = (bool: boolean) => {
    setModalVisible(bool);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };
  const goToToday = () => {
    setDate(new Date());
  };

  const handlePressCell = (date: Date) => {
    setModalVisible(true);
  };

  const renderEvent = (event: any, touchableOpacityProps: any) => {
    console.log(event);
    const { key, ...restProps } = touchableOpacityProps || {};
    return (
      <TouchableOpacity
        key={key}
        {...restProps}
        style={[
          ...(Array.isArray(restProps.style) ? restProps.style : [restProps.style]),
          {
            // backgroundColor: event.overlapPosition === 0 ? "#ef4444" : "#3b82f6",
            // borderRadius: 8,
            // padding: 8,
            // zIndex: 100 + (event.overlapPosition ?? 0),
            height: "max-content",
          },
        ]}
      >
        <View className="flex-row items-center gap-1">
          {getPlatformIcon(event.platform, 10, "white")}
          <Text className="text-xs text-white line-clamp-1">{event.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button title="Today" onPress={goToToday} />
        <Button title="Day" onPress={() => handleModeChange("day")} />
        <Button title="Week" onPress={() => handleModeChange("week")} />
        <Button title="Month" onPress={() => handleModeChange("month")} />
      </View>
      <Calendar
        events={normalizedEvents}
        height={Dimensions.get("window").height - 170}
        mode={mode}
        date={date}
        onPressCell={handlePressCell}
        overlapOffset={15}
        renderEvent={renderEvent}
      />

      <CreatePostModal isModalVisible={isModalVisible} setModalVisible={onSetModalVisible} />
    </View>
  );
};

export default CalendarScreen;
