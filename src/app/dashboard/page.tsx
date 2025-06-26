"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import PDFUpload from "@/components/PDFUpload";
import LanguageToggle from "@/components/LanguageToggle";
import VoiceSettings from "@/components/VoiceSettings";
import ElevenLabsVoiceSettings from "@/components/ElevenLabsVoiceSettings";

export type Language = "telugu" | "hindi" | "tamil" | "kannada" | "english";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [summary, setSummary] = useState<string>("");
    const [plainTextSummary, setPlainTextSummary] = useState<string>("");
    const [language, setLanguage] = useState<Language>("telugu");
    const [isUploading, setIsUploading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechProgress, setSpeechProgress] = useState(0);
    const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);
    const [elevenLabsSettingsOpen, setElevenLabsSettingsOpen] = useState(false);
    const [isBrowser, setIsBrowser] = useState(false);
    const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'result'>('upload');

    // Voice settings state
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [speechRate, setSpeechRate] = useState(0.9);
    const [speechPitch, setSpeechPitch] = useState(1.0);
    const [speechVolume, setSpeechVolume] = useState(1.0);

    // ElevenLabs state
    const [useElevenLabs, setUseElevenLabs] = useState(false);
    const [selectedElevenLabsVoice, setSelectedElevenLabsVoice] = useState<string>("");
    const [isGeneratingElevenLabs, setIsGeneratingElevenLabs] = useState(false);

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Check authentication
    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/auth/signin");
        }
    }, [session, status, router]);

    // Initialize browser environment
    useEffect(() => {
        setIsBrowser(true);
        if (typeof window !== 'undefined') {
            setSpeechSynthesis(window.speechSynthesis);
        }
    }, []);

    const handlePDFUpload = async (file: File) => {
        setIsUploading(true);
        setCurrentStep('processing');
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload PDF");
            }

            const data = await response.json();
            console.log("PDF upload response:", data);

            // Combine all chunks into one text for summary
            const fullText = data.chunks.join("\n\n");
            console.log("Generating summary for text length:", fullText.length);

            // Generate summary automatically
            await generateSummary(fullText);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload PDF. Please try again.");
            setCurrentStep('upload');
        } finally {
            setIsUploading(false);
        }
    };

    const generateSummary = async (text: string) => {
        try {
            const response = await fetch("/api/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: text,
                    language,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate summary");
            }

            const data = await response.json();
            console.log("Summary response:", data);
            setSummary(data.summary);
            setPlainTextSummary(data.plainText);
            setCurrentStep('result');
        } catch (error) {
            console.error("Summary generation error:", error);
            alert("Failed to generate summary. Please try again.");
            setCurrentStep('upload');
        }
    };

    const speakText = async (text: string) => {
        // Use plain text version for voice synthesis
        const textToSpeak = plainTextSummary || text;
        if (useElevenLabs) {
            await speakWithElevenLabs(textToSpeak);
        } else {
            speakWithBrowserTTS(textToSpeak);
        }
    };

    const speakWithElevenLabs = async (text: string) => {
        console.log("Speaking with ElevenLabs:", text);
        setIsGeneratingElevenLabs(true);
        try {
            const response = await fetch("/api/elevenlabs-tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: text,
                    voiceId: selectedElevenLabsVoice,
                    language,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate ElevenLabs speech");
            }

            const data = await response.json();

            // Convert base64 to audio blob and play
            const audioBlob = new Blob(
                [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
                { type: 'audio/mpeg' }
            );

            const audioUrl = URL.createObjectURL(audioBlob);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
                setIsSpeaking(true);

                audioRef.current.onended = () => {
                    setIsSpeaking(false);
                    setSpeechProgress(100);
                };

                audioRef.current.onerror = () => {
                    setIsSpeaking(false);
                    setSpeechProgress(0);
                };
            }
        } catch (error) {
            console.error("ElevenLabs TTS error:", error);
            alert("Failed to generate speech with ElevenLabs. Please try again.");
        } finally {
            setIsGeneratingElevenLabs(false);
        }
    };

    const speakWithBrowserTTS = (text: string) => {
        if (!speechSynthesis) return;

        // Stop any existing speech
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Use selected voice or auto-select based on language
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            const voices = speechSynthesis.getVoices();
            if (language === "telugu" || language === "hindi" || language === "tamil" || language === "kannada") {
                // For Indian languages, try to find an Indian English voice
                const indianVoice = voices.find(voice =>
                    voice.lang.includes('en-IN') ||
                    voice.name.toLowerCase().includes('indian') ||
                    voice.name.toLowerCase().includes('india') ||
                    voice.name.toLowerCase().includes('south asia')
                );
                if (indianVoice) {
                    utterance.voice = indianVoice;
                }
            } else {
                const englishVoice = voices.find(voice =>
                    voice.lang.includes('en-US') &&
                    voice.name.toLowerCase().includes('natural')
                ) || voices.find(voice => voice.lang.includes('en-US'));
                if (englishVoice) {
                    utterance.voice = englishVoice;
                }
            }
        }

        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        utterance.volume = speechVolume;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setSpeechProgress(0);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setSpeechProgress(100);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setSpeechProgress(0);
        };

        speechRef.current = utterance;
        speechSynthesis.speak(utterance);
    };

    const pauseSpeech = () => {
        if (useElevenLabs) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        } else {
            if (speechSynthesis?.speaking) {
                speechSynthesis.pause();
            }
        }
    };

    const resumeSpeech = () => {
        if (useElevenLabs) {
            if (audioRef.current) {
                audioRef.current.play();
            }
        } else {
            if (speechSynthesis?.paused) {
                speechSynthesis.resume();
            }
        }
    };

    const stopSpeech = () => {
        if (useElevenLabs) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        } else {
            if (speechSynthesis) {
                speechSynthesis.cancel();
            }
        }
        setIsSpeaking(false);
        setSpeechProgress(0);
        speechRef.current = null;
    };

    const resetApp = () => {
        setSummary("");
        setPlainTextSummary("");
        setCurrentStep('upload');
        stopSpeech();
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">AI</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    StudyBuddy AI
                                </h1>
                                <p className="text-sm text-gray-500">Welcome back, {session.user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>User Dashboard</span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-600' : currentStep === 'processing' ? 'text-blue-600' : 'text-green-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'upload' ? 'bg-blue-600 text-white' :
                                        currentStep === 'processing' ? 'bg-blue-600 text-white' :
                                            'bg-green-600 text-white'
                                    }`}>
                                    1
                                </div>
                                <span className="font-medium">Upload</span>
                            </div>
                            <div className={`w-16 h-0.5 ${currentStep === 'processing' || currentStep === 'result' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center space-x-2 ${currentStep === 'processing' ? 'text-blue-600' : currentStep === 'result' ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'processing' ? 'bg-blue-600 text-white' :
                                        currentStep === 'result' ? 'bg-green-600 text-white' :
                                            'bg-gray-300 text-gray-500'
                                    }`}>
                                    2
                                </div>
                                <span className="font-medium">Processing</span>
                            </div>
                            <div className={`w-16 h-0.5 ${currentStep === 'result' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center space-x-2 ${currentStep === 'result' ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'result' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
                                    }`}>
                                    3
                                </div>
                                <span className="font-medium">Result</span>
                            </div>
                        </div>
                    </div>

                    {/* Upload Section */}
                    {currentStep === 'upload' && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Transform Your Study Material
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Upload your PDF documents and let our AI create personalized,
                                    easy-to-understand explanations with natural voice narration.
                                </p>
                            </div>

                            <PDFUpload onUpload={handlePDFUpload} isUploading={isUploading} />

                            <div className="mt-8 grid md:grid-cols-2 gap-6">
                                <LanguageToggle language={language} onLanguageChange={setLanguage} />

                                {/* Voice Type Selection */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Engine</h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setUseElevenLabs(false)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all ${!useElevenLabs
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-xl">🗣️</span>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium">Browser TTS</div>
                                                    <div className="text-sm text-gray-500">Fast & Free</div>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setUseElevenLabs(true)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all ${useElevenLabs
                                                    ? "border-purple-500 bg-purple-50 text-purple-700"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-xl">🎙️</span>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium">ElevenLabs AI</div>
                                                    <div className="text-sm text-gray-500">Premium Quality</div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Processing Section */}
                    {currentStep === 'processing' && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Processing Your Document
                                </h3>
                                <p className="text-lg text-gray-600 mb-8">
                                    Our AI is analyzing your content and creating a personalized explanation...
                                </p>

                                <div className="max-w-md mx-auto">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">Extracting text from PDF</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            </div>
                                            <span className="text-gray-700">Generating AI explanation</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                            <span className="text-gray-500">Preparing voice narration</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Result Section */}
                    {currentStep === 'result' && summary && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Result Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🤗</span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                Your Study Buddy&apos;s Explanation
                                            </h2>
                                            <p className="text-blue-100">
                                                Personalized for {language.charAt(0).toUpperCase() + language.slice(1)} speakers
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        {!isSpeaking && !isGeneratingElevenLabs ? (
                                            <button
                                                onClick={() => speakText(summary)}
                                                disabled={!isBrowser || (!speechSynthesis && !useElevenLabs)}
                                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="text-xl">🔊</span>
                                                <span>Listen</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={useElevenLabs ? (audioRef.current?.paused ? resumeSpeech : pauseSpeech) : (speechSynthesis?.paused ? resumeSpeech : pauseSpeech)}
                                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-colors"
                                                >
                                                    <span className="text-xl">
                                                        {useElevenLabs ? (audioRef.current?.paused ? "▶️" : "⏸️") : (speechSynthesis?.paused ? "▶️" : "⏸️")}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={stopSpeech}
                                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-colors"
                                                >
                                                    <span className="text-xl">⏹️</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Voice Settings */}
                                        {!useElevenLabs && isBrowser && speechSynthesis && (
                                            <VoiceSettings
                                                language={language}
                                                onVoiceChange={setSelectedVoice}
                                                onRateChange={setSpeechRate}
                                                onPitchChange={setSpeechPitch}
                                                onVolumeChange={setSpeechVolume}
                                                isOpen={voiceSettingsOpen}
                                                onToggle={() => setVoiceSettingsOpen(!voiceSettingsOpen)}
                                            />
                                        )}

                                        {/* ElevenLabs Voice Settings */}
                                        {useElevenLabs && (
                                            <ElevenLabsVoiceSettings
                                                language={language}
                                                onVoiceChange={setSelectedElevenLabsVoice}
                                                isOpen={elevenLabsSettingsOpen}
                                                onToggle={() => setElevenLabsSettingsOpen(!elevenLabsSettingsOpen)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Speech Progress Bar */}
                            {(isSpeaking || isGeneratingElevenLabs) && (
                                <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${speechProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium">
                                            {isGeneratingElevenLabs ? "Generating AI voice..." : `${Math.round(speechProgress)}%`}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-8">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                                    <div className="text-gray-800 leading-relaxed prose prose-lg max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                h3: ({ children }) => (
                                                    <h3 className="text-xl font-bold text-blue-900 mb-4 mt-6 first:mt-0">
                                                        {children}
                                                    </h3>
                                                ),
                                                strong: ({ children }) => (
                                                    <strong className="font-bold text-blue-800">
                                                        {children}
                                                    </strong>
                                                ),
                                                em: ({ children }) => (
                                                    <em className="italic text-purple-700">
                                                        {children}
                                                    </em>
                                                ),
                                                ul: ({ children }) => (
                                                    <ul className="list-disc list-inside space-y-2 my-4">
                                                        {children}
                                                    </ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="list-decimal list-inside space-y-2 my-4">
                                                        {children}
                                                    </ol>
                                                ),
                                                li: ({ children }) => (
                                                    <li className="text-gray-700">
                                                        {children}
                                                    </li>
                                                ),
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg">
                                                        <div className="text-blue-800 font-medium">
                                                            {children}
                                                        </div>
                                                    </blockquote>
                                                ),
                                                p: ({ children }) => (
                                                    <p className="mb-4 text-gray-800">
                                                        {children}
                                                    </p>
                                                ),
                                            }}
                                        >
                                            {summary}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={resetApp}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        📄 Upload Another Document
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hidden audio element for ElevenLabs */}
                    <audio ref={audioRef} style={{ display: 'none' }} />
                </div>
            </main>
        </div>
    );
} 