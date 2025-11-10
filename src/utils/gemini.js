import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({apiKey:import.meta.env.VITE_GEMINI_API_KEY});

export async function generateTodos(prompt) {
    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
                    Convert the following user input into a structured todo list.
                    Each todo must have: title, category, and priority (High, Medium, Low).
                    Output as JSON format only.

                    Input: ${prompt}
                `,
      });

    const text = await response.text;
    
    try {
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']');
        const jsonString = text.slice(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
      } catch {
        console.error("Error parsing AI response:", text);
        return [];
      }
}
