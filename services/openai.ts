import OpenAI from "openai";

export function getOpenAIClient() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
  });
  return openai;
}
