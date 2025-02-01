import { NextApiRequest, NextApiResponse } from "next";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { pdfUrl } = req.body;

    if (!pdfUrl) {
      return res.status(400).json({ message: "PDF URL is required" });
    }

    // Fetch the PDF file from the URL
    const response = await fetch(pdfUrl);
    const pdfBuffer = await response.arrayBuffer();

    // Parse the PDF
    const data = await pdfParse(Buffer.from(pdfBuffer));

    // Return the extracted text
    res.status(200).json({ text: data.text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).json({ message: "Failed to parse PDF" });
  }
}