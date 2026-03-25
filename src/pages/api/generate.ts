export const prerender = false;

import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const POST: APIRoute = async () => {
  const apiKey = import.meta.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a creative Pokémon designer. Invent one completely original Pokémon that does not exist in any game, anime, or media. Respond ONLY with valid JSON (no markdown, no code fences) in this exact format:
{
  "name": "OriginalName",
  "types": ["type1", "type2"],
  "description": "A 2-3 sentence description of this Pokémon's appearance and behavior.",
  "abilities": ["ability1", "ability2"],
  "stats": {
    "hp": 0,
    "attack": 0,
    "defense": 0,
    "special_attack": 0,
    "special_defense": 0,
    "speed": 0
  },
  "height": 0.0,
  "weight": 0.0,
  "category": "The ___ Pokémon",
  "lore": "A sentence about where this Pokémon lives or its origin story."
}
Use only official Pokémon types. Make stats realistic (base stats between 20-255). Height in meters, weight in kg. Be creative and original.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse the JSON from the response
    const pokemon = JSON.parse(text);

    return new Response(JSON.stringify(pokemon), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to generate Pokémon', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
