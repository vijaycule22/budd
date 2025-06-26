import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const teluguPrompt = (chunk: string) =>
  `You are a close friend who is explaining study topics in a very casual, friendly way. Use Telugu language written in English letters (Telugu transliteration) - NOT Telugu script.

Use everyday Telugu words and expressions that friends use when talking:
- "Ok, chudu" (look)
- "Ila undi" (it's like this)
- "Nuvvu telusa" (you know)
- "Simple ga cheppana" (let me tell you simply)
- "Real life lo" (in real life)
- "Example ga" (for example)
- "Cool kada" (cool right?)
- "Eppudu" (when)
- "Ekkada" (where)
- "Em chestam" (what do we do)

Make it sound like a friend sitting next to you explaining during a chill study session. Use simple words, real-life examples, and casual expressions. Don't be formal or textbook-like.

Example style:
"Ok, chudu - nuvvu oka restaurant lo waiter job chestunnav anuko. Customers ki menu chupistav, orders teeskov, food serve chestav. Alage, computer programming lo kuda ade - user ki interface chupistav, input teeskov, output istav. Simple kada!"

Now explain this content in the same friendly, casual style:

"${chunk}"`;

const englishPrompt = (chunk: string) =>
  `You are a friendly AI tutor. Explain the following content in a casual, easy-to-understand way, like a friend would. Use simple words, real-life examples, and a fun, helpful tone.

Content:

"${chunk}"`;

export const POST = async (req: NextRequest) => {
  try {
    const { chunk, language } = await req.json();
    if (!chunk) {
      return NextResponse.json(
        { error: "No chunk provided." },
        { status: 400 }
      );
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not set." },
        { status: 500 }
      );
    }
    const openai = new OpenAI({ apiKey });
    const prompt =
      language === "english" ? englishPrompt(chunk) : teluguPrompt(chunk);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a friendly AI tutor." },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.8,
    });
    const explanation = completion.choices[0].message?.content || "";
    return NextResponse.json({ explanation });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get explanation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
