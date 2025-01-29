import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

// Correct initialization: Pass the API key directly as a string
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format. Expected messages array." },
        { status: 400 }
      );
    }

    // Extract the latest user message
    const userMessage = messages.find((msg) => msg.role === "user")?.content;

    if (!userMessage) {
      return NextResponse.json(
        { error: "No user message found in the request body." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Pass the user message to Gemini
    const result = await model.generateContent(userMessage);

    const output = result.response.text(); // Extract the generated text

    return NextResponse.json({ response: output });
  } catch (error) {
   let errorMessage = "An unknown error occurred";
   if (error instanceof Error) {
     errorMessage = error.message;
   }
   console.error("Error in Gemini API:", errorMessage);
    return NextResponse.json(
      { error: "Failed to process the Gemini API request." },
      { status: 500 }
    );
  }
}