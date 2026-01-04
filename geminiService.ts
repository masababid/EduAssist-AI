
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./constants";
import { Message } from "./types";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    // Initializing GoogleGenAI with the API key from environment variables directly as required.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(text: string): Promise<string> {
    try {
      const result: GenerateContentResponse = await this.chat.sendMessage({ message: text });
      // Accessing the .text property directly from the GenerateContentResponse object.
      return result.text || "I'm sorry, I couldn't process that. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "An error occurred while connecting to the helpdesk AI. Please try again later.";
    }
  }

  // Helper to re-initialize or reset chat if needed
  reset() {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
  }
}

export const gemini = new GeminiService();
