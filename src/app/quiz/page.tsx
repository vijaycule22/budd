"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
}

interface QuizResult {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    timeTaken: number;
    completedAt: string;
}

export default function QuizPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
    const [showExplanation, setShowExplanation] = useState(false);

    // Check authentication
    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/auth/signin");
        }
    }, [session, status, router]);

    // Load quiz questions from localStorage
    useEffect(() => {
        const savedQuestions = localStorage.getItem('studybuddy_quiz_questions');
        if (savedQuestions) {
            try {
                const parsed = JSON.parse(savedQuestions);
                setQuestions(parsed);

                // Extract unique categories
                const uniqueCategories = [...new Set(parsed.map((q: QuizQuestion) => q.category))] as string[];
                setCategories(uniqueCategories);

                // Initialize selected answers array
                setSelectedAnswers(new Array(parsed.length).fill(-1));
            } catch (error) {
                console.error('Failed to parse saved quiz questions:', error);
            }
        }
    }, []);

    const filteredQuestions = selectedCategory === 'all'
        ? questions
        : questions.filter(q => q.category === selectedCategory);

    const currentQuestion = filteredQuestions[currentQuestionIndex];

    const handleAnswerSelect = (answerIndex: number) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[currentQuestionIndex] = answerIndex;
        setSelectedAnswers(newSelectedAnswers);
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowExplanation(false);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setShowExplanation(false);
        }
    };

    const startQuiz = () => {
        setQuizStarted(true);
        setStartTime(new Date());
        setCurrentQuestionIndex(0);
        setSelectedAnswers(new Array(filteredQuestions.length).fill(-1));
        setShowResults(false);
        setShowExplanation(false);
    };

    const finishQuiz = () => {
        const endTime = new Date();
        const timeTaken = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;

        const correctAnswers = selectedAnswers.filter((answer, index) =>
            answer === filteredQuestions[index].correctAnswer
        ).length;

        const result: QuizResult = {
            totalQuestions: filteredQuestions.length,
            correctAnswers,
            score: Math.round((correctAnswers / filteredQuestions.length) * 100),
            timeTaken,
            completedAt: endTime.toISOString()
        };

        // Save result to localStorage
        const savedResults = localStorage.getItem('studybuddy_quiz_results') || '[]';
        const results = JSON.parse(savedResults);
        results.push(result);
        localStorage.setItem('studybuddy_quiz_results', JSON.stringify(results));

        setShowResults(true);
    };

    const resetQuiz = () => {
        setQuizStarted(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswers(new Array(filteredQuestions.length).fill(-1));
        setShowResults(false);
        setShowExplanation(false);
        setStartTime(null);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreEmoji = (score: number) => {
        if (score >= 80) return '🎉';
        if (score >= 60) return '👍';
        return '📚';
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    if (questions.length === 0) {
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
                                    <p className="text-sm text-gray-500">Quiz</p>
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
                            <span className="text-4xl">🧠</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            No Quiz Questions Available
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Generate quiz questions from your uploaded documents to test your knowledge.
                        </p>
                        <Link
                            href="/dashboard"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Upload Document & Generate Quiz
                        </Link>
                    </div>
                </main>
            </div>
        );
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
                                <p className="text-sm text-gray-500">Quiz</p>
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
                    {categories.length > 1 && !quizStarted && !showResults && (
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

                    {/* Quiz Start Screen */}
                    {!quizStarted && !showResults && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">🧠</span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Ready to Test Your Knowledge?
                                </h2>
                                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Take a quiz with {filteredQuestions.length} questions based on your uploaded documents.
                                    Test your understanding and see how well you've learned the material.
                                </p>

                                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Details</h3>
                                    <div className="grid md:grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-blue-600">{filteredQuestions.length}</div>
                                            <div className="text-sm text-gray-600">Questions</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-purple-600">Multiple Choice</div>
                                            <div className="text-sm text-gray-600">Format</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-green-600">Unlimited</div>
                                            <div className="text-sm text-gray-600">Time</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={startQuiz}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Start Quiz
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quiz Questions */}
                    {quizStarted && !showResults && currentQuestion && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Question Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-white font-medium">
                                            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                                        </span>
                                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                                            {currentQuestion.category}
                                        </span>
                                    </div>
                                    <div className="text-white text-sm">
                                        {Math.round(((currentQuestionIndex + 1) / filteredQuestions.length) * 100)}% Complete
                                    </div>
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="p-8">
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                        {currentQuestion.question}
                                    </h3>

                                    <div className="space-y-3">
                                        {currentQuestion.options.map((option, index) => {
                                            const isSelected = selectedAnswers[currentQuestionIndex] === index;
                                            const isCorrect = index === currentQuestion.correctAnswer;
                                            const showCorrectAnswer = showExplanation;

                                            let optionStyle = "border-2 border-gray-200 hover:border-gray-300 bg-white";
                                            if (isSelected && showCorrectAnswer) {
                                                optionStyle = isCorrect
                                                    ? "border-2 border-green-500 bg-green-50"
                                                    : "border-2 border-red-500 bg-red-50";
                                            } else if (showCorrectAnswer && isCorrect) {
                                                optionStyle = "border-2 border-green-500 bg-green-50";
                                            } else if (isSelected) {
                                                optionStyle = "border-2 border-blue-500 bg-blue-50";
                                            }

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handleAnswerSelect(index)}
                                                    disabled={showExplanation}
                                                    className={`w-full p-4 rounded-xl text-left transition-all ${optionStyle} ${showExplanation ? 'cursor-default' : 'cursor-pointer hover:shadow-md'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${isSelected && showCorrectAnswer
                                                            ? isCorrect
                                                                ? 'border-green-500 bg-green-500 text-white'
                                                                : 'border-red-500 bg-red-500 text-white'
                                                            : showCorrectAnswer && isCorrect
                                                                ? 'border-green-500 bg-green-500 text-white'
                                                                : isSelected
                                                                    ? 'border-blue-500 bg-blue-500 text-white'
                                                                    : 'border-gray-300 bg-white text-gray-400'
                                                            }`}>
                                                            {isSelected && showCorrectAnswer
                                                                ? isCorrect ? '✓' : '✗'
                                                                : showCorrectAnswer && isCorrect
                                                                    ? '✓'
                                                                    : String.fromCharCode(65 + index)}
                                                        </div>
                                                        <span className="text-gray-900">{option}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Explanation */}
                                {showExplanation && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                                        <h4 className="text-lg font-semibold text-blue-900 mb-2">Explanation</h4>
                                        <p className="text-blue-800">{currentQuestion.explanation}</p>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={previousQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                    >
                                        <span>←</span>
                                        <span>Previous</span>
                                    </button>

                                    <div className="flex items-center space-x-4">
                                        {currentQuestionIndex === filteredQuestions.length - 1 ? (
                                            <button
                                                onClick={finishQuiz}
                                                disabled={selectedAnswers[currentQuestionIndex] === -1}
                                                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                            >
                                                Finish Quiz
                                            </button>
                                        ) : (
                                            <button
                                                onClick={nextQuestion}
                                                disabled={selectedAnswers[currentQuestionIndex] === -1}
                                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                            >
                                                <span>Next</span>
                                                <span>→</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quiz Results */}
                    {showResults && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">{getScoreEmoji(selectedAnswers.filter((answer, index) =>
                                        answer === filteredQuestions[index].correctAnswer
                                    ).length / filteredQuestions.length * 100)}</span>
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Quiz Complete!
                                </h2>

                                <div className="bg-gray-50 rounded-xl p-8 mb-8">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <div className={`text-4xl font-bold ${getScoreColor(selectedAnswers.filter((answer, index) =>
                                                answer === filteredQuestions[index].correctAnswer
                                            ).length / filteredQuestions.length * 100)}`}>
                                                {selectedAnswers.filter((answer, index) =>
                                                    answer === filteredQuestions[index].correctAnswer
                                                ).length / filteredQuestions.length * 100}%
                                            </div>
                                            <div className="text-sm text-gray-600">Score</div>
                                        </div>
                                        <div>
                                            <div className="text-4xl font-bold text-blue-600">
                                                {selectedAnswers.filter((answer, index) =>
                                                    answer === filteredQuestions[index].correctAnswer
                                                ).length}/{filteredQuestions.length}
                                            </div>
                                            <div className="text-sm text-gray-600">Correct Answers</div>
                                        </div>
                                        <div>
                                            <div className="text-4xl font-bold text-purple-600">
                                                {startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0}s
                                            </div>
                                            <div className="text-sm text-gray-600">Time Taken</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={resetQuiz}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Take Quiz Again
                                    </button>
                                    <Link
                                        href="/dashboard"
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 