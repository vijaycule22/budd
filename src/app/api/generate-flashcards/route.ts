import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, language, count = 5 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    const languagePrompts = {
      english: "Generate flashcards in English",
      telugu: "Generate flashcards in Telugu (తెలుగు)",
      hindi: "Generate flashcards in Hindi (हिंदी)",
      tamil: "Generate flashcards in Tamil (தமிழ்)",
      kannada: "Generate flashcards in Kannada (ಕನ್ನಡ)",
    };

    const prompt = `Based on the following text content, generate ${count} educational flashcards. Each flashcard should have a clear question on the front and a comprehensive answer on the back.

${
  languagePrompts[language as keyof typeof languagePrompts] ||
  languagePrompts.english
}

Text content:
${text}

Please format the response as a JSON array with the following structure:
[
  {
    "id": "unique_id",
    "question": "Clear and concise question",
    "answer": "Detailed and educational answer",
    "category": "Topic category (e.g., Concepts, Definitions, Examples, etc.)"
  }
]

Make sure the questions and answers are:
- Educational and informative
- Based on the provided content
- Clear and easy to understand
- Suitable for study purposes
- Varied in difficulty level

Return only the JSON array, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an educational content creator specializing in creating effective flashcards for learning. Always respond with valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    let flashcards;
    try {
      flashcards = JSON.parse(response);
    } catch {
      console.error("Failed to parse OpenAI response:", response);
      throw new Error("Invalid response format from AI");
    }

    // Validate the structure
    if (!Array.isArray(flashcards)) {
      throw new Error("Invalid flashcards format");
    }

    // Add unique IDs if not present
    flashcards = flashcards.map((card, index) => ({
      id: card.id || `flashcard_${Date.now()}_${index}`,
      question: card.question,
      answer: card.answer,
      category: card.category || "General",
    }));

    return NextResponse.json({
      flashcards,
      count: flashcards.length,
      language,
    });
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
