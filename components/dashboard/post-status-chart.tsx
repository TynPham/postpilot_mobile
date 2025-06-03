import { frontColorPlatformMap } from "@/constants";
import { Statistical } from "@/types/utils";
import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

const PostStatusChart = ({ data }: { data: Statistical["postByStatusResult"] }) => {
  const publishedChartData = Object.entries({
    "Apr 20": 3,
    "Apr 21": 4,
    "Apr 22": 5,
    "Apr 23": 6,
    "Apr 24": 7,
    "Apr 25": 8,
    "Apr 26": 9,
    "Apr 27": 10,
    "Apr 28": 11,
    "Apr 29": 12,
    "Apr 30": 13,
  }).map(([key, value]) => ({
    label: key,
    value: value,
    color: frontColorPlatformMap["facebook"],
  }));

  const scheduledChartData = Object.entries(data.scheduled).map(([key, value]) => ({
    label: key,
    value: value,
    color: frontColorPlatformMap["instagram"],
  }));

  const recurringChartData = Object.entries(data.recurring).map(([key, value]) => ({
    label: key,
    value: value,
    color: frontColorPlatformMap["x"],
  }));

  const failedChartData = Object.entries(data.failed).map(([key, value]) => ({
    label: key,
    value: value,
    color: frontColorPlatformMap["reddit"],
  }));

  return (
    <View>
      <LineChart
        data={publishedChartData}
        data2={scheduledChartData}
        data3={recurringChartData}
        data4={failedChartData}
        height={250}
        showVerticalLines
        color1={publishedChartData[0].color}
        color2={scheduledChartData[0].color}
        color3={recurringChartData[0].color}
        color4={failedChartData[0].color}
        dataPointsColor1={publishedChartData[0].color}
        dataPointsColor2={scheduledChartData[0].color}
        dataPointsColor3={recurringChartData[0].color}
        dataPointsColor4={failedChartData[0].color}
        width={width - 128}
        showFractionalValues={false}
        maxValue={Math.max(
          ...publishedChartData.map((item) => item.value),
          ...scheduledChartData.map((item) => item.value),
          ...recurringChartData.map((item) => item.value),
          ...failedChartData.map((item) => item.value)
        )}
        noOfSections={Math.max(
          ...publishedChartData.map((item) => item.value),
          ...scheduledChartData.map((item) => item.value),
          ...recurringChartData.map((item) => item.value),
          ...failedChartData.map((item) => item.value)
        )}
      />
    </View>
  );
};

export default PostStatusChart;
