import { frontColorPlatformMap, PLATFORM_TYPE } from "@/constants";
import { Statistical } from "@/types/utils";
import React from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const renderDot = (color: string) => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

const renderLegendComponent = (pieData: any) => {
  return (
    <View className="flex-row flex-wrap justify-center items-center">
      {pieData.map((item: any) => {
        return (
          <View key={item.label} className="flex-row items-center w-max px-4">
            {renderDot(item.color)}
            <Text>
              {item.label}: {item.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const temporaryFilterPlatform = {
  facebook: "facebook",
  instagram: "instagram",
  x: "x",
  threads: "threads",
};

const PlatformDistributionChart = ({ data }: { data: Statistical["postsByPlatform"] }) => {
  const chartData = Object.entries(data)
    .filter(([platform]) => platform in temporaryFilterPlatform)
    .map(([platform, count]) => ({
      label: platform,
      value: count,
      color: frontColorPlatformMap[platform as keyof typeof frontColorPlatformMap],
      focused: platform === PLATFORM_TYPE.FACEBOOK,
    }));
  return (
    <View>
      <View style={{ padding: 20, alignItems: "center" }}>
        <PieChart
          data={chartData.map((item) => ({ ...item, value: item.value + 1 }))}
          textColor="black"
          focusOnPress
          showValuesAsLabels
          showTextBackground
          textBackgroundRadius={26}
        />
      </View>
      {renderLegendComponent(chartData)}
    </View>
  );
};

export default PlatformDistributionChart;
