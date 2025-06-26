import { NextResponse } from "next/server";
import axios from "axios";

export const GET = async () => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    console.log("=== ElevenLabs API Key Test ===");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey ? apiKey.length : 0);
    console.log(
      "API Key starts with 'xi-api-':",
      apiKey ? apiKey.startsWith("xi-api-") : false
    );

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API key not found",
          message:
            "Please create a .env.local file with ELEVENLABS_API_KEY=your_key_here",
        },
        { status: 500 }
      );
    }

    // Test the API key by making a simple request to get user info
    const response = await axios({
      method: "GET",
      url: "https://api.elevenlabs.io/v1/user",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    return NextResponse.json({
      success: true,
      message: "API key is valid!",
      userInfo: response.data,
      apiKeyPreview: apiKey.substring(0, 10) + "...",
    });
  } catch (error: unknown) {
    console.error("ElevenLabs API test error:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });

      if (error.response?.status === 401) {
        return NextResponse.json(
          {
            error: "Authentication failed",
            message:
              "Your API key is invalid or expired. Please check your ElevenLabs account.",
            status: 401,
          },
          { status: 401 }
        );
      }

      if (error.response?.status === 403) {
        return NextResponse.json(
          {
            error: "Access forbidden",
            message: "Your API key doesn't have the required permissions.",
            status: 403,
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "API test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
