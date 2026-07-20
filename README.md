# 💰 PocketWise

> Smart Budgeting & AI-Powered Micro-Savings Platform for Zambia

PocketWise is a mobile-first financial management app that helps students, informal workers, and low-income earners track expenses, build savings habits, set financial goals, and receive AI-driven financial advice — all in Zambian Kwacha.

---

## ✨ Features

- 🔐 **User Authentication** — Secure registration and login with JWT tokens and bcrypt password hashing
- 💸 **Expense Tracking** — Log and categorize daily expenses (Food, Transport, Airtime, Bills, Other)
- 💰 **Micro-Savings** — Save any amount manually or via MTN Mobile Money with a full savings history
- 🎯 **Goal Setting** — Set financial goals with target amounts and deadlines
- 🧠 **AI Financial Advisor** — Personalized spending insights powered by Google Gemini AI
- 📊 **Dashboard Analytics** — Real-time summary of total expenses and savings

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native (Expo) |
| Backend API | Python — FastAPI |
| Database | PostgreSQL |
| AI Service | Google Gemini API |
| Payments | MTN Mobile Money API (sandbox) |
| Authentication | JWT + bcrypt |

---

## 📁 Project Structure

```
pocketwise/
├── frontend/                  # React Native mobile app
│   └── frontend/
│       ├── App.js             # Entry point
│       └── src/
│           ├── screens/
│           │   ├── LoginScreen.jsx
│           │   ├── RegisterScreen.jsx
│           │   ├── DashboardScreen.jsx
│           │   ├── ExpenseScreen.jsx
│           │   ├── SavingsScreen.jsx
│           │   ├── GoalsScreen.jsx
│           │   └── AIInsightScreen.jsx
│           ├── navigation/
│           │   └── AppNavigator.jsx
│           └── services/
│               └── api.js
│
└── backend/                   # Python FastAPI backend
    ├── main.py                # App entry point
    ├── .env                   # Environment variables
    └── app/
        ├── database.py        # SQLAlchemy setup
        ├── models/
        │   ├── user.py
        │   ├── expense.py
        │   ├── saving.py
        │   ├── goal.py
        │   └── ai_insight.py
        └── routes/
            ├── auth.py
            ├── expenses.py
            ├── savings.py
            ├── goals.py
            └── ai_insights.py
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (v16+)
- Expo Go app on your phone
- Google Gemini API key (free via [AI Studio](https://aistudio.google.com))

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pocketwise.git
cd pocketwise
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv pyjwt bcrypt google-genai
```

**Create `.env` file:**

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/pocketwise
SECRET_KEY=pocketwise_secret_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

**Create the PostgreSQL database:**

```bash
psql -U postgres
```
```sql
CREATE DATABASE pocketwise;
\q
```

**Run the backend:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

The API will be live at `http://localhost:8080`
Interactive docs at `http://localhost:8080/docs`

---

### 3. Frontend Setup

```bash
cd frontend/frontend

# Install dependencies
npm install
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens@~4.16.0 react-native-safe-area-context@~5.6.0
npm install axios
```

**Update the API base URL** in `src/services/api.js`:

```js
const BASE_URL = 'http://YOUR_LOCAL_IP:8080';
```

Replace `YOUR_LOCAL_IP` with your PC's IPv4 address from `ipconfig` (e.g. `192.168.43.192`).

> ⚠️ Your phone and PC must be on the same network (or your PC connected to your phone's hotspot).

**Start the app:**

```bash
npx expo start --lan
```

Scan the QR code with **Expo Go** on your Android phone.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get token | No |
| GET | `/expenses` | Get all user expenses | Yes |
| POST | `/expenses` | Add a new expense | Yes |
| DELETE | `/expenses/{id}` | Delete an expense | Yes |
| GET | `/expenses/summary` | Get totals summary | Yes |
| GET | `/savings` | Get all savings | Yes |
| POST | `/savings` | Add a savings record | Yes |
| GET | `/goals` | Get all goals | Yes |
| POST | `/goals` | Create a new goal | Yes |
| GET | `/ai-insights` | Get AI financial insights | Yes |

---

## 🧠 AI & ML Capabilities

- **Spending Pattern Analysis** — detects recurring overspending by category
- **Overspending Alerts** — flags categories exceeding 20% of total spend
- **Personalized Savings Nudges** — suggests daily savings amounts based on goals
- **Goal Achievement Prediction** — tracks savings velocity against deadlines
- **Natural Language Insights** — Gemini generates friendly, practical advice in context

---

## 📱 Screenshots

> _Add screenshots of your app screens here_

---

## 🌍 Roadmap

- [ ] Automatic expense categorization via ML model
- [ ] MTN MoMo live payment integration
- [ ] Weekly and monthly spending reports
- [ ] Multi-currency support for regional expansion
- [ ] Offline mode with sync

---

## 👤 Author

**Derrick**
Computer Science Student — Mulungushi University, Kabwe, Zambia

---

## 📄 License

This project is licensed under the MIT License.

---

> *Making every kwacha count through the power of AI.*
