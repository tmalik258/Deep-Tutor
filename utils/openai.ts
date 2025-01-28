import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI({
  apiKey,
});

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert the audioBlob to base64 since Gemini API likely accepts text-based inputs
    const base64Audio = await blobToBase64(audioBlob);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent(`Transcribe this audio: ${base64Audio}`);
    const transcription = response.response.text;

    return transcription;
  } catch (error) {
    console.error("Error during Gemini audio transcription:", error);
    throw new Error("Failed to transcribe audio using Gemini API.");
  }
}

// Utility function to convert Blob to Base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
}
