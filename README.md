# StudyBuddy AI - Intelligent Learning Assistant

A comprehensive AI-powered study assistant that transforms PDF documents into personalized, easy-to-understand explanations with natural voice narration in multiple languages.

## Features

### 🎯 Core Features

- **Smart PDF Processing**: Upload any PDF and get intelligent content analysis
- **Multi-language Support**: English, Telugu, Hindi, Tamil, and Kannada
- **Voice Narration**: Natural AI voices with browser TTS and ElevenLabs integration
- **Friendly Explanations**: Casual, easy-to-understand explanations
- **Markdown Rendering**: Beautiful formatting for summaries

### 👥 User Management

- **Authentication System**: Secure login with NextAuth.js
- **Role-based Access**: Admin and User roles with different permissions
- **Admin Dashboard**: Comprehensive user management and analytics
- **User Dashboard**: Personalized learning experience

### 🛡️ Admin Features

- **User Management**: View, activate, deactivate, and delete users
- **Analytics Dashboard**: Usage statistics and system health monitoring
- **System Settings**: Configurable application parameters
- **Activity Monitoring**: Real-time user activity tracking

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with credentials provider
- **AI Services**: OpenAI GPT-4, ElevenLabs TTS
- **PDF Processing**: pdf-parse
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- ElevenLabs API key (optional, for premium voice synthesis)

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
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here

   # Admin Credentials
   ADMIN_EMAIL=admin@studybuddy.com
   ADMIN_PASSWORD=admin123

   # ElevenLabs API
   ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

   # OpenAI API (for summarization)
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. **Generate NextAuth secret**

   ```bash
   openssl rand -base64 32
   ```

   Use the output as your `NEXTAUTH_SECRET`

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Demo Credentials

**Admin Account:**

- Email: `admin@studybuddy.com`
- Password: `admin123`

**User Account:**

- Email: `user@studybuddy.com`
- Password: `user123`

### User Flow

1. **Sign In**: Use the demo credentials or create your own
2. **Upload PDF**: Drag and drop or select a PDF file
3. **Choose Language**: Select your preferred language for explanations
4. **Select Voice Engine**: Choose between browser TTS or ElevenLabs AI
5. **Get Results**: View formatted explanations and listen to voice narration

### Admin Features

1. **Dashboard Overview**: View system statistics and recent activity
2. **User Management**: Manage user accounts and permissions
3. **Analytics**: Monitor usage patterns and system health
4. **Settings**: Configure application parameters

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User sign in
- `GET /api/auth/signout` - User sign out

### Core Features

- `POST /api/upload` - Upload and process PDF files
- `POST /api/summarize` - Generate AI summaries
- `POST /api/elevenlabs-tts` - Generate ElevenLabs voice synthesis

### Admin (Protected)

- `GET /api/admin/users` - Get user list
- `POST /api/admin/users` - Create/update users
- `DELETE /api/admin/users/:id` - Delete users

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── dashboard/          # Admin dashboard
│   ├── api/
│   │   ├── auth/              # NextAuth routes
│   │   ├── elevenlabs-tts/    # ElevenLabs API
│   │   ├── summarize/         # OpenAI summarization
│   │   └── upload/            # PDF upload processing
│   ├── auth/
│   │   └── signin/            # Sign in page
│   ├── dashboard/             # User dashboard
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Landing page
├── components/
│   ├── ElevenLabsVoiceSettings.tsx
│   ├── LanguageToggle.tsx
│   ├── PDFUpload.tsx
│   └── VoiceSettings.tsx
├── lib/
│   └── auth.ts               # NextAuth configuration
├── types/
│   └── next-auth.d.ts        # TypeScript declarations
└── middleware.ts             # Route protection
```

## Customization

### Adding New Languages

1. Update the `Language` type in components
2. Add language options to `LanguageToggle` component
3. Update API prompts for new language support

### Adding New Voice Providers

1. Create new voice settings component
2. Add voice provider selection logic
3. Implement voice synthesis API endpoint

### Customizing Admin Features

1. Extend the admin dashboard with new sections
2. Add new API endpoints for admin functionality
3. Update user management features as needed

## Security Features

- **Route Protection**: Middleware-based authentication
- **Role-based Access**: Admin and user role separation
- **Secure Authentication**: NextAuth.js with JWT tokens
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Secure configuration management

## Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add all required environment variables
3. **Deploy**: Vercel will automatically deploy on push to main branch

### Other Platforms

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Start production server**:

   ```bash
   npm start
   ```

3. **Set environment variables** on your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Database integration for user management
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] Offline support
- [ ] Multi-language voice synthesis
- [ ] Collaborative features
- [ ] Integration with learning management systems
