# Chakshi - Intelligent Law Chatbot for eCourts India

An intelligent, conversational chatbot that helps users find case information from eCourts India with a beautiful, user-friendly interface.

## 🌟 Features

- **Intelligent Conversational Interface**: Ask questions naturally, the bot understands context
- **Smart Inference**: Automatically infers state from court names (e.g., "Patiala House" → Delhi)
- **Multiple Search Options**:
  - Search by CNR number
  - Search by party names
  - Search by case number
  - Search by advocate name
  - View court orders
  - Check cause lists
  - Caveat search
- **Beautiful UI**: Modern, aesthetic chat interface with smooth interactions
- **Partial Information Search**: Find cases even with incomplete information
- **Interactive Help**: Chatbot asks clarifying questions when needed

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Install all dependencies
npm run install-all
```

### Development

```bash
# Run both frontend and backend in development mode
npm run dev

# Or run them separately:
npm run dev:backend  # Backend on http://localhost:3001
npm run dev:frontend # Frontend on http://localhost:5173
```

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
chakshi/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript types
├── backend/           # Express + TypeScript
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── scrapers/      # eCourts scraping
│   │   └── types/         # TypeScript types
└── README.md
```

## 🎯 Usage Examples

**Finding a case with CNR:**
```
User: I have a CNR number DLHC01-123456-2024
Bot: 🔍 Searching for your case...
```

**Finding cases by party name:**
```
User: I want to check cases in Delhi
Bot: Sure! Do you have a party name, case number, or CNR?
User: Ramesh Kumar vs State
Bot: Got it! Which district should I search in, or should I check all Delhi courts?
```

**Checking court orders:**
```
User: Show me recent court orders from Bombay High Court
Bot: I'll search for court orders in Maharashtra High Court...
```

## 🔧 API Integration

The chatbot integrates with:
- **eCourts India Portal** (via web scraping)
- **Kleopatra Court API** (as backup/alternative)

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Scraping**: Axios, Cheerio, Puppeteer (when needed)
- **AI/NLP**: Natural language processing for query understanding

## 📝 Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
KLEOPATRA_API_URL=https://court-api.kleopatra.io/api
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT License

## 📧 Support

For support, please open an issue on GitHub.
