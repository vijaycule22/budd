"use client";

import { useState, useRef } from "react";

interface PDFUploadProps {
    onUpload: (file: File) => void;
    isUploading: boolean;
}

export default function PDFUpload({ onUpload, isUploading }: PDFUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file.type === "application/pdf") {
            onUpload(file);
        } else {
            alert("Please select a PDF file.");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mb-6">
            <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragOver
                        ? "border-blue-500 bg-blue-50 scale-105"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={isUploading ? undefined : handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={isUploading}
                />

                <div className="space-y-6">
                    {isUploading ? (
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div>
                                <div className="text-xl font-semibold text-gray-900 mb-2">
                                    Processing Your Document
                                </div>
                                <div className="text-gray-600">
                                    Please wait while we analyze your PDF...
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                                <span className="text-4xl">📚</span>
                            </div>
                            <div>
                                <div className="text-xl font-semibold text-gray-900 mb-2">
                                    Drop your PDF here, or click to browse
                                </div>
                                <div className="text-gray-600 mb-4">
                                    Upload your study material and get AI-powered explanations
                                </div>
                                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                                    <span>📄</span>
                                    <span>Only PDF files supported</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Upload Icon Overlay */}
                {!isUploading && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
} 