import * as SecureStore from "expo-secure-store";

export const getSecureStore = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const setSecureStore = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const deleteSecureStore = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};
