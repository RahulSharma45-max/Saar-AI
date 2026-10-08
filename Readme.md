# SaarAI — AI-Powered Document Intelligence Assistant

SaarAI is a modern full-stack document intelligence and summarization platform that converts PDFs and scanned documents into structured summaries, key takeaways, and actionable improvement suggestions.

Built with a Spring Boot backend and an enterprise-grade dark SaaS React dashboard, SaarAI combines Apache PDFBox text extraction, Tess4J/Tesseract OCR, and Google Gemini AI for automated document analysis.

---

## Live Demo & Repositories

* **Frontend:** [https://saar-ai-frontend.vercel.app/](https://saar-ai-frontend.vercel.app/)
* **Backend API:** [https://saar-ai-backend-m1n6.onrender.com](https://saar-ai-backend-m1n6.onrender.com)
* **GitHub Repository:** [https://github.com/RahulSharma45-max/Saar-AI](https://github.com/RahulSharma45-max/Saar-AI)

---

## Key Features

### Document Ingestion & Extraction
* 📄 **PDF Extraction**: Native digital PDF parsing powered by **Apache PDFBox** with automated page count detection.
* 🖼️ **OCR for Scans**: Optical Character Recognition on PNG, JPG, and JPEG files using **Tess4J / Tesseract**.
* 📤 **Drag-and-Drop Uploader**: Intuitive file dropzone with file picker fallback and automatic format & 10 MB size validation.

### AI Intelligence & Summarization
* 🤖 **Gemini AI Integration**: Multi-tiered semantic reasoning and synthesis.
* 📏 **Configurable Summary Length**: Segmented control for `Short` (~100w), `Medium` (~250w), and `Long` (~500w) summaries.
* 💡 **Key Point Extraction**: Sequenced, numbered insight cards (`01`, `02`, `03`...) isolating the most critical document findings.
* ✨ **Actionable Suggestions**: Categorized improvement guidance for document clarity, structure, and depth.
* 📖 **Raw Extracted Text Reader**: Dark code-editor style viewer with search query highlighting, line counts, word counts, and one-click copy.
* 📥 **Export Reports**: Instant one-click download of synthesized analysis reports as `.txt`.

### Enterprise SaaS UI/UX
* 🎨 **Curated Dark Theme**: Charcoal and dark blue-gray aesthetic (`#151B21`, `#202A32`) with indigo/purple accents.
* 🧭 **Three-Section Dashboard**:
  * **Left Sidebar**: Brand mark, workspace navigation (`Dashboard`, `Documents`, `Upload`, `History`, `Insights`, `Settings`), engine status indicator, and mobile drawer support.
  * **Main Dashboard**: Top header with search, notifications, 4 metric stat cards, drag-and-drop upload, monthly activity chart, and persistent recent documents.
  * **Right AI Assistant Panel**: Live capability overview, operational status pings (API Server, AI Engine, OCR Engine), and processing telemetry.
* ⏳ **Multi-Step Loading Experience**: Step-by-step progress tracking (*Document uploaded* → *Extracting text* → *Generating AI summary* → *Preparing insights*) with elapsed timer and glowing pulse.
* 🛡️ **Inline Error Recovery**: Polished alert banners with retry and dismissal actions.
* 📱 **Fully Responsive**: Fluid layout adapted across desktop (1440px/1280px), tablet (1024px), and mobile (768px/375px) viewports.

---

## Architecture & Workflow

```text
                        ┌───────────────────────────────┐
                        │         End User              │
                        └──────────────┬────────────────┘
                                       │
                         Uploads PDF / Scanned Image
                                       │
                                       ▼
             ┌─────────────────────────────────────────────────────┐
             │       SaarAI React Frontend (Vite / Vercel)         │
             │  • Three-Section Modern SaaS Dashboard              │
             │  • Drag & Drop Ingestion + Client-Side Validation   │
             │  • Real-Time Stepper & Document Analysis View       │
             └─────────────────────────┬───────────────────────────┘
                                       │
                                       │ Multipart POST /api/documents/process
                                       │
                                       ▼
             ┌─────────────────────────────────────────────────────┐
             │     Spring Boot 17 Backend REST API (Render)        │
             └───────────────┬─────────────────────────────┬───────┘
                             │                             │
              Content-Type: application/pdf   Content-Type: image/png, jpeg
                             │                             │
                             ▼                             ▼
             ┌──────────────────────────────┐ ┌───────────────────────────┐
             │      Apache PDFBox           │ │     Tess4J / Tesseract    │
             │  (Text & Page Count Parser)  │ │      (OCR Engine)         │
             └───────────────┬──────────────┘ └────────────┬──────────────┘
                             │                             │
                             └──────────────┬──────────────┘
                                            │
                                      Extracted Text
                                            │
                                            ▼
                             ┌──────────────────────────────┐
                             │       Google Gemini API      │
                             │  (Prompt-engineered LLM)     │
                             └──────────────┬───────────────┘
                                            │
                         Generates structured JSON payload:
                        ┌───────────────────┴───────────────────┐
                        ▼                   ▼                   ▼
                     Summary           Key Points          Suggestions
                        │                   │                   │
                        └───────────────────┼───────────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────┐
                             │       JSON REST Response     │
                             └──────────────┬───────────────┘
                                            │
                                            ▼
             ┌─────────────────────────────────────────────────────┐
             │         Interactive Document Analysis View          │
             │   Tabs: Overview | Summary | Key Points |           │
             │         Suggestions | Extracted Reader              │
             └─────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
* **Core:** React 19, Vite, JavaScript (ES Modules)
* **Styling:** Custom CSS Design System, Responsive Grid & Flexbox, Glassmorphism
* **Icons:** Lucide React
* **Typography:** Inter & JetBrains Mono (Google Fonts)
* **HTTP:** Fetch API (`multipart/form-data`)
* **State Management:** React Hooks (`useState`, `useEffect`, `useRef`) & `localStorage` persistence

### Backend
* **Language & Runtime:** Java 17
* **Framework:** Spring Boot 3
* **Build Tool:** Maven
* **PDF Processing:** Apache PDFBox
* **OCR Engine:** Tess4J (Tesseract OCR)
* **AI Engine:** Google Gemini API
* **Security & CORS:** Spring Web MVC Cross-Origin Configuration

### Deployment & DevOps
* **Frontend Hosting:** Vercel
* **Backend Hosting:** Render
* **Containerization:** Docker
* **Source Control:** Git / GitHub

---

## Project Structure

```text
Document-Summary/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/documentsummary/backend/
│   │       │   ├── controller/DocumentController.java
│   │       │   ├── service/AiSummaryService.java
│   │       │   ├── service/PdfExtractionService.java
│   │       │   └── service/OcrService.java
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   ├── .dockerignore
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityChart.jsx
│   │   │   ├── AssistantPanel.jsx
│   │   │   ├── DocumentResult.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── ExtractedText.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── KeyPoints.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── RecentDocuments.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Suggestions.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   └── UploadCard.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── Readme.md
└── .gitignore
```

---

## API Specification

### Process Document

```http
POST /api/documents/process
```

Processes an uploaded PDF or image file and returns an AI-generated summary, key points, improvement suggestions, and raw extracted text.

#### Request Headers & Body

```text
Content-Type: multipart/form-data
```

| Parameter       | Type              | Required | Description                                                    |
| --------------- | ----------------- | -------- | -------------------------------------------------------------- |
| `file`          | MultipartFile     | Yes      | PDF document or image file (`.pdf`, `.png`, `.jpg`, `.jpeg`).  |
| `summaryLength` | String            | Yes      | Desired length: `SHORT`, `MEDIUM`, or `LONG`.                  |

#### Response (`200 OK`)

```json
{
  "fileName": "Research_Paper.pdf",
  "extractedText": "Recent advancements in transformer-based architectures...",
  "summaryLength": "MEDIUM",
  "summary": "This paper analyzes modern deep learning transformer architectures...",
  "keyPoints": [
    "Evaluates self-attention models across benchmark datasets.",
    "Achieves a 14.2% relative improvement in ROUGE-L score."
  ],
  "improvementSuggestions": [
    "Clarity: Provide explicit confusion matrices for OCR recognition.",
    "Structure: Expand the ablation study section."
  ],
  "pageCount": 5
}
```

#### Error Response (`400 Bad Request` / `413 Payload Too Large` / `503 Service Unavailable`)

```json
{
  "error": "File is too large. Maximum size is 10MB."
}
```

---

## Local Development Setup

### Prerequisites

Ensure you have the following installed on your machine:

* **Java 17 JDK**
* **Apache Maven** (3.8+)
* **Node.js** (v18+) & **npm**
* **Google Gemini API Key**

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/RahulSharma45-max/Saar-AI.git
cd Saar-AI
```

---

### Step 2: Configure & Start the Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Set your Gemini API key:
   * **Windows PowerShell:**
     ```powershell
     $env:GCP_API_KEY="your_actual_gemini_api_key"
     ```
   * **Linux / macOS:**
     ```bash
     export GCP_API_KEY="your_actual_gemini_api_key"
     ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

4. The backend server will be listening at:
   ```text
   http://localhost:8080
   ```

---

### Step 3: Configure & Start the Frontend

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your local environment file (`.env`):
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the local URL (typically `http://localhost:5173` or `http://127.0.0.1:5173`).

---

## Environment Variables Reference

| Variable        | Environment | Description                                                               |
| --------------- | ----------- | ------------------------------------------------------------------------- |
| `GCP_API_KEY`   | Backend     | Gemini API key used by Spring Boot to generate summaries and suggestions. |
| `PORT`          | Backend     | Optional server port (defaults to `8080`).                                 |
| `VITE_API_URL`  | Frontend    | Base URL of the Spring Boot backend (`http://localhost:8080` in dev).     |

> ⚠️ **Security Warning:** Never commit `.env` files or API keys to version control.

---

## Deployment

### Frontend (Vercel)
1. Link your GitHub repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Configure the environment variable:
   * `VITE_API_URL=https://saar-ai-backend-m1n6.onrender.com`
4. Deploy.

### Backend (Render)
1. Deploy a Web Service from the `backend` directory using the provided `Dockerfile`.
2. Configure environment variable:
   * `GCP_API_KEY=your_gemini_api_key`
3. Configure CORS origins in `DocumentController.java` to match your Vercel domain.

---

## Author

**Rahul Sharma**  
B.Tech — Computer Science & Engineering  
GitHub: [@RahulSharma45-max](https://github.com/RahulSharma45-max)
