# SaarAI — Frontend Client

The frontend client for **SaarAI** is an enterprise-grade dark SaaS dashboard engineered with React 19, Vite, and Lucide React. It provides real-time document analysis, multi-step progress indicators, interactive charts, and rich tabbed document readers.

---

## Features

- **Three-Section Dashboard Layout:**
  - **Left Sidebar:** Workspace navigation, engine status badge, and mobile drawer.
  - **Main Content:** Header with search & notifications, 4 KPI statistic cards, drag-and-drop upload, activity analytics chart, and recent documents.
  - **Right Assistant Panel:** Live status indicators, AI capabilities, and processing telemetry.
- **Document Ingestion:**
  - Drag-and-drop or file picker for PDFs, PNG, JPG, and JPEG files.
  - Client-side validation for file format and 10 MB size limits.
  - Segmented summary length selector (`Short`, `Medium`, `Long`).
- **Interactive Document Analysis View:**
  - Executive summary presentation with reading time and word count.
  - Numbered key insight cards with copy actions.
  - Categorized improvement suggestions.
  - Dark editor reader with in-text search, highlight matching, line numbers, and plain-text export.
- **Persisted History:**
  - Automatically stores analyzed documents in `localStorage` for instant review.
- **Responsive Design:**
  - Full support across desktop (1440px/1280px), tablet (1024px), and mobile (768px/375px).

---

## Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Bundler & Tooling:** [Vite](https://vite.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** Inter & JetBrains Mono (Google Fonts)
- **Styling:** Custom Vanilla CSS Design System with CSS variables

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the `frontend` root:

```env
VITE_API_URL=http://localhost:8080
```

> In production (e.g. Vercel), set `VITE_API_URL` to your Render backend API URL.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```
