const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

// First wrap with Reanimated, then with NativeWind
module.exports = withNativeWind(wrapWithReanimatedMetroConfig(config), { input: "./app/global.css" });
