import { NextRequest, NextResponse } from "next/server";
import PdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const { pdfUrl } = await req.json();
    console.log("Fetching PDF from:", pdfUrl);

    const response = await fetch(pdfUrl, {
      headers: { "User-Agent": "Next.js Server" }, // Mimic a browser-like request
    });

    // Log response details
    console.log("Fetch response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetch failed: ${response.status} - ${errorText}`);
    }

    const pdfBuffer = await response.arrayBuffer();
    const data = await PdfParse(Buffer.from(pdfBuffer));

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Full error:", error); // Log the entire error object
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}