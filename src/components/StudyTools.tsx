"use client";

import Link from "next/link";

interface StudyToolsProps {
    onGenerateFlashcards: () => void;
    onGenerateQuiz: () => void;
    isGeneratingFlashcards: boolean;
    isGeneratingQuiz: boolean;
}

export default function StudyTools({
    onGenerateFlashcards,
    onGenerateQuiz,
    isGeneratingFlashcards,
    isGeneratingQuiz,
}: StudyToolsProps) {
    return (
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">
                🎓 Study Tools
            </h3>
            <p className="text-purple-700 text-center mb-8">
                Generate interactive study materials from your document to enhance your learning experience.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Flashcards */}
                <div className="bg-white rounded-xl p-6 border border-purple-200">
                    <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">📚</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Flashcards</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Create interactive flashcards for effective memorization
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onGenerateFlashcards}
                            disabled={isGeneratingFlashcards}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            {isGeneratingFlashcards ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <span>🔧</span>
                                    <span>Generate Flashcards</span>
                                </>
                            )}
                        </button>

                        <Link
                            href="/flashcards"
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <span>👀</span>
                            <span>View Flashcards</span>
                        </Link>
                    </div>
                </div>

                {/* Quiz */}
                <div className="bg-white rounded-xl p-6 border border-purple-200">
                    <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">🧠</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Quiz</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Test your knowledge with interactive quizzes
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onGenerateQuiz}
                            disabled={isGeneratingQuiz}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            {isGeneratingQuiz ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <span>🔧</span>
                                    <span>Generate Quiz</span>
                                </>
                            )}
                        </button>

                        <Link
                            href="/quiz"
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <span>👀</span>
                            <span>Take Quiz</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 