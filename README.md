# 🧠 FlashLearn — Micro-Learning Flashcard Exchange Platform

> **Learn Small. Remember More.**

FlashLearn is a full-stack micro-learning platform where students can create, share, exchange and learn using interactive flashcards.

---

## ✨ Features

| Feature | Description |
|---------|------------|
| 🔐 Authentication | Register, login, logout with JWT tokens and hashed passwords |
| 📊 Dashboard | Stats, progress overview, recent cards |
| 📚 Flashcard Management | Create, view, edit, delete your own flashcards |
| 🔍 Explore | Browse and search all community flashcards |
| 🧠 Learning Mode | Interactive quiz — one card at a time with Know/Review buttons |
| 📈 Progress Tracking | Overall and category-wise learning progress |
| 👤 Profile | View and update your profile |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js + Vite + React Router + CSS |
| **Backend** | Python Flask + Flask-JWT-Extended + Flask-CORS |
| **Database** | SQLite + SQLAlchemy ORM |
| **Auth** | JWT (JSON Web Tokens) + Werkzeug password hashing |

---

## 📁 Project Structure

```
FlashLearn/
├── frontend/                   ← React frontend (Vite)
│   ├── src/
│   │   ├── components/         ← Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── FlashcardItem.jsx
│   │   │   ├── FlashcardForm.jsx
│   │   │   ├── CategoryBadge.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  ← Global auth state
│   │   ├── pages/               ← One file per page
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyFlashcards.jsx
│   │   │   ├── CreateFlashcard.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Learn.jsx
│   │   │   ├── Progress.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js           ← All API calls in one file
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    ← Python Flask backend
│   ├── models/
│   │   ├── user.py             ← User database model
│   │   ├── flashcard.py        ← Flashcard database model
│   │   └── progress.py         ← Progress database model
│   ├── routes/
│   │   ├── auth.py             ← /api/auth routes
│   │   ├── flashcards.py       ← /api/flashcards routes
│   │   ├── dashboard.py        ← /api/dashboard routes
│   │   └── progress.py         ← /api/progress routes
│   ├── app.py                  ← Flask app entry point
│   ├── config.py               ← Configuration (secret keys, DB path)
│   ├── extensions.py           ← db and jwt instances
│   └── requirements.txt
│
├── database/
│   └── flashlearn.db           ← SQLite database (auto-created)
│
└── README.md
```

---

## 🚀 Installation & Running

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm

---

### Backend Setup

**Terminal 1:**

```powershell
cd backend

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install Python packages
pip install -r requirements.txt

# Run Flask backend
python app.py
```

Backend runs at: **http://localhost:5000**

---

### Frontend Setup

**Terminal 2:**

```powershell
cd frontend

# Install npm packages
npm install

# Start Vite dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔌 API Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/profile` | Get user profile | ✅ Yes |
| PUT | `/api/auth/profile` | Update name | ✅ Yes |
| GET | `/api/flashcards` | Get all flashcards | No |
| POST | `/api/flashcards` | Create flashcard | ✅ Yes |
| GET | `/api/flashcards/:id` | Get single card | No |
| PUT | `/api/flashcards/:id` | Update card | ✅ Yes (owner) |
| DELETE | `/api/flashcards/:id` | Delete card | ✅ Yes (owner) |
| GET | `/api/flashcards/my` | Get my cards | ✅ Yes |
| GET | `/api/dashboard` | Dashboard stats | ✅ Yes |
| GET | `/api/progress` | Progress stats | ✅ Yes |
| POST | `/api/progress` | Update progress | ✅ Yes |

---

## 🗄️ Database

- **Database:** SQLite (file: `database/flashlearn.db`)
- **ORM:** SQLAlchemy
- Auto-created when you run `python app.py`

**Tables:**
- `users` — id, name, email, password (hashed), created_at
- `flashcards` — id, question, answer, category, user_id, created_at
- `progress` — id, user_id, flashcard_id, status, review_count, updated_at

---

## 🎓 For College Viva

| Question | Answer |
|----------|--------|
| Frontend? | React.js (component-based UI library) |
| Backend? | Python Flask (REST API framework) |
| Database? | SQLite (serverless database file) |
| ORM? | SQLAlchemy (maps Python classes to DB tables) |
| Auth? | JWT tokens (stored in browser localStorage) |
| Password security? | Werkzeug `generate_password_hash` |
| API communication? | REST API with JSON payloads |

---

## 🔮 Future Enhancements

- [ ] Flashcard sharing with specific users
- [ ] Spaced repetition algorithm
- [ ] Dark mode toggle
- [ ] Export/Import flashcards (CSV/PDF)
- [ ] Public profile pages

---

*Built with ❤️ as an internship mini-project | FlashLearn © 2024*
