import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export const POST = async (req: NextRequest) => {
  try {
    // Parse the form and get the PDF buffer
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Extract text from PDF
    const data = await pdfParse(buffer);
    const text = data.text;
    // Chunking: split by double newlines (paragraphs)
    const chunks = text
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    return NextResponse.json({ chunks });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to process PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
