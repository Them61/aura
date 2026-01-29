import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

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
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'API key not configured',
          response: 'Désolé, je rencontre des difficultés techniques. Vous pouvez nous joindre au 438-933-6195.',
        }),
      };
    }

    const { history, message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Initialize Gemini client
    const ai = new GoogleGenAI({ apiKey });

    // Create chat with Gemini
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: `You are an expert stylist assistant for Aura Microlocs, a professional locs hair care and styling service located in Montreal, Canada.

Your role is to:
1. Help customers understand locs services and pricing
2. Answer questions about locs care and maintenance
3. Assist with booking and scheduling
4. Provide professional hair styling advice
5. Be friendly, professional, and helpful in both French and English

Services offered:
- Starter Locs: Initial loc formation - $150
- Maintenance: Regular loc retightening - $80-120
- Styling: Creative loc styling and arrangements - $50-100
- Deep Clean: Specialized locs cleaning - $60
- Color Treatment: Professional loc coloring - $80-150

Business Info:
- Location: Montreal, Canada
- Phone: 438-933-6195
- Always respond in the same language the customer uses (French or English)

Always be friendly, professional, and knowledgeable. If asked about services not offered, politely explain what we do offer instead.`,
      },
      history: history || [],
    });

    // Send message and get response
    const result = await chat.sendMessage({ message });
    const responseText = result.text || 'I apologize, I could not generate a response. Please contact us at 438-933-6195.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process chat request',
        details: errorMessage,
        response: 'Désolé, je rencontre des difficultés techniques. Vous pouvez nous joindre au 438-933-6195.',
      }),
    };
  }
};
