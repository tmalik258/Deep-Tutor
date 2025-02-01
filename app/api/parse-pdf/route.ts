import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(request: Request) {
  try {
    const { pdfUrl } = await request.json();

    if (!pdfUrl) {
      return NextResponse.json(
        { message: "PDF URL is required" },
        { status: 400 }
      );
    }

    // Fetch the PDF file from the URL
    const response = await fetch(pdfUrl);
    const pdfBuffer = await response.arrayBuffer();

    // Parse the PDF
    const data = await pdfParse(Buffer.from(pdfBuffer));

    // Return the extracted text
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { message: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
