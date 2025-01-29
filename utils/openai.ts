import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const base64Audio = await blobToBase64(audioBlob);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ inlineData: { mimeType: "audio/wav", data: base64Audio } }],
        },
      ],
    });

    // Ensure we call `text()` correctly
    const transcription = await response.response.text();

    if (!transcription.trim())
      throw new Error("No transcription received from Gemini API.");

    return transcription.trim();
  } catch (error) {
    console.error("Error during Gemini audio transcription:", error);
    throw new Error("Failed to transcribe audio using Gemini API.");
  }
}

// Convert Blob to Base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1]; // Remove metadata
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
}
