import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBAymLL4SZ6DvxF6rU5a5Fz7mvZosXVbKs");

export async function generateAIContent(prompt) {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
