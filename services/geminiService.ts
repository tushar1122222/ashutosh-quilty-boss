import { GoogleGenerativeAI } from "@google/generative-ai";

// This function initializes the GenAI client. It's designed to be called
// after the API key is confirmed to be available in localStorage.
const getGenAIClient = () => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    // This case should ideally be handled before calling this function,
    // but as a fallback, we prevent initialization.
    console.error("Gemini API Key is not available.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export const generatePromptsForImage = async (
  imageData: string,
  numberOfPrompts: number,
  category: string,
  additionalSentence: string
): Promise<string[]> => {
  const genAI = getGenAIClient();
  
  if (!genAI) {
    return ["Error: Gemini API Key not found. Please set it on the main page."];
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    let baseInstruction = `Analyze the provided image. Based on its contents, generate ${numberOfPrompts} detailed and creative prompts for an image generation AI.`;

    if (category && category !== 'general') {
      baseInstruction = `Strictly following the style of a "${category}", analyze the provided image. Based on this style, generate ${numberOfPrompts} detailed prompts for an image generation AI. Every single prompt must strongly reflect the "${category}" style.`;
    }
    
    if (additionalSentence && additionalSentence.trim() !== '') {
      baseInstruction += ` At the end of each generated prompt, you must add the following sentence: "${additionalSentence.trim()}"`;
    }

    const contents = [