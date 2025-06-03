import { frontColorPlatformMap, PLATFORM_TYPE } from "@/constants";
import { Statistical } from "@/types/utils";
import React from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const width = Dimensions.get("window").width;

const EngagementMetricsChart = ({
  platform,
  data,
}: {
  platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE];
  data: Statistical["engagementData"][keyof Statistical["engagementData"]];
}) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    frontColor: frontColorPlatformMap[platform],
  }));
  return (
    <View className="flex-row items-center mb-1.5 ">
      <BarChart
        data={chartData}
        horizontal
        barWidth={22}
        barBorderRadius={4}
        maxValue={Math.max(...chartData.map((item: any) => item.value)) || 10}
        width={width - 150}
        xAxisLabelTextStyle={{
          textAlign: "right",
          fontSize: 12,
          position: "absolute",
          right: 10,
        }}
        showFractionalValues={false}
      />
    </View>
  );
};

export default EngagementMetricsChart;
