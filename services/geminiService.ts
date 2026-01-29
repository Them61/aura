import { GoogleGenAI } from "@google/genai";
import { AGENT_CONTEXT } from "./agentContext";

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const streamChatResponse = async function* (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) {
  const ai = getClient();
  if (!ai) return;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        thinkingConfig: { thinkingBudget: 1500 }, // Augmentation du budget pour une meilleure analyse
        systemInstruction: AGENT_CONTEXT.getSystemInstruction(),
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
        if (chunk.text) {
            yield chunk.text;
        }
    }

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    yield "Désolé, je rencontre des difficultés techniques. Vous pouvez nous joindre au 438-933-6195.";
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const ai = getClient();
  if (!ai) return "";

  try {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
    });
    reader.readAsDataURL(audioBlob);
    const base64Data = await base64Promise;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type || 'audio/webm',
              data: base64Data
            }
          },
          {
            text: "Transcris cet audio précisément en français. C'est une question pour un studio de microlocs."
          }
        ]
      }
    });

    return response.text || "";

  } catch (error) {
    console.error("Transcription Error:", error);
    throw error;
  }
};
