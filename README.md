# Yukti Yantra - AI Chatbot

A modern AI chatbot built with Next.js, FastAPI, and Google's Gemini AI.

## Features

- Real-time chat interface
- Multiple AI model support (Gemini 1.5 Flash, Pro, and Ultra)
- File upload capability
- Conversation history management
- Modern, responsive UI
- Dark/Light mode support

## Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- AI: Google Gemini API
- UI Components: shadcn/ui

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yukti-yantra.git
cd yukti-yantra
```

2. Install backend dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory:
```
GOOGLE_API_KEY=your_gemini_api_key_here
```

## Running the Application

1. Start the backend server:
```bash
source venv/bin/activate
uvicorn main:app --reload
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Usage

- Type your message in the input field and press Enter or click the Send button
- Upload files by clicking the paperclip icon
- Switch between AI models using the dropdown menu
- Start a new conversation using the refresh button
- Toggle the sidebar for additional options

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 