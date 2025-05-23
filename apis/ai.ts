// eslint-disable-next-line import/no-unresolved
import envConfig from "@/configs/env-config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(envConfig.geminiApiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const aiApis = {
  generatePost: async (prompt: string) => {
    const response = await model.generateContent(prompt);
    return response.response.text();
  },
};

export default aiApis;
