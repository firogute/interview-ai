// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

// const genAI = new GoogleGenerativeAI();
const ai = new GoogleGenAI({
  apiKey: "AIzaSyBAymLL4SZ6DvxF6rU5a5Fz7mvZosXVbKs",
});

export async function generateAIContent(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  console.log(response.text);
}
