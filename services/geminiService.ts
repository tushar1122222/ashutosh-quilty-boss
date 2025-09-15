
import { GoogleGenAI, Type } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // The result is a data URL: "data:image/png;base64,iVBORw0KGgo..."
            // We only need the base64 part.
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};


export const generatePromptsFromImage = async (imageFile: File, count: number, apiKey: string): Promise<string[]> => {
    if (!apiKey) {
        throw new Error("API key not provided.");
    }
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const base64Data = await fileToBase64(imageFile);

    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: base64Data,
        },
    };

    const textPart = {
        text: `You are a highly creative prompt generation assistant. Your task is to analyze the provided image and generate exactly ${count} distinct, long, and highly descriptive text-to-image prompts. Each prompt must be a detailed paragraph, exploring different artistic styles, moods, lighting conditions, and narrative possibilities inspired by the image. Focus on sensory details, emotional tone, and imaginative interpretations. Ensure the prompts are detailed and extensive.`,
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            prompts: {
                type: Type.ARRAY,
                description: `An array of exactly ${count} long, detailed, and descriptive text-to-image prompts.`,
                items: {
                    type: Type.STRING,
                    description: "A single, highly detailed text-to-image prompt."
                }
            }
        },
        required: ["prompts"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.8,
                topP: 0.95,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && Array.isArray(result.prompts)) {
            return result.prompts;
        } else {
            throw new Error("Invalid response format from API. Expected a JSON object with a 'prompts' array.");
        }

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate prompts. The model may be unable to process the request. Please try a different image or reduce the prompt count.");
    }
};
