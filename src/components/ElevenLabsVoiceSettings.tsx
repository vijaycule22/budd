"use client";

import React from "react";

type Language = "telugu" | "hindi" | "tamil" | "kannada" | "english";

interface ElevenLabsVoiceSettingsProps {
    language: Language;
    onVoiceChange: (voiceId: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const VOICES = [
    {
        id: "varun-r",
        name: "Varun R",
        description: "Indian male voice - perfect for Hindi, Telugu, Tamil, Kannada",
        language: "indian",
        avatar: "👨‍💼",
        accent: "Indian English",
    },
    {
        id: "monika-sogam",
        name: "Monika Sogam",
        description: "Indian female voice - great for English and Indian languages",
        language: "indian",
        avatar: "👩‍💼",
        accent: "Indian English",
    },
];

export default function ElevenLabsVoiceSettings({
    language,
    onVoiceChange,
    isOpen,
    onToggle,
}: ElevenLabsVoiceSettingsProps) {
    const handleVoiceSelect = (voiceId: string) => {
        onVoiceChange(voiceId);
    };

    const getRecommendedVoice = () => {
        if (language === "hindi" || language === "telugu" || language === "tamil" || language === "kannada") {
            return "varun-r";
        } else {
            return "monika-sogam";
        }
    };

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors flex items-center space-x-2"
            >
                <span className="text-lg">🎙️</span>
                <span className="text-sm font-medium">AI Voices</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 w-96 z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">ElevenLabs AI Voices</h3>
                        <button
                            onClick={onToggle}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                        Choose between high-quality AI voices powered by ElevenLabs v3 Alpha
                    </p>

                    <div className="space-y-4">
                        {VOICES.map((voice) => (
                            <div
                                key={voice.id}
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${getRecommendedVoice() === voice.id
                                        ? "border-purple-500 bg-purple-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                onClick={() => handleVoiceSelect(voice.id)}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-3xl">{voice.avatar}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">{voice.name}</h4>
                                            {getRecommendedVoice() === voice.id && (
                                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                                                    Recommended
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{voice.description}</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {voice.accent}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                v3 Alpha
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                        <div className="flex items-start space-x-3">
                            <div className="text-blue-600 text-lg">ℹ️</div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">ElevenLabs v3 Alpha</h4>
                                <p className="text-xs text-blue-700">
                                    High-quality voice synthesis with enhanced speaker boost and natural intonation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 