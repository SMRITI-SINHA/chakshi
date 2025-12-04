# Chakshi Law Chatbot - Usage Guide

## 🚀 Getting Started

### Installation

```bash
# Option 1: Run setup script (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Option 2: Manual installation
npm run install-all
```

### Running the Application

```bash
# Start both frontend and backend together
npm run dev

# Or start them separately:
npm run dev:backend   # Backend on http://localhost:3001
npm run dev:frontend  # Frontend on http://localhost:5173
```

Then open your browser to **http://localhost:5173**

---

## 💬 How to Use the Chatbot

### Example Conversations

#### 1. **Search by CNR Number** (Fastest)
```
You: I have CNR DLHC01-12345678-2024
Bot: 🔍 Searching for your case...
[Shows complete case details]
```

#### 2. **Search by Party Name**
```
You: I want to check cases for Ramesh Kumar vs State
Bot: Got it! Which state should I search in?
You: Delhi
Bot: Perfect! Should I search all Delhi courts or a specific district?
You: Search all
Bot: 🔍 Searching...
[Shows matching cases]
```

#### 3. **Search with Partial Information**
```
You: Cases filed against ABC Company
Bot: I can help! Which state should I search in?
You: Maharashtra
Bot: Got it! Searching in Maharashtra...
[Shows results]
```

#### 4. **Court Orders**
```
You: Show me recent court orders from Bombay High Court
Bot: I'll search for court orders in Maharashtra High Court...
[Shows court orders]
```

#### 5. **Advocate Search**
```
You: Find cases where advocate Suresh Mehta appeared
Bot: Which state or court should I search in?
You: Delhi
Bot: Searching for cases with advocate Suresh Mehta in Delhi...
[Shows cases]
```

---

## 🎯 Smart Features

### 1. **Automatic State Inference**
The chatbot can automatically detect states from court names:

```
"Patiala House" → Delhi
"Bombay High Court" → Maharashtra
"Bangalore" → Karnataka
```

### 2. **Portal Auto-Detection**
Based on your query, the bot chooses the right portal:

- "court orders" → Court Orders portal
- "cause list" / "tomorrow's cases" → Cause List portal
- "caveat" → Caveat Search portal
- Default → Case Status portal

### 3. **Interactive Questioning**
The bot asks only necessary questions:

```
You: I want to check a case
Bot: Do you have party names, case number, or CNR? Which state?
```

### 4. **Flexible Search**
You don't need all information:

```
You: Cases in Delhi for Kumar
Bot: Searching with available information...
[Shows all matching cases]
```

---

## 📊 Understanding Results

### Result Format for Multiple Cases

```
⚖️ Found 3 cases matching your search:

1. **CS 234/2024** - Ramesh Kumar vs State of Delhi
   🏛️ Patiala House Courts, Central
   📅 Next Hearing: 20-Dec-2024, 10:30 AM
   👨‍⚖️ Judge: Hon'ble Justice A.K. Sharma
   Status: Pending

2. [Additional cases...]
```

### Case Information Includes:
- Case Number & CNR
- Party Names
- Court & District
- Case Type
- Filing Date
- Current Status (Pending/Disposed)
- Next Hearing Date
- Judge Name
- Advocates
- Purpose of Hearing
- All available case details

---

## 🔍 Search Types Supported

1. **CNR Number** - Most accurate, instant results
2. **Party Name** - Search by petitioner/respondent names
3. **Case Number** - Specific case number lookup
4. **Filing Number** - Search by filing number and year
5. **Advocate Name** - All cases for an advocate
6. **Court Orders** - Recent court orders and judgments
7. **Cause List** - Upcoming hearing dates
8. **Caveat** - Caveat search

---

## 🎨 UI Features

- **Beautiful Chat Interface** - Modern, clean design
- **Markdown Support** - Rich text formatting in responses
- **Typing Indicators** - Shows when bot is thinking
- **Auto-scroll** - Automatically scrolls to latest message
- **Online/Offline Status** - Shows API connectivity
- **Clear Chat** - Reset conversation anytime
- **Responsive Design** - Works on all screen sizes

---

## ⚡ Tips for Best Results

1. **Always provide state/court location** - Helps narrow down search
2. **Use CNR when available** - Most accurate and fastest
3. **Spell party names correctly** - Partial matches work too
4. **Provide year when possible** - Reduces result count
5. **Be conversational** - The bot understands natural language

---

## 🛠️ Troubleshooting

### "API Offline" shown
- Check if backend is running: `npm run dev:backend`
- Verify backend is on port 3001
- Check `.env` files are configured correctly

### No results found
- Try searching in a different state
- Check spelling of party names
- The case might be very recent or very old
- eCourts website might be updating (try again later)

### Slow responses
- eCourts website might be slow
- Network connectivity issues
- Try refreshing the page

---

## 📝 Notes

- **Data Source**: eCourts India (https://ecourts.gov.in)
- **Backup API**: Kleopatra Court API for reliability
- **Real-time**: Fetches live data from eCourts
- **Privacy**: All searches are anonymous
- **No Login Required**: Free to use

---

## 🤝 Need Help?

If you encounter issues:
1. Check the console logs (F12 in browser)
2. Restart both frontend and backend
3. Clear browser cache
4. Check environment variables in `.env` files

---

## 📚 Additional Resources

- eCourts India: https://ecourts.gov.in
- API Documentation: Included in project
- GitHub Issues: Report bugs and requests

---

**Happy Searching! ⚖️**
