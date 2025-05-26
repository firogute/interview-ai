import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBAymLL4SZ6DvxF6rU5a5Fz7mvZosXVbKs",
});

let chatSession = null;

export async function generateAIContent(prompt, messages = []) {
  try {
    if (!chatSession) {
      const history = messages.map((msg) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      chatSession = ai.chats.create({
        model: "gemini-2.0-flash",
        history: history,
      });
    }

    const response = await chatSession.sendMessage({
      message: prompt,
    });

    // console.log("Chat response:", response.text);
    return response.text;
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw error;
  }
}
