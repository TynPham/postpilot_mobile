import CreatePostModal from "@/components/schedules/create-post-modal";
import React, { useState } from "react";
import { Button, Dimensions, View } from "react-native";
import { Calendar, Mode } from "react-native-big-calendar";

const events = [
  {
    title: "Meeting",
    start: new Date(2025, 4, 22, 10, 0),
    end: new Date(2025, 4, 22, 10, 30),
  },
  {
    title: "Coffee break",
    start: new Date(2025, 4, 22, 15, 45),
    end: new Date(2025, 4, 22, 16, 30),
  },
];

const CalendarScreen = () => {
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

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button title="Today" onPress={goToToday} />
        <Button title="Day" onPress={() => handleModeChange("day")} />
        <Button title="Week" onPress={() => handleModeChange("week")} />
        <Button title="Month" onPress={() => handleModeChange("month")} />
      </View>
      <Calendar events={events} height={Dimensions.get("window").height - 170} mode={mode} date={date} onPressCell={handlePressCell} />

      <CreatePostModal isModalVisible={isModalVisible} setModalVisible={onSetModalVisible} />
    </View>
  );
};

export default CalendarScreen;
