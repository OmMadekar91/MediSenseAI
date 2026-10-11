# MediSense AI — Frontend Web Application

The interactive, patient-friendly web client for **MediSense AI: Medical Reports, Made Clear**. Built with **React 18**, **Vite**, and **Vanilla CSS** for maximum performance, crisp typography, and responsive clinical visualization.

---

## 🌟 Overview & Design Philosophy

Medical laboratory printouts and patient portals are often difficult to interpret, cluttered with arcane abbreviations and confusing reference intervals. The MediSense AI frontend delivers:

- **Executive Clarity:** Clean sidebar navigation, high-contrast badges, and soft neutral backgrounds inspired by modern clinical dashboards.
- **Biomarker Range Meters:** Dynamic SVG and CSS position indicators illustrating where observed numbers fall relative to laboratory boundaries (Low, Normal Zone, High).
- **Patient Educational Drawers:** In-depth slide-over inspection drawers that explain what each test is, why it was ordered, biological plausibility, and standard targets.
- **Dynamic Doctor Consultation Checklist:** Automated synthesis of reported lab values into structured talking points for upcoming physician visits, with priority review tags and one-click clipboard copying.
- **Evidence-Grounded AI Insights:** Interactive Q&A chat with streaming-ready interface, citations (`[S1]`, `[S2]`), and clinical safety alerts.

---

## 📁 Architecture & Key Components

```
frontend/src/
├── components/
│   ├── Sidebar.jsx              # Brand logo, responsive navigation drawer & promo card
│   ├── PageHeader.jsx           # Eyebrow metadata, title, and action toolbar
│   ├── UploadSection.jsx        # Drag-and-drop PDF dropzone & uploaded reports list
│   ├── LabResultsCard.jsx       # Biomarkers table, status badges & inspection drawer
│   ├── LabResultsTable.jsx      # Standalone lab observations grid
│   ├── OtherViews.jsx           # Dashboard summary cards, dynamic Assignments & Progress meters
│   ├── HealthInsightsSection.jsx# Mistral-powered medical Q&A with source citations
│   ├── MedicalQA.jsx            # Standalone question-and-answer widget
│   └── StatusBadge.jsx          # Color-coded patient-friendly range badges
├── data/
│   └── medicalGuides.js         # Curated clinical guides, plausibility ranges & doctor questions
├── App.jsx                      # Application root, routing state & multi-report management
├── App.css                      # Unified design tokens, responsive typography & layout styles
├── index.css                    # Base resets, Google Fonts (Inter) & color variables
└── main.jsx                     # Vite React DOM entrypoint
```

---

## 🛠️ Tech Stack & Tooling

- **UI Framework:** React 18 (Functional components + Hooks)
- **Bundler & Dev Server:** Vite 5 (Ultra-fast Hot Module Replacement)
- **Linter & Code Quality:** Oxlint (High-speed Rust-based JavaScript linter)
- **Styling:** Custom CSS with CSS variables, Glassmorphism, and responsive breakpoints
- **Typography:** Inter (Google Fonts)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** installed:
```bash
node -v
npm -v
```

### 2. Installation
From the `frontend/` directory (or workspace root):
```bash
cd frontend
npm install
```

### 3. Development Server
Start Vite development server:
```bash
npm run dev
```
The frontend will be accessible at: [http://localhost:5173/](http://localhost:5173/)

### 4. Code Quality & Linting
Run Oxlint across all source files:
```bash
npm run lint
```

### 5. Production Build
Generate an optimized production bundle:
```bash
npm run build
```
The bundled assets will be generated in `frontend/dist/`.

---

## 🧩 Core Application Views

| View | Purpose |
| :--- | :--- |
| **Dashboard** | Executive workspace summary featuring active biomarker counts, abnormal status breakdown, and new report quick actions. |
| **Upload Labs** | PDF upload dropzone with automated parser integration, multi-report storage history, and sample report loader. |
| **Lab Results** | Extracted laboratory values table with reference intervals, patient-friendly status badges, and educational detail drawer. |
| **Assignments** | Dynamic doctor questions checklist prioritized by out-of-range biomarkers with interactive completion tracking and clipboard export. |
| **Progress** | Visual longitudinal range meters plotting patient values between clinical minimum and maximum thresholds. |
| **Health Insights**| Evidence-grounded medical Q&A powered by Mistral AI, citing verified clinical literature with safety disclaimers. |

---

## 📄 License

Part of the **MediSense AI** project, licensed under the [MIT License](../LICENSE).
