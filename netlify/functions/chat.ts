import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';
import { AGENT_CONTEXT } from '../../services/agentContext';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { history, message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Create chat with Gemini
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        thinkingConfig: { thinkingBudget: 1500 },
        systemInstruction: `You are an expert stylist assistant for Aura Microlocs, a locs hair care and styling service located in Montreal.

Your role is to:
1. Help customers understand locs services and pricing
2. Answer questions about locs care and maintenance
3. Assist with booking and scheduling
4. Provide professional hair styling advice
5. Be friendly, professional, and helpful in French and English

Services offered:
- Starter Locs: Initial loc formation ($150)
- Maintenance: Regular loc retightening ($80-120)
- Styling: Creative loc styling and arrangements ($50-100)
- Deep Clean: Specialized locs cleaning ($60)
- Color Treatment: Professional loc coloring ($80-150)

Always respond in a friendly, professional manner. If asked about services not offered, politely explain what we do offer.`,
      },
      history: history || [],
    });

    // Send message and get response
    const result = await chat.sendMessage({ message });
    const responseText = result.text || 'Sorry, I could not generate a response.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    console.error('Gemini Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process chat request',
        response: 'Désolé, je rencontre des difficultés techniques. Vous pouvez nous joindre au 438-933-6195.',
      }),
    };
  }
};
