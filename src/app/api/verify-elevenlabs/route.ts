import { NextResponse } from "next/server";
import axios from "axios";

export const GET = async () => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: "No API key found",
        message: "Please set ELEVENLABS_API_KEY in your .env.local file",
      });
    }

    console.log("Testing API key:", apiKey.substring(0, 20) + "...");

    // Test with a simple API call to get user info
    const response = await axios({
      method: "GET",
      url: "https://api.elevenlabs.io/v1/user",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    return NextResponse.json({
      success: true,
      message: "API key is valid!",
      user: response.data,
      keyPreview: apiKey.substring(0, 20) + "...",
    });
  } catch (error: unknown) {
    console.error("API verification failed:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);

      return NextResponse.json(
        {
          error: `API Error: ${error.response.status}`,
          details: error.response.data,
          message:
            error.response.status === 401
              ? "Invalid API key. Please check your ElevenLabs API key."
              : "API request failed. Check your account status and permissions.",
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      {
        error: "Network Error",
        message:
          "Could not connect to ElevenLabs API. Check your internet connection.",
      },
      { status: 500 }
    );
  }
};
