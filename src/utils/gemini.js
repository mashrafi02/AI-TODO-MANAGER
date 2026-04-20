import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({apiKey:import.meta.env.VITE_GEMINI_API_KEY});

export async function generateTodos(prompt) {
    let response;
    try {
        response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
You are a smart task extraction assistant. Your job is to analyze user input and convert it into a structured todo list.

**Rules:**
1. If the input describes tasks, goals, plans, activities, or anything actionable — extract todos from it.
2. Each todo must be a JSON object with these fields:
   - "title": A clear, concise, actionable task description.
   - "category": A relevant category (e.g., Work, Personal, Health, Shopping, Finance, Education, Fitness, Household, etc.).
   - "priority": One of "High", "Medium", or "Low" — inferred from urgency, deadlines, or importance cues in the input.
3. Break down vague or broad inputs into specific, actionable sub-tasks when possible.
4. If the input is NOT suitable for generating todos (e.g., random text, questions, greetings, jokes, gibberish, or unrelated content), respond with exactly: {"error": "This input doesn't contain actionable tasks. Please describe what you need to get done."}

**Output format:**
- For valid input: a JSON array of todo objects. Example: [{"title": "Buy groceries", "category": "Shopping", "priority": "Medium"}]
- For invalid input: a JSON error object as described above.
- Output raw JSON only. No markdown, no explanation, no wrapping.

Input: ${prompt}
                `,
          });
    } catch (err) {
        console.error("Gemini API error:", err);
        return { error: "AI service is temporarily unavailable. Please try again in a moment." };
    }

    const text = await response.text;
    
    try {
        const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();

        if (cleaned.startsWith('{')) {
            const parsed = JSON.parse(cleaned);
            if (parsed.error) {
                return { error: parsed.error };
            }
        }

        const jsonStart = cleaned.indexOf('[');
        const jsonEnd = cleaned.lastIndexOf(']');
        const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
      } catch {
        console.error("Error parsing AI response:", text);
        return [];
      }
}
