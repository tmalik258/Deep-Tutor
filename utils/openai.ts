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

    // Use a model that supports audio inputs
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            // Add text prompt
            {
              text: "Transcribe the following audio into text. Focus on accuracy and include all verbal elements:",
            },
            // Include audio data
            { inlineData: { mimeType: "audio/wav", data: base64Audio } },
          ],
        },
      ],
    });

    const transcription = await response.response.text();
    return transcription.trim();
  } catch (error) {
    console.error("Error during transcription:", error);
    throw new Error("Transcription failed. Please try again.");
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
