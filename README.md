# 📚 Study Buddy AI

A full-stack web application that helps students understand study materials through AI-powered explanations in multiple Indian languages with high-quality voice synthesis. Upload your PDF study materials and get explanations in Telugu (using English letters), Hindi, Tamil, Kannada, or English.

## ✨ Features

- **📄 PDF Upload**: Drag-and-drop or click to upload study material PDFs
- **🤖 AI Explanations**: Get friendly, casual explanations of study content
- **🌍 Language Options**: Choose between Telugu (English letters), Hindi, Tamil, Kannada, or English
- **💬 Chat-style Interface**: View explanations in a conversational format
- **🔄 Explain Again**: Request simpler explanations for any section
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎤 Voice Synthesis**: Uses high-quality AI voices using Eleven v3 Alpha model
- **🔊 Voice Controls**: Play, pause, resume, and stop functionality
- **🔧 Voice Settings**: Customize speed, pitch, volume, and voice selection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- ElevenLabs API key (optional, for enhanced AI voices)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd budd
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

   Get your OpenAI API key from: https://platform.openai.com/api-keys

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **PDF Processing**: pdf-parse
- **AI Integration**: OpenAI GPT-3.5-turbo
- **File Upload**: FormData API
- **Voice**: Web Speech API, ElevenLabs API

## 📖 Usage

1. **Upload PDF**: Drag and drop your study material PDF or click to browse
2. **Choose Language**: Select between Telugu (English letters), Hindi, Tamil, Kannada, or English
3. **Choose Voice Type**:
   - Browser TTS: Uses built-in browser voices
   - ElevenLabs AI: Uses high-quality AI voices (requires API key)
4. **Listen**: Click the "Listen" button to hear the explanation
5. **Voice Settings**: Customize voice parameters for optimal experience

## 🎯 How It Works

1. **PDF Processing**: The app extracts text from your uploaded PDF
2. **Chunking**: Content is split into logical sections (paragraphs)
3. **AI Explanation**: Each chunk is sent to OpenAI with a friendly prompt
4. **Display**: Explanations are shown in a chat-style interface

## 🔧 API Endpoints

- `POST /api/upload` - Upload and process PDF files
- `POST /api/explain` - Get AI explanations for text chunks

## 🎨 Customization

### Changing the AI Prompt

Edit the prompts in `app/api/explain/route.ts`:

```typescript
const teluguPrompt = (chunk: string) => `Your custom Telugu prompt here...`;
const englishPrompt = (chunk: string) => `Your custom English prompt here...`;
```

### Styling

The app uses Tailwind CSS. Modify styles in the component files or update `tailwind.config.js`.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` and `ELEVENLABS_API_KEY` to Vercel environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your OpenAI API key is set correctly
3. Ensure your PDF file is valid and readable
4. Check the network tab for API request failures

## 🔮 Future Enhancements

- [ ] Support for more file formats (DOCX, TXT)
- [ ] Voice explanations
- [ ] Save and share study sessions
- [ ] Multiple AI models support
- [ ] Offline mode with cached explanations
- [ ] Export explanations to PDF/Word

## 🎤 Voice Features

### Browser TTS

- Uses built-in browser text-to-speech
- Customizable speed, pitch, and volume
- Automatic voice selection based on language
- No additional API key required

### ElevenLabs AI Voices

- High-quality AI voices using Eleven v3 Alpha model
- Enhanced naturalness and clarity
- Speaker boost enabled for better pronunciation
- Automatic voice selection:
  - Varun R for Indian languages (Hindi, Telugu, Tamil, Kannada)
  - Monika Sogam for English
- Manual voice selection available
