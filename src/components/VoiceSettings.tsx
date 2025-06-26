"use client";

import { useState, useEffect } from "react";

type Language = "telugu" | "hindi" | "tamil" | "kannada" | "english";

interface VoiceSettingsProps {
    language: Language;
    onVoiceChange: (voice: SpeechSynthesisVoice | null) => void;
    onRateChange: (rate: number) => void;
    onPitchChange: (pitch: number) => void;
    onVolumeChange: (volume: number) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export default function VoiceSettings({
    language,
    onVoiceChange,
    onRateChange,
    onPitchChange,
    onVolumeChange,
    isOpen,
    onToggle,
}: VoiceSettingsProps) {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [rate, setRate] = useState(0.9);
    const [pitch, setPitch] = useState(1.0);
    const [volume, setVolume] = useState(1.0);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Auto-select appropriate voice based on language
            if (language === "telugu" || language === "hindi" || language === "tamil" || language === "kannada") {
                // For Indian languages, try to find an Indian English voice
                const indianVoice = availableVoices.find(voice =>
                    voice.lang.includes('en-IN') ||
                    voice.name.toLowerCase().includes('indian') ||
                    voice.name.toLowerCase().includes('india') ||
                    voice.name.toLowerCase().includes('south asia')
                );
                if (indianVoice) {
                    setSelectedVoice(indianVoice);
                    onVoiceChange(indianVoice);
                }
            } else {
                const englishVoice = availableVoices.find(voice =>
                    voice.lang.includes('en-US') &&
                    voice.name.toLowerCase().includes('natural')
                ) || availableVoices.find(voice => voice.lang.includes('en-US'));
                if (englishVoice) {
                    setSelectedVoice(englishVoice);
                    onVoiceChange(englishVoice);
                }
            }
        };

        // Load voices immediately if available
        loadVoices();

        // Load voices when they become available
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [language, onVoiceChange]);

    const handleVoiceChange = (voiceName: string) => {
        const voice = voices.find(v => v.name === voiceName);
        setSelectedVoice(voice || null);
        onVoiceChange(voice || null);
    };

    const handleRateChange = (newRate: number) => {
        setRate(newRate);
        onRateChange(newRate);
    };

    const handlePitchChange = (newPitch: number) => {
        setPitch(newPitch);
        onPitchChange(newPitch);
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        onVolumeChange(newVolume);
    };

    const getTestPhrase = () => {
        switch (language) {
            case "telugu":
                return "Nenu test chestunnanu. Ila undi.";
            case "hindi":
                return "Main test kar raha hoon. Aisa hai.";
            case "tamil":
                return "Naan test pannuren. Ippadi irukku.";
            case "kannada":
                return "Nanu test maadutiddene. Hage ide.";
            case "english":
            default:
                return "This is a test of the voice settings.";
        }
    };

    const testVoice = () => {
        if (selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(getTestPhrase());
            utterance.voice = selectedVoice;
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = volume;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors flex items-center space-x-2"
            >
                <span className="text-lg">⚙️</span>
                <span className="text-sm font-medium">Voice Settings</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 w-96 z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Voice Settings</h3>
                        <button
                            onClick={onToggle}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Voice Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Voice Selection
                        </label>
                        <select
                            value={selectedVoice?.name || ""}
                            onChange={(e) => handleVoiceChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            {voices.map((voice) => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Speech Rate */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                                Speed
                            </label>
                            <span className="text-sm text-gray-500 font-mono">
                                {rate.toFixed(1)}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={rate}
                            onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Slow</span>
                            <span>Normal</span>
                            <span>Fast</span>
                        </div>
                    </div>

                    {/* Pitch */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                                Pitch
                            </label>
                            <span className="text-sm text-gray-500 font-mono">
                                {pitch.toFixed(1)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={pitch}
                            onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Low</span>
                            <span>Normal</span>
                            <span>High</span>
                        </div>
                    </div>

                    {/* Volume */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                                Volume
                            </label>
                            <span className="text-sm text-gray-500 font-mono">
                                {Math.round(volume * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Mute</span>
                            <span>Normal</span>
                            <span>Max</span>
                        </div>
                    </div>

                    {/* Test Button */}
                    <button
                        onClick={testVoice}
                        disabled={!selectedVoice}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        🎵 Test Voice Settings
                    </button>
                </div>
            )}
        </div>
    );
} 