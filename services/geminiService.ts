import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiseaseAnalysis, Language } from "../types";

// Fix: The API key must be obtained exclusively from `process.env.API_KEY` as per the coding guidelines.
// This resolves the error on `import.meta.env` and aligns with the requirement
// that the API key's availability is handled externally.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isLeaf: {
      type: Type.BOOLEAN,
      description: "Whether the image contains a plant leaf.",
    },
    diseaseName: {
      type: Type.STRING,
      description: "The classification of the leaf. Should be one of: 'Healthy', 'Bacterial', 'Mosaic', or other specific diagnosis if unclear.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score between 0 and 1.",
    },
    description: {
      type: Type.STRING,
      description: "A brief description of the condition and visual symptoms.",
    },
    treatment: {
      type: Type.STRING,
      description: "Recommended treatment for the disease.",
    },
    preventativeMeasures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of preventative measures.",
    },
  },
  required: ["isLeaf"],
};

const getLanguageName = (code: Language): string => {
  switch (code) {
    case 'hi': return 'Hindi';
    case 'mr': return 'Marathi';
    case 'gu': return 'Gujarati';
    case 'en': 
    default: return 'English';
  }
};

export const analyzeLeafImage = async (base64Image: string, lang: Language = 'en'): Promise<DiseaseAnalysis> => {
  try {
    // Strip the data URL prefix to get raw base64 if present
    const base64Data = base64Image.split(',')[1] || base64Image;
    const languageName = getLanguageName(lang);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
          {
            text: `You are AgroMitra, a specialized Leaf Disease Detection Model trained on three specific classes: 
            1. Healthy
            2. Bacterial
            3. Mosaic
            
            Analyze this image.
            - If it is NOT a plant leaf, set "isLeaf" to false.
            - If it IS a leaf, classify it into one of the three classes above ('Healthy', 'Bacterial', 'Mosaic'). 
            - If the leaf shows clear signs of 'Bacterial' infection or 'Mosaic' virus, label it as such.
            - If it is healthy, label it 'Healthy'.
            - Provide a confidence score (0.0 to 1.0).
            
            CRITICAL INSTRUCTION FOR LANGUAGE:
            Provide the 'description', 'treatment', and 'preventativeMeasures' fields in ${languageName} language.
            Keep 'diseaseName' in English (e.g. 'Healthy', 'Bacterial', 'Mosaic') so the code can parse it, but ensure the descriptive text is in ${languageName}.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert plant pathologist. Your output must strictly follow the JSON schema.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini.");
    }

    const result = JSON.parse(text) as DiseaseAnalysis;
    return result;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};
