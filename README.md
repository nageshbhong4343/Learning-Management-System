# 🎓 Enterprise Learning Management & Placement System (LMS)

[![Django](https://img.shields.io/badge/Django-5.0+-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Railway](https://img.shields.io/badge/Railway-Deployable-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

An enterprise-grade, full-stack **Training, Learning & Placement Platform** engineered for universities, training institutes, and placement cells. Features role-based dashboards, sandboxed multi-language coding execution, interactive SQL practice, timed aptitude assessments, real-time attendance, and automated placement drive workflows.

---

## 📑 Table of Contents

- [Key Features & Modules](#-key-features--modules)
- [Architecture Overview](#-architecture-overview)
- [Role-Based Access Control](#-role-based-access-control)
- [Demo Credentials](#-demo-credentials)
- [Tech Stack](#-tech-stack)
- [Local Development Setup](#-local-development-setup)
  - [Option A: Docker Compose (Recommended)](#option-a-docker-compose-recommended)
  - [Option B: Native Terminal Setup](#option-b-native-terminal-setup)
- [API Documentation](#-api-documentation)
- [Production Deployment (Railway)](#-production-deployment-railway)
- [Environment Variables](#-environment-variables)
- [Project Directory Structure](#-project-directory-structure)

---

## 🌟 Key Features & Modules

### 1. 🛡️ Authentication & Role Management
- Custom user model with **7 distinct roles** (Super Admin, Admin, Trainer, Student, Placement Officer, Parent, HR Interviewer).
- Configurable **Login Modes** (`Always Active`, `Question Solving`, `Combo + OTP`, `Other Than Question Solving`).
- Secure SimpleJWT token lifecycle with rotation, blacklist, and auto-refresh interceptors.

### 2. 💻 Multi-Language Coding Sandbox
- Sandboxed execution runner supporting **Python, JavaScript, C++, and Java**.
- Real-time test-case validation against hidden and visible inputs with execution metrics.

### 3. 🗄️ SQL Practice & Schema Inspector
- Live relational PostgreSQL query sandbox.
- DDL schema preview, syntax highlighting, and table result visualizer.

### 4. 📝 Aptitude & Assessment Engine
- Categorized MCQ exams (Quantitative, Logical, Verbal, Technical).
- Countdown timer, question navigation grid, and automated instant scoring.

### 5. 🎯 Placement Drive Management
- Company drive listings, eligibility criteria (CGPA, backlog thresholds).
- Candidate application workflows, status tracking, and interview scheduling.

### 6. 🎙️ Mock Interviews & Evaluation
- Technical & HR mock interview booking, rubric-based feedback scoring, and recording logs.

### 7. 📚 Courseware & Batch Tracking
- Hierarchical course structure: **Course ➔ Subject ➔ Topic ➔ Lesson ➔ Materials** (Video, PDF, Code, Docs).
- Batch management, calendar scheduling, attendance tracking, and leave requests.

---

## 🏛️ Architecture Overview

```mermaid
graph TD
    Client["React 18 + Vite Frontend (Nginx SPA)"] -->|HTTPS / REST API| Backend["Django 5.0 REST API (Gunicorn)"]
    Backend --> DB[("PostgreSQL 16 Database")]
    Backend --> Redis[("Redis 7 (Cache & Broker)")]
    Backend --> Celery["Celery Worker (Async Tasks)"]
```

---

## 👥 Role-Based Access Control

| Role | Accessible Modules & Permissions |
| :--- | :--- |
| **Super Admin** | Full system governance, all endpoints, system configurations & logs. |
| **Admin** | User administration, batch allocation, course assignment, global analytics. |
| **Trainer** | Batch schedules, topic progression, attendance marking, student evaluations. |
| **Student** | Courseware learning, coding sandbox, SQL practice, aptitude tests, placement applications. |
| **Placement Officer**| Company drives, eligibility filters, candidate tracking, drive statistics. |
| **HR Interviewer** | Scheduled mock interviews, candidate scoring rubrics, qualitative feedback. |
| **Parent** | Student attendance review, academic performance, test results, leave tracking. |

---

## 🔑 Demo Credentials

*(Default password for all demo accounts:* `Password123!`*)*

| Role | Demo Email | Default Login Mode |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@lms.com` | Always Active |
| **Admin** | `admin@lms.com` | Other Than Question Solving |
| **Trainer** | `trainer@lms.com` | Other Than Question Solving |
| **Placement Officer** | `placement@lms.com` | Other Than Question Solving |
| **Student** | `student1@lms.com` | Question Solving |
| **Parent** | `parent@lms.com` | Other Than Question Solving |
| **HR Interviewer** | `hr@lms.com` | Other Than Question Solving |

> **Tip:** You can click the one-click demo role badges directly on the login page to autofill credentials.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 5
- **Styling:** Tailwind CSS + Lucide Icons
- **State & Queries:** TanStack React Query (v5)
- **Routing:** React Router v6 (SPA with Protected Routes)
- **Charts:** Recharts

### Backend
- **Framework:** Django 5.0 + Django REST Framework (DRF)
- **Authentication:** DRF SimpleJWT (Token Rotation + Blacklisting)
- **API Documentation:** drf-spectacular (OpenAPI 3.0 / Swagger / ReDoc)
- **Static Asset Serving:** WhiteNoise 6.12
- **Database:** PostgreSQL (with SQLite auto-fallback for local testing)
- **Background Tasks:** Celery + Redis
- **Production Server:** Gunicorn WSGI

---

## 🚀 Local Development Setup

### Option A: Docker Compose (Recommended)

Run the complete multi-service stack with a single command:

```bash
docker-compose up --build
```

- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000/api/](http://localhost:8000/api/)
- **Swagger Documentation:** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **Django Admin:** [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

### Option B: Native Terminal Setup

#### 1. Backend (Django)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate          # On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data       # Seeds default demo accounts & course data
python manage.py runserver 8000
```

#### 2. Frontend (React / Vite)
```powershell
cd frontend
npm install
npm run dev
```

---

## 📖 API Documentation

The backend includes auto-generated OpenAPI 3.0 documentation:

- **Swagger UI:** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **ReDoc UI:** [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)
- **OpenAPI Schema (JSON/YAML):** [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)
- **Health Check Endpoint:** [http://localhost:8000/api/health/](http://localhost:8000/api/health/)

---

## ☁️ Production Deployment (Railway)

This repository is optimized for one-click deployment on **[Railway](https://railway.app)**:

1. **Create Project**: On Railway, create a new project called `LMS Production`.
2. **Add PostgreSQL**: Provision a managed **PostgreSQL** database.
3. **Add Backend Service**:
   - Connect this GitHub repository with Dockerfile path: `backend/Dockerfile`.
   - Set environment variables:
     - `DEBUG` = `False`
     - `SECRET_KEY` = `your-secure-secret-key`
     - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
     - `ALLOWED_HOSTS` = `*`
     - `CORS_ALLOWED_ORIGINS` = `https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}`
     - `CSRF_TRUSTED_ORIGINS` = `https://${{frontend.RAILWAY_PUBLIC_DOMAIN}},https://${{RAILWAY_PUBLIC_DOMAIN}}`
   - Generate public domain.
4. **Add Frontend Service**:
   - Connect this GitHub repository with Dockerfile path: `frontend/Dockerfile`.
   - Set environment variable: `VITE_API_URL` = `https://your-backend.up.railway.app/api`.
   - Generate public domain.
5. *(Optional)* **Add Redis & Celery Worker**:
   - Add a managed **Redis** database.
   - Deploy a worker service with start command: `celery -A config worker --loglevel=info`.

---

## ⚙️ Environment Variables

Copy `.env.example` to create your local `.env`:

```ini
# Django Backend
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.railway.app,.up.railway.app
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/lms_db

# CORS & CSRF
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.up.railway.app
CSRF_TRUSTED_ORIGINS=http://localhost:3000,https://your-frontend.up.railway.app

# Frontend
VITE_API_URL=http://localhost:8000/api
```

---

## 📂 Project Directory Structure

```text
Learning_Management_System/
├── .env.example             # Environment template
├── .gitignore               # Comprehensive production ignore rules
├── docker-compose.yml       # Multi-service local orchestrator
├── railway.json             # Railway deployment specification
├── README.md                # Project documentation
│
├── backend/                 # Django REST Framework Backend
│   ├── Dockerfile           # Python 3.12 production container
│   ├── entrypoint.sh        # Startup script (migrate, static, gunicorn)
│   ├── manage.py
│   ├── requirements.txt     # Python dependencies
│   ├── config/              # Core Django project settings & URLs
│   └── apps/                # Modular Django business applications
│       ├── accounts/        # Custom user model, JWT auth & roles
│       ├── attendance/      # Daily & session attendance
│       ├── batches/         # Student batch management
│       ├── certificates/    # Certificate issuance & verification
│       ├── coding/          # Multi-language sandboxed code execution
│       ├── interviews/      # Technical & HR mock interviews
│       ├── learning/        # Courses, subjects, topics, and lessons
│       ├── leaves/          # Student leave applications & approvals
│       ├── placement/       # Placement drives, applications & jobs
│       ├── questions/       # Question bank & taxonomy
│       ├── sqlpractice/     # Relational SQL sandbox & test runner
│       ├── students/        # Student academic profiles & records
│       └── tests/           # Aptitude & MCQ assessment engine
│
└── frontend/                # React 18 + Vite + TypeScript Frontend
    ├── Dockerfile           # Multi-stage build (Node 20 -> Nginx)
    ├── nginx.conf           # SPA client-side routing & cache config
    ├── package.json         # Node.js dependencies & build scripts
    ├── tailwind.config.js   # Custom dark-theme design tokens
    ├── vite.config.ts       # Vite proxy & alias configuration
    └── src/
        ├── api/             # Centralized Axios API services
        ├── components/      # Reusable UI component library
        ├── contexts/        # React AuthContext & Global state
        ├── layouts/         # Dashboard & Navigation layouts
        ├── pages/           # Views for all 7 role dashboards & tools
        ├── routes/          # Protected & public route definitions
        └── types/           # TypeScript interfaces & models
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
