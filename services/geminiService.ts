import { AGENT_CONTEXT } from "./agentContext";

// Call backend chat API instead of using client-side API key
export const streamChatResponse = async function* (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  systemInstruction?: string
) {
  try {
    // Use agent context system instruction if not provided
    const instruction = systemInstruction || AGENT_CONTEXT.getSystemInstruction();

    // Call backend Netlify Function via /api/chat endpoint
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        history, 
        message,
        systemInstruction: instruction 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Chat API error: ${response.status}`, errorText);
      throw new Error(`Chat API request failed: ${response.status}`);
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
