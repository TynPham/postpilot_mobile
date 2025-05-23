import envConfig from "./env-config";

const httpConfigs = {
  baseURL: envConfig.apiUrl,
  apiKey: envConfig.apiKey,
};

export default httpConfigs;
