import CreatePostModal, { getPlatformIcon } from "@/components/schedules/create-post-modal";
import { useAppContext } from "@/contexts/app-context";
import { useGetPosts } from "@/hooks/usePost";
import { cn } from "@/lib/utils";
import { Post } from "@/types/post";
import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Calendar, CalendarTouchableOpacityProps, ICalendarEventBase, Mode } from "react-native-big-calendar";
import Toast from "react-native-toast-message";

const switchMode = ["day", "week", "month"];

export interface PostEvent extends ICalendarEventBase, Post {}

const renderEvent = <T extends ICalendarEventBase>(event: T, touchableOpacityProps: CalendarTouchableOpacityProps) => {
  const { key, ...restProps } = touchableOpacityProps || {};
  return (
    <TouchableOpacity
      key={key}
      {...restProps}
      style={[
        ...(Array.isArray(restProps.style) ? restProps.style : [restProps.style]),
        {
          height: "auto",
        },
      ]}
    >
      <View className="flex-row items-center gap-1">
        {getPlatformIcon((event as any).platform, 10, "white")}
        <Text className="text-xs text-white line-clamp-1">{event.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ScheduleScreen = () => {
  const { data } = useGetPosts();
  const posts = data?.data?.data;
  const events: PostEvent[] =
    posts?.map((post) => ({
      ...post,
      title: post.metadata.content,
      start: new Date(post.publicationTime),
      end: new Date(post.publicationTime),
    })) ?? [];

  const normalizedEvents = events.map((ev) => {
    if (ev.start.getTime() === ev.end.getTime()) {
      return {
        ...ev,
        end: new Date(ev.end.getTime() + 100),
      };
    }
    return ev;
  });

  const { setPost } = useAppContext();
  const [mode, setMode] = useState<Mode>("week");
  const [date, setDate] = useState(new Date());
  const [dateActive, setDateActive] = useState<Date>(new Date());
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
    if (date < new Date()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You cannot create a post in the past",
      });
      return;
    }
    setDateActive(date);
    setModalVisible(true);
  };

  const handlePressEvent = (event: any) => {
    if (!event || !event.metadata) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid event data",
      });
      return;
    }
    setPost(event);
    setModalVisible(true);
  };

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity onPress={goToToday} className="p-2">
          <Text>Today</Text>
        </TouchableOpacity>
        {switchMode.map((m) => (
          <TouchableOpacity key={m} onPress={() => handleModeChange(m as Mode)} className="p-2">
            <Text className={cn(mode === m && "text-primary")}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Calendar<PostEvent>
        events={normalizedEvents}
        height={Dimensions.get("window").height - 170}
        mode={mode}
        date={date}
        onPressCell={handlePressCell}
        overlapOffset={15}
        renderEvent={renderEvent}
        onPressEvent={handlePressEvent}
      />

      <CreatePostModal isModalVisible={isModalVisible} setModalVisible={onSetModalVisible} dateActive={dateActive} />
    </View>
  );
};

export default ScheduleScreen;
