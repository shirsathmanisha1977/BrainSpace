import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using the environment variable exposed by Vite setup
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function categorizeContent(input: { type: 'link' | 'image' | 'screenshot', content: string }): Promise<{ category: string, title?: string, summary?: string }> {
  try {
    let prompt = "";
    let systemInstruction = "You are a content classifier for an organization app. The categories are: Food, Technology, Education, Travel, Shopping, Others. Your response MUST be valid JSON only, without markdown wrapping. Format: {\"category\": \"One of the specific categories\", \"title\": \"Short descriptive title\", \"summary\": \"1-2 sentence summary\"}";
    
    // For images, if content is base64 string, we would need to pass it properly.
    // In our simplified version, base64 content should be passed to Gemini API.
    let response;
    
    if (input.type === 'link') {
      prompt = `Analyze this link/URL: ${input.content}`;
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction, responseMimeType: "application/json" }
      });
    } else {
      // It's base64 image data. Format: data:image/png;base64,...
      const base64Data = input.content.split(',')[1];
      const mimeType = input.content.split(';')[0].split(':')[1];
      
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: "Analyze this image and categorize it." }
        ],
        config: { systemInstruction, responseMimeType: "application/json" }
      });
    }

    if (response && response.text) {
      const parsed = JSON.parse(response.text);
      return {
        category: parsed.category || 'Others',
        title: parsed.title || 'Untitled',
        summary: parsed.summary || ''
      };
    }
  } catch (err) {
    console.error("Gemini API error:", err);
  }
  
  return { category: 'Others', title: 'Untitled Item', summary: 'Could not analyze content.' };
}
