"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY no está configurada.");
    }
    
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
    
    if (history.length > 0 && history[0].role === "model") {
      history.shift();
    }

    const latestMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    return { success: true, text: response.text() };
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return { success: false, error: error.message };
  }
}
