import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = localStorage.getItem('gemini_api_key');

if (!API_KEY) {
  console.error("Gemini API Key is not found in local storage.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export const generatePromptsForImage = async (
  imageData: string,
  numberOfPrompts: number,
  category: string,
  additionalSentence: string
): Promise<string[]> => {
  if (!API_KEY) {
    return ["Error: Gemini API Key not found. Please set it first."];
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    let baseInstruction = `Analyze the provided image. Based on its contents, generate ${numberOfPrompts} detailed and creative prompts for an image generation AI.`;

    if (category !== 'general') {
      baseInstruction = `Strictly following the style of a "${category}", analyze the provided image. Based on this style, generate ${numberOfPrompts} detailed prompts for an image generation AI. Every single prompt must strongly reflect the "${category}" style.`;
    }
    
    if (additionalSentence && additionalSentence.trim() !== '') {
      baseInstruction += ` At the end of each generated prompt, you must add the following sentence: "${additionalSentence.trim()}"`;
    }

    const contents = [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData,
        },
      },
      {
        text: baseInstruction,
      },
    ];

    const result = await model.generateContent({ contents });
    const response = result.response;
    const text = response.text();
    
    const prompts = text.split('\n').filter(p => p.trim() !== '' && !p.startsWith('*')).map(p => p.replace(/^\d+\.\s*/, '').trim());

    return prompts.slice(0, numberOfPrompts);
  } catch (error) {
    console.error("Error generating prompts:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return ["Error: Your Gemini API Key is not valid. Please check and re-enter it."];
    }
    return ["An error occurred while generating prompts. Please check the console for details."];
  }
};