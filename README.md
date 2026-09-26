# ChildHelp — One Platform for Children’s Education & Support

ChildHelp is a comprehensive, production-ready, full-stack web application designed to empower children and students with free educational materials, interactive quizzes, learning analytics, scholarships, mentor doubt support, and platform announcements.

The application features dedicated workflows and interfaces for **Students**, **Mentors**, and **Administrators**.

---

## 🌟 Key Features & Phase Implementation

### 1. 📚 Smart Study Materials
- **Comprehensive Library:** Access textbooks, practice sheets, articles, and video tutorials.
- **Advanced Search & Filtering:** Filter by Subject (Mathematics, Science, English, Programming), Class Level (Grades 6–10), Resource Format (PDF, VIDEO, ARTICLE, LINK), and Difficulty (Beginner, Intermediate, Advanced).
- **Interactive View & Resources:** Estimated learning time, active study session tracker, personal saved notes, and direct external links.

### 2. 🧩 Interactive Subject Quizzes & Secure Evaluation
- **Multiple Choice Assessments:** Subject-specific quizzes (Programming, Science, Mathematics).
- **Backend Score Calculation:** Scores, correct answer totals, and percentages are computed securely on the server. Answer keys are never sent to the frontend prior to submission.
- **Instant Result Feedback:** Shows score breakdown, accuracy percentage, and grade feedback.

### 3. 📊 Learning Analytics & Progress Tracking (`/my-progress`)
- **Quiz History:** View completed quiz logs, attempt timestamps, scores, and accuracy percentages.
- **Performance Overview:** Real DB aggregation of total quizzes taken, overall average percentage, and best score.
- **Data Isolation:** Strict user isolation ensuring students only view their own private progress data.

### 4. 🎓 Scholarships & Opportunities (`/scholarships`)
- **Search & Categories:** Search financial aid awards, merit grants, and STEM opportunities.
- **Official Links & Deadlines:** Provider info, eligibility criteria, class level filters, application deadlines, and official application links.

### 5. 💬 Mentor Support & Doubt Resolution (`/mentor-support` & `/mentor-dashboard`)
- **Student Doubt Submission:** Students can post subject-specific questions with titles and descriptions.
- **Mentor Answering Interface:** Mentors view pending student questions, write step-by-step solutions, and update question statuses to "Answered".

### 6. 📢 Platform Announcements (`/announcements`)
- **System Broadcasts:** Important academic updates, feature announcements, and system alerts published by administrators.

### 7. ⚙️ Admin Control Panel (`/admin-dashboard`)
- **System Statistics:** Real-time metrics on total students, mentors, admins, materials, quizzes, attempts, scholarships, and pending questions.
- **User Management:** List registered users, update roles (`student`, `mentor`, `admin`), and remove user accounts.
- **Content Management:** Create, edit, and delete study materials, quizzes, scholarships, and announcements.

### 8. 🔐 Authentication & Role-Based Access Control (RBAC)
- **JWT & Bcryptjs:** Password hashing with `bcryptjs`, token issuance with `jsonwebtoken`.
- **Role Enforcement:** Role middleware (`requireStudent`, `requireMentor`, `requireAdmin`) enforcing server-side authorization.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, React Router DOM v6, Axios, Vanilla CSS Design System with responsive layouts.
- **Backend:** Node.js, Express.js, CommonJS, REST APIs, Mongoose ORM, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`.
- **Database:** MongoDB & Mongoose ORM.
- **Deployment:** Vercel (Vite React SPA + Express API serverless rewrite).

---

## 📁 Project Architecture

```
ChildHelp/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleProtectedRoute.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Modal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudyMaterials.jsx
│   │   │   ├── MaterialDetails.jsx
│   │   │   ├── Quizzes.jsx
│   │   │   ├── QuizDetails.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   ├── MyProgress.jsx
│   │   │   ├── Scholarships.jsx
│   │   │   ├── MentorSupport.jsx
│   │   │   ├── MentorDashboard.jsx
│   │   │   ├── Announcements.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── routes/
│   │   │   └── index.jsx
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── materialController.js
│   │   ├── quizController.js
│   │   ├── quizAttemptController.js
│   │   ├── scholarshipController.js
│   │   ├── questionController.js
│   │   ├── announcementController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Material.js
│   │   ├── Quiz.js
│   │   ├── QuizAttempt.js
│   │   ├── Scholarship.js
│   │   ├── Question.js
│   │   └── Announcement.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── materialRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── quizAttemptRoutes.js
│   │   ├── scholarshipRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── announcementRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── api/
│   └── index.js
├── README.md
├── vercel.json
└── .gitignore
```

---

## 🚀 Environment Setup

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/childhelp?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Installation & Local Running Commands

### 1. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Seed Initial Database (Optional)
```bash
cd backend
npm run seed
```

### 3. Run Development Servers

#### Terminal 1 (Backend Server):
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

#### Terminal 2 (Frontend App):
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 📡 API Endpoints Table

| Method | Endpoint | Description | Access / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public (Default: student) |
| `POST` | `/api/auth/login` | Authenticate & get JWT token | Public |
| `GET` | `/api/auth/profile` | Get current user details | Protected |
| `GET` | `/api/materials` | List study materials with filters | Public / Protected |
| `GET` | `/api/materials/:id` | Get study material details | Public / Protected |
| `POST` | `/api/materials` | Create study material | Admin |
| `PUT` | `/api/materials/:id` | Update study material | Admin |
| `DELETE` | `/api/materials/:id` | Delete study material | Admin |
| `GET` | `/api/quizzes` | Get available quizzes (no answers) | Public / Protected |
| `GET` | `/api/quizzes/:id` | Get quiz details (no answers) | Protected |
| `POST` | `/api/quizzes` | Create new quiz | Admin |
| `PUT` | `/api/quizzes/:id` | Update quiz | Admin |
| `DELETE` | `/api/quizzes/:id` | Delete quiz | Admin |
| `POST` | `/api/quizzes/:id/submit` | Submit answers & return score | Protected (Student) |
| `GET` | `/api/quiz-attempts/my` | Get current user's quiz attempt logs | Protected (Student) |
| `GET` | `/api/scholarships` | List scholarship opportunities | Public / Protected |
| `POST` | `/api/scholarships` | Create scholarship opportunity | Admin |
| `DELETE` | `/api/scholarships/:id` | Delete scholarship opportunity | Admin |
| `GET` | `/api/questions` | List all questions | Mentor / Admin |
| `GET` | `/api/questions/my` | List logged-in student's questions | Student |
| `POST` | `/api/questions` | Submit a doubt / question | Student |
| `PUT` | `/api/questions/:id/answer` | Answer student doubt | Mentor / Admin |
| `GET` | `/api/announcements` | List announcements | Public / Protected |
| `POST` | `/api/announcements` | Post announcement | Admin |
| `DELETE` | `/api/announcements/:id` | Delete announcement | Admin |
| `GET` | `/api/admin/stats` | System metrics dashboard | Admin |
| `GET` | `/api/admin/users` | List registered users | Admin |
| `PUT` | `/api/admin/users/:id/role` | Update user role | Admin |
| `DELETE` | `/api/admin/users/:id` | Remove user account | Admin |

---

## ☁️ Vercel Deployment Instructions

This repository is pre-configured for Vercel deployment with zero-config serverless rewrites via `vercel.json` and `/api/index.js`.

### Deployment Steps:
1. Connect your repository on Vercel.
2. Set **Framework Preset** to `Vite`.
3. Set **Build Command** to `npm run build` or `cd frontend && npm install && npm run build`.
4. Set **Output Directory** to `frontend/dist`.
5. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) under Project Settings -> Environment Variables.
6. Deploy. Vercel automatically routes `/api/*` to the Express backend serverless function and static paths to the Vite frontend.

---

## 🧪 Testing Verification Procedure

1. **Registration & Login**:
   - Register a student account on `/register`.
   - Log in on `/login` and verify JWT token stored in `localStorage`.
2. **Student Flow**:
   - Navigate to `/materials`, filter by subject/type, open material details.
   - Navigate to `/quizzes`, take a quiz, submit answers, and verify instant score report.
   - Check `/my-progress` to verify real database attempt statistics.
   - Navigate to `/scholarships`, view eligibility and application links.
   - Navigate to `/mentor-support`, post a doubt question.
3. **Mentor Flow**:
   - Log in as a mentor user.
   - Open `/mentor-dashboard` or `/mentor-support`, view pending student doubts, write step-by-step solution, and submit answer.
4. **Admin Flow**:
   - Log in as an admin user.
   - Open `/admin-dashboard`, view system statistics, manage user roles, add/delete materials, quizzes, scholarships, and announcements.
