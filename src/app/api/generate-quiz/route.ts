import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const {
      text,
      language,
      questionCount = 10,
      difficulty = "medium",
    } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    const languagePrompts = {
      english: "Generate quiz questions in English",
      telugu: "Generate quiz questions in Telugu (తెలుగు)",
      hindi: "Generate quiz questions in Hindi (हिंदी)",
      tamil: "Generate quiz questions in Tamil (தமிழ்)",
      kannada: "Generate quiz questions in Kannada (ಕನ್ನಡ)",
    };

    const difficultyPrompts = {
      easy: "with easy difficulty level suitable for beginners",
      medium: "with medium difficulty level suitable for intermediate learners",
      hard: "with challenging difficulty level suitable for advanced learners",
    };

    const prompt = `Based on the following text content, generate ${questionCount} quiz questions. Each question should have 4 multiple choice options with one correct answer.

${
  languagePrompts[language as keyof typeof languagePrompts] ||
  languagePrompts.english
}
${
  difficultyPrompts[difficulty as keyof typeof difficultyPrompts] ||
  difficultyPrompts.medium
}

Text content:
${text}

Please format the response as a JSON array with the following structure:
[
  {
    "id": "unique_id",
    "question": "Clear and concise question",
    "options": [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is the correct answer",
    "category": "Topic category (e.g., Concepts, Definitions, Examples, etc.)"
  }
]

Make sure the questions:
- Are educational and informative
- Are based on the provided content
- Have clear and distinct answer options
- Include explanations for correct answers
- Are varied in topic coverage
- Match the specified difficulty level

The correctAnswer should be the index (0-3) of the correct option in the options array.

Return only the JSON array, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an educational content creator specializing in creating effective quiz questions for learning. Always respond with valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    let quizQuestions;
    try {
      quizQuestions = JSON.parse(response);
    } catch {
      console.error("Failed to parse OpenAI response:", response);
      throw new Error("Invalid response format from AI");
    }

    // Validate the structure
    if (!Array.isArray(quizQuestions)) {
      throw new Error("Invalid quiz format");
    }

    // Add unique IDs and validate structure
    quizQuestions = quizQuestions.map((question, index) => ({
      id: question.id || `quiz_${Date.now()}_${index}`,
      question: question.question,
      options: Array.isArray(question.options) ? question.options : [],
      correctAnswer:
        typeof question.correctAnswer === "number" ? question.correctAnswer : 0,
      explanation: question.explanation || "No explanation provided",
      category: question.category || "General",
    }));

    return NextResponse.json({
      questions: quizQuestions,
      count: quizQuestions.length,
      language,
      difficulty,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
