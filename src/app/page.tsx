"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      if (session.user && 'role' in session.user && session.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/auth/signin");
    }
  };

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
                <p className="text-sm text-gray-500">Intelligent Learning Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {session.user?.name}
                  </span>
                  <button
                    onClick={handleGetStarted}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {session.user && 'role' in session.user && session.user.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Study Material</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your PDF documents and let our AI create personalized,
            easy-to-understand explanations with natural voice narration in multiple languages.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {session ? "Continue Learning" : "Get Started Free"}
            </button>
            <Link
              href="#features"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium text-lg hover:border-gray-400 transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart PDF Processing</h3>
              <p className="text-gray-600">
                Upload any PDF document and our AI will extract and analyze the content intelligently.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Narration</h3>
              <p className="text-gray-600">
                Listen to explanations with natural AI voices in multiple languages and accents.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🤗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Friendly Explanations</h3>
              <p className="text-gray-600">
                Get explanations written in a casual, friendly style that makes learning enjoyable.
              </p>
            </div>
          </div>

          {/* Language Support */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Supported Languages</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "English", flag: "🇺🇸" },
                { name: "Telugu", flag: "🇮🇳" },
                { name: "Hindi", flag: "🇮🇳" },
                { name: "Tamil", flag: "🇮🇳" },
                { name: "Kannada", flag: "🇮🇳" },
              ].map((lang) => (
                <div key={lang.name} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="text-sm font-medium text-gray-900">{lang.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 StudyBuddy AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
