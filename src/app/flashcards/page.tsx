"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Flashcard {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export default function FlashcardsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);

    // Check authentication
    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/auth/signin");
        }
    }, [session, status, router]);

    // Load flashcards from localStorage or API
    useEffect(() => {
        const savedFlashcards = localStorage.getItem('studybuddy_flashcards');
        if (savedFlashcards) {
            try {
                const parsed = JSON.parse(savedFlashcards);
                setFlashcards(parsed);

                // Extract unique categories
                const uniqueCategories = [...new Set(parsed.map((card: Flashcard) => card.category))] as string[];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Failed to parse saved flashcards:', error);
            }
        }
    }, []);

    const filteredFlashcards = selectedCategory === 'all'
        ? flashcards
        : flashcards.filter(card => card.category === selectedCategory);

    const handleCardFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const nextCard = () => {
        if (currentCardIndex < filteredFlashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const previousCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };

    const shuffleCards = () => {
        const shuffled = [...filteredFlashcards].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    const resetCards = () => {
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600">Loading flashcards...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    if (flashcards.length === 0) {
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
                                    <p className="text-sm text-gray-500">Flashcards</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Back to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Empty State */}
                <main className="container mx-auto px-6 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📚</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            No Flashcards Available
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Generate flashcards from your uploaded documents to start studying.
                        </p>
                        <Link
                            href="/dashboard"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Upload Document & Generate Flashcards
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const currentCard = filteredFlashcards[currentCardIndex];

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
                                <p className="text-sm text-gray-500">Flashcards</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Category Filter */}
                    {categories.length > 1 && (
                        <div className="mb-8">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Flashcard */}
                    {currentCard && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-white font-medium">Card {currentCardIndex + 1} of {filteredFlashcards.length}</span>
                                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                                            {currentCard.category}
                                        </span>
                                    </div>
                                    <div className="text-white text-sm">
                                        {Math.round(((currentCardIndex + 1) / filteredFlashcards.length) * 100)}% Complete
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8">
                                <div
                                    className="min-h-[300px] flex items-center justify-center cursor-pointer"
                                    onClick={handleCardFlip}
                                >
                                    <div className="w-full max-w-2xl relative">
                                        {/* Front of card */}
                                        <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200 text-center transition-all duration-300 ${isFlipped ? 'opacity-0 scale-95 absolute inset-0' : 'opacity-100 scale-100'
                                            }`}>
                                            <div className="text-4xl mb-4">❓</div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Question</h3>
                                            <p className="text-lg text-gray-700 leading-relaxed">
                                                {currentCard.question}
                                            </p>
                                            <div className="mt-6 text-sm text-gray-500">
                                                Click to reveal answer
                                            </div>
                                        </div>

                                        {/* Back of card */}
                                        <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200 text-center transition-all duration-300 ${!isFlipped ? 'opacity-0 scale-95 absolute inset-0' : 'opacity-100 scale-100'
                                            }`}>
                                            <div className="text-4xl mb-4">💡</div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Answer</h3>
                                            <p className="text-lg text-gray-700 leading-relaxed">
                                                {currentCard.answer}
                                            </p>
                                            <div className="mt-6 text-sm text-gray-500">
                                                Click to see question
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Controls */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={previousCard}
                                    disabled={currentCardIndex === 0}
                                    className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                >
                                    <span>←</span>
                                    <span>Previous</span>
                                </button>

                                <button
                                    onClick={nextCard}
                                    disabled={currentCardIndex === filteredFlashcards.length - 1}
                                    className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                >
                                    <span>Next</span>
                                    <span>→</span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={shuffleCards}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                >
                                    <span>🔀</span>
                                    <span>Shuffle</span>
                                </button>

                                <button
                                    onClick={resetCards}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                >
                                    <span>🔄</span>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentCardIndex + 1) / filteredFlashcards.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 