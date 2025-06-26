# StudyBuddy AI - Setup Guide

## Quick Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Admin Credentials
ADMIN_EMAIL=admin@studybuddy.com
ADMIN_PASSWORD=admin123

# ElevenLabs API (optional)
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

# OpenAI API (required for summarization)
OPENAI_API_KEY=your-openai-api-key-here
```

### 2. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Access the Application

- **Home Page**: http://localhost:3000
- **Sign In**: http://localhost:3000/auth/signin
- **User Dashboard**: http://localhost:3000/dashboard
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## Demo Credentials

### Admin Account

- **Email**: `admin@studybuddy.com`
- **Password**: `admin123`
- **Access**: Full admin dashboard with user management

### User Account

- **Email**: `user@studybuddy.com`
- **Password**: `user123`
- **Access**: User dashboard with PDF processing

## Features Overview

### 🔐 Authentication System

- Secure login with NextAuth.js
- Role-based access control (Admin/User)
- Protected routes with middleware
- Session management

### 👥 User Management

- **Admin Dashboard**: Complete user management interface
- **User Analytics**: Usage statistics and monitoring
- **System Settings**: Configurable application parameters
- **Activity Tracking**: Real-time user activity

### 📚 Study Features

- **PDF Upload**: Drag-and-drop PDF processing
- **AI Summarization**: OpenAI-powered explanations
- **Multi-language Support**: English, Telugu, Hindi, Tamil, Kannada
- **Voice Narration**: Browser TTS and ElevenLabs integration
- **Markdown Rendering**: Beautiful formatted summaries

### 🛡️ Security Features

- Route protection with middleware
- Role-based access control
- Secure authentication with JWT tokens
- Input validation and sanitization

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User authentication
- `GET /api/auth/signout` - User logout

### Core Features

- `POST /api/upload` - PDF upload and processing
- `POST /api/summarize` - AI-powered summarization
- `POST /api/elevenlabs-tts` - Voice synthesis

### Admin (Protected)

- `GET /api/admin/users` - Get user list
- `POST /api/admin/users` - User management operations

## Customization

### Adding New Users

1. **Via Admin Dashboard**: Use the admin interface to create users
2. **Via Environment**: Add users to the auth configuration
3. **Via API**: Use the admin API endpoints

### Modifying User Roles

1. Update the user's role in the admin dashboard
2. Modify the auth configuration for default roles
3. Use the API to update user permissions

### Adding New Languages

1. Update the `Language` type in components
2. Add language options to the toggle component
3. Update API prompts for new language support

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Check environment variables are set correctly
   - Verify NextAuth secret is properly configured
   - Ensure admin credentials match environment variables

2. **API Errors**

   - Verify OpenAI API key is valid
   - Check ElevenLabs API key (if using premium voices)
   - Ensure all required environment variables are set

3. **PDF Upload Issues**
   - Check file size limits
   - Verify PDF is not corrupted
   - Ensure proper file permissions

### Development Tips

1. **Environment Variables**: Always use `.env.local` for local development
2. **Authentication**: Use the demo credentials for testing
3. **API Testing**: Use browser dev tools or Postman for API testing
4. **Error Logging**: Check browser console and server logs for errors

## Production Deployment

### Environment Setup

1. Set all required environment variables on your hosting platform
2. Generate a new NextAuth secret for production
3. Update `NEXTAUTH_URL` to your production domain
4. Configure proper CORS settings if needed

### Security Considerations

1. Use strong, unique passwords for admin accounts
2. Regularly rotate API keys
3. Enable HTTPS in production
4. Implement rate limiting for API endpoints
5. Add proper error handling and logging

### Database Integration

For production use, consider integrating a real database:

1. **PostgreSQL**: Recommended for production
2. **MongoDB**: Good for flexible schemas
3. **SQLite**: Lightweight option for small deployments

Update the user management API to use your chosen database instead of the mock data.

## Support

For additional help:

1. Check the main README.md for detailed documentation
2. Review the code comments for implementation details
3. Create an issue in the repository for bugs or feature requests
4. Contact the development team for enterprise support
