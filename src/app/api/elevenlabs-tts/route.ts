import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Voice IDs for the specific Indian voices
const VOICE_IDS = {
  "varun-r": "ZnctpSuzUbwVNbRu45m0", // Varun R voice ID
  "monika-sogam": "2zRM7PkgwBPiau2jvVXc", // Monika Sogam voice ID
};

export const POST = async (req: NextRequest) => {
  try {
    const { text, voiceId, language } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    // Enhanced debugging for API key
    console.log("=== ElevenLabs API Debug ===");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey ? apiKey.length : 0);
    console.log(
      "API Key starts with 'xi-api-':",
      apiKey ? apiKey.startsWith("xi-api-") : false
    );
    console.log(
      "API Key (first 10 chars):",
      apiKey ? apiKey.substring(0, 10) + "..." : "NOT SET"
    );

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ElevenLabs API key not set. Please check your .env.local file.",
        },
        { status: 500 }
      );
    }

    // Determine which voice to use based on language preference
    let selectedVoiceId = voiceId;
    if (!selectedVoiceId) {
      // Auto-select voice based on language
      if (
        language === "hindi" ||
        language === "telugu" ||
        language === "tamil" ||
        language === "kannada"
      ) {
        // Use Varun R for Indian languages (male voice)
        selectedVoiceId = VOICE_IDS["varun-r"];
      } else {
        // Use Monika Sogam for English (female voice)
        selectedVoiceId = VOICE_IDS["monika-sogam"];
      }
    }

    console.log("Using voice ID:", selectedVoiceId);
    console.log("Text length:", text.length);
    console.log("API Key (first 10 chars):", apiKey.substring(0, 10) + "...");

    // Prepare request payload
    const requestPayload = {
      text: text,
      model_id: "eleven_turbo_v3_alpha", // Updated to v3 alpha model
      voice_settings: {
        stability: 0.5, // Balanced stability
        similarity_boost: 0.75, // Good voice similarity
        style: 0.0, // Neutral style
        use_speaker_boost: true, // Enhanced speaker clarity
      },
    };

    console.log("Request payload:", JSON.stringify(requestPayload, null, 2));

    // Make request to ElevenLabs API using axios
    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer", // Get audio as buffer
      data: {
        text: text, // Use the original text parameter
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      },
    });

    // Convert audio buffer to base64
    const audioBase64 = Buffer.from(response.data).toString("base64");

    return NextResponse.json({
      audio: audioBase64,
      voiceId: selectedVoiceId,
      model_id: "eleven_monolingual_v1", // Using a model available in free tier
    });
  } catch (error: unknown) {
    console.error("ElevenLabs TTS error:", error);

    // Better error handling
    if (axios.isAxiosError(error)) {
      console.error("=== Detailed Axios Error ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Response Data:", error.response?.data);
      console.error("Request URL:", error.config?.url);
      console.error("Request Method:", error.config?.method);
      console.error("Request Headers:", {
        ...error.config?.headers,
        "xi-api-key": error.config?.headers?.["xi-api-key"]
          ? error.config.headers["xi-api-key"].substring(0, 15) + "..."
          : "NOT SET",
      });
      console.error("Request Data:", error.config?.data);
      console.error("=== End Error Details ===");

      if (error.response?.status === 401) {
        return NextResponse.json(
          {
            error: "Authentication failed (401)",
            details: error.response?.data,
            message:
              "Your ElevenLabs API key is invalid or expired. Please check your API key in the ElevenLabs dashboard.",
          },
          { status: 401 }
        );
      }

      if (error.response?.status === 403) {
        return NextResponse.json(
          {
            error: "Access forbidden (403)",
            details: error.response?.data,
            message:
              "Your API key doesn't have sufficient permissions or you've exceeded your usage limits.",
          },
          { status: 403 }
        );
      }

      if (error.response?.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limited (429)",
            details: error.response?.data,
            message:
              "You've exceeded your API rate limits. Please try again later.",
          },
          { status: 429 }
        );
      }
    }

    const message =
      error instanceof Error ? error.message : "Failed to generate speech.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
