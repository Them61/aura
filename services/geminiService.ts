import { AGENT_CONTEXT } from "./agentContext";

// Call backend chat API instead of using client-side API key
export const streamChatResponse = async function* (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) {
  try {
    // Call backend Netlify Function
    const apiEndpoint = import.meta.env.VITE_STRIPE_API_ENDPOINT?.replace('/create-checkout-session', '') || '/api';
    const response = await fetch(`${apiEndpoint}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message }),
    });

    if (!response.ok) {
      throw new Error('Chat API request failed');
    }

    const data = await response.json();
    yield data.response || "Désolé, je rencontre des difficultés techniques. Vous pouvez nous joindre au 438-933-6195.";

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    yield "Désolé, je rencontre des difficultés techniques. Vous pouvez nous joindre au 438-933-6195.";
  }
};

// For audio transcription, we'll use a simple fallback or create another function
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // For now, return empty string as audio transcription requires additional setup
    // In production, you could use a speech-to-text service like Google Cloud Speech-to-Text
    console.log("Audio transcription not yet configured");
    return "";
  } catch (error) {
    console.error("Transcription Error:", error);
    return "";
  }
};
