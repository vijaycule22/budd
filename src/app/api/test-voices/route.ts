import { NextResponse } from "next/server";
import axios from "axios";

interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

export const GET = async () => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not set." },
        { status: 500 }
      );
    }

    // Get available voices from ElevenLabs
    const response = await axios({
      method: "GET",
      url: "https://api.elevenlabs.io/v1/voices",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    const voices: Voice[] = response.data.voices;

    // Filter for Indian voices or voices that might be suitable
    const indianVoices = voices.filter(
      (voice: Voice) =>
        voice.name.toLowerCase().includes("indian") ||
        voice.name.toLowerCase().includes("varun") ||
        voice.name.toLowerCase().includes("monika") ||
        voice.name.toLowerCase().includes("india") ||
        voice.name.toLowerCase().includes("hindi") ||
        voice.name.toLowerCase().includes("telugu") ||
        voice.name.toLowerCase().includes("tamil") ||
        voice.name.toLowerCase().includes("kannada")
    );

    return NextResponse.json({
      allVoices: voices.map((v: Voice) => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
      })),
      indianVoices: indianVoices.map((v: Voice) => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
      })),
      totalVoices: voices.length,
    });
  } catch (error: unknown) {
    console.error("Error fetching voices:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch voices.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
