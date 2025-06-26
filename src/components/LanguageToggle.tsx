"use client";

import React from "react";

type Language = "telugu" | "hindi" | "tamil" | "kannada" | "english";

interface LanguageToggleProps {
    language: Language;
    onLanguageChange: (language: Language) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
    language,
    onLanguageChange,
}) => {
    const languages = [
        { code: "telugu" as Language, name: "తెలుగు", native: "Telugu", flag: "🇮🇳" },
        { code: "hindi" as Language, name: "हिंदी", native: "Hindi", flag: "🇮🇳" },
        { code: "tamil" as Language, name: "தமிழ்", native: "Tamil", flag: "🇮🇳" },
        { code: "kannada" as Language, name: "ಕನ್ನಡ", native: "Kannada", flag: "🇮🇳" },
        { code: "english" as Language, name: "English", native: "English", flag: "🇺🇸" },
    ];

    return (
        <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Language</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => onLanguageChange(lang.code)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${language === lang.code
                                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">{lang.flag}</div>
                            <div className="text-left">
                                <div className="font-medium text-lg">{lang.name}</div>
                                <div className="text-sm text-gray-500">{lang.native}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageToggle; 