# AI Resume Analyzer

An intelligent, full-stack web application designed to evaluate resumes against job descriptions, calculate ATS (Applicant Tracking System) compatibility scores, detect skill gaps, analyze job keywords, and provide actionable optimization recommendations.

---

## 🌟 Key Features

- **Real Document Text Extraction**: Supports both `.pdf` (via **PyMuPDF**) and `.docx` (via **python-docx**) format uploads.
- **Dynamic ATS Score (0-100)**: Evaluates resumes across 4 weighted dimensions:
  - **Skills Match (40%)**: Hard skills, frameworks, cloud technologies, databases, and soft skills.
  - **Keyword Match (30%)**: Semantic frequency of requirements extracted from the target job posting.
  - **Resume Structure (15%)**: Verification of essential sections (Contact, Experience, Education, Skills, Projects).
  - **Experience & Education Relevance (15%)**: Alignment of years of experience and degree requirements.
- **Skill Gap Analysis**: Visual green badges for matched skills and alert badges for missing skills.
- **Keyword Status Table**: Interactive table displaying `Keyword | Required | Found | Status` with search and filtering.
- **Identified Strengths & Weaknesses**: Clear highlights of candidate strengths and red flags.
- **Actionable Optimization Recommendations**: Concrete steps to elevate ATS score.
- **Candidate Executive Summary**: Automated professional profile overview.
- **Downloadable Audit Report**: Export detailed text/markdown reports for offline review.
- **Zero Paid APIs Required**: 100% local Python NLP/rule-based matching engine.
- **SQLite Persistence**: Automatically saves analyses to `backend/resume_analyzer.db`.

---

## 📁 Project Folder Structure

```
AI-Resume-Analyzer/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── JobDescription.jsx
│   │   │   ├── AnalyzeButton.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   ├── ScoreBreakdown.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   ├── KeywordTable.jsx
│   │   │   ├── StrengthCard.jsx
│   │   │   ├── WeaknessCard.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Analyze.jsx
│   │   │   ├── Results.jsx
│   │   │   └── About.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── uploads/
│   ├── reports/
│   ├── app.py
│   ├── analyzer.py
│   ├── database.py
│   ├── resume_parser.py
│   ├── requirements.txt
│   └── resume_analyzer.db
│
├── sample_files/
│   ├── John_Smith_Resume.pdf
│   └── Emily_Davis_Resume.docx
│
└── README.md
```

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Framework**: React (v18+)
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: CSS3 (Emerald & Deep Green Theme with Glassmorphism)

### Backend
- **Framework**: Python 3.10+ / Flask
- **CORS**: Flask-CORS
- **PDF Extraction**: PyMuPDF (`pymupdf`)
- **DOCX Extraction**: `python-docx`
- **Database**: SQLite3 (Standard Library)
- **NLP Engine**: Python Regex and Rule-Based Taxonomy

---

## 🚀 Getting Started

### 1. Start the Backend API Server

Open a terminal window:

```bash
# Navigate to backend folder
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Start Flask server
python app.py
```

The backend server will run on:
```
http://127.0.0.1:5000
```

> **Note**: If `python` is not in your global PATH, run with your full python executable path, for example:
> `& "C:\Users\yeshwanth.k\AppData\Local\Python\pythoncore-3.14-64\python.exe" app.py`

---

### 2. Start the Frontend Development Server

Open a second terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install Node modules (if not already installed)
npm install

# Start Vite development server
npm run dev
```

The frontend web application will run on:
```
http://localhost:5173
```

Open `http://localhost:5173` in any modern web browser to use the application!

---

## 📡 Backend REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Accepts multipart form data (`resume`, `job_description`, optional `job_title`), parses file, performs ATS audit, stores to SQLite, returns full JSON analysis. |
| `GET` | `/api/analysis/<id>` | Retrieves previous analysis result by its unique database ID. |
| `GET` | `/api/report/<id>` | Downloads a formatted text/markdown report of the specified analysis. |
| `GET` | `/api/history` | Returns the 10 most recent analysis records. |
| `GET` | `/api/health` | Health check endpoint returning backend status and timestamp. |

---

## 🧪 Testing with Sample Resumes

We have included pre-generated sample resumes in the `sample_files/` folder:
- `sample_files/John_Smith_Resume.pdf` (Full Stack Software Engineer)
- `sample_files/Emily_Davis_Resume.docx` (Data Scientist / Machine Learning)

On the **Analyze** page:
1. Drag and drop either sample resume.
2. Click **"Load Full Stack Sample"** or **"Load ML Sample"** in the job requirements panel to automatically fill sample job details.
3. Click **"Analyze Resume"** to view the live ATS results dashboard!
