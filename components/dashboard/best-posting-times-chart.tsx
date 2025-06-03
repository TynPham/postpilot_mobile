import { frontColorPlatformMap } from "@/constants";
import { Statistical } from "@/types/utils";
import React from "react";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

const BestPostingTimesChart = ({ data }: { data: Statistical["postsByTimeRange"] }) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    label: key,
    value: value,
  }));
  return <BarChart data={chartData} width={width - 128} barWidth={24} frontColor={frontColorPlatformMap["facebook"]} isAnimated spacing={30} />;
};

export default BestPostingTimesChart;
