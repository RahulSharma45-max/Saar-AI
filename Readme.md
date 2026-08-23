# SaarAI — Document Summary Assistant

SaarAI is a full-stack AI-powered document summarization application that converts PDFs and scanned images into concise, structured insights. It extracts text, generates summaries, highlights key points, and provides improvement suggestions.

## Live Demo

**Frontend:** https://saar-ai-frontend.vercel.app/

**Backend API:** https://saar-ai-backend-m1n6.onrender.com

**GitHub:** https://github.com/RahulSharma45-max/Saar-AI

> **Note:** The live document-processing API is currently being finalized for production CORS configuration.

---

## Features

* 📄 Upload PDF documents
* 🖼️ Upload PNG/JPG/JPEG scanned documents
* 📤 Drag-and-drop and file picker support
* 🔍 PDF text extraction using Apache PDFBox
* 📝 OCR for scanned images using Tess4J/Tesseract
* 🤖 AI-powered summarization using Gemini
* 📏 Short, Medium, and Long summary options
* 💡 Key points and main ideas
* ✨ Improvement suggestions
* 📖 View extracted document text
* ⚠️ File type and file-size validation
* ⏳ Loading and processing states
* 🛡️ Basic error handling
* 📱 Responsive user interface

---

## How It Works

```text
                    User
                     │
                     ▼
              React Frontend
                 (Vercel)
                     │
                     │ REST API
                     ▼
             Spring Boot Backend
                 (Render)
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
           PDFBox        Tess4J/OCR
           PDF Text      Image Text
              │             │
              └──────┬──────┘
                     ▼
                Extracted Text
                     │
                     ▼
                 Gemini API
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Summary    Key Points   Suggestions
          │          │          │
          └──────────┼──────────┘
                     ▼
               React Frontend
```

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Fetch API

### Backend

* Java 17
* Spring Boot
* Maven
* REST APIs
* Apache PDFBox
* Tess4J / Tesseract

### AI

* Gemini API

### Deployment

* Vercel — Frontend
* Render — Backend
* GitHub — Source Control
* Docker — Backend Containerization

---

## Project Structure

```text
Saar-AI/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## API

### Process Document

```http
POST /api/documents/process
```

Accepts a PDF or image file and generates an AI-powered summary.

### Request

```text
Content-Type: multipart/form-data
```

Parameters:

| Parameter       | Type   | Description                     |
| --------------- | ------ | ------------------------------- |
| `file`          | File   | PDF, PNG, JPG, or JPEG document |
| `summaryLength` | String | `SHORT`, `MEDIUM`, or `LONG`    |

### Example

```text
file = document.pdf
summaryLength = MEDIUM
```

### Response

The API returns:

```json
{
  "fileName": "document.pdf",
  "extractedText": "...",
  "summaryLength": "MEDIUM",
  "summary": "...",
  "keyPoints": [],
  "improvementSuggestions": [],
  "pageCount": 5
}
```

---

## Local Setup

### Prerequisites

Make sure you have:

* Java 17
* Maven
* Node.js and npm
* A Gemini API key

---

### 1. Clone the repository

```bash
git clone https://github.com/RahulSharma45-max/Saar-AI.git
cd Saar-AI
```

---

### 2. Configure the Backend

```bash
cd backend
```

Set the Gemini API key as an environment variable.

#### Windows PowerShell

```powershell
$env:GCP_API_KEY="your_api_key"
```

#### Linux/macOS

```bash
export GCP_API_KEY="your_api_key"
```

The backend reads the key through:

```properties
gemini.api.key=${GCP_API_KEY}
```

Start the backend:

```bash
mvn spring-boot:run
```

The backend will run locally on:

```text
http://localhost:8080
```

---

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the local frontend URL in the terminal.

---

## Environment Variables

### Backend

```env
GCP_API_KEY=your_gemini_api_key
```

### Frontend

```env
VITE_API_URL=http://localhost:8080
```

For production, `VITE_API_URL` should point to the deployed Render backend.

**Never commit API keys or other sensitive credentials to GitHub.**

---

## Error Handling

SaarAI includes basic validation and error handling for:

* Unsupported file formats
* Empty files
* Files larger than 10 MB
* PDF extraction failures
* OCR failures
* AI processing failures
* API/network errors

The frontend also provides loading indicators while a document is being processed.

---

## Approach

SaarAI uses a React frontend and Spring Boot backend to provide an end-to-end document summarization workflow. Users upload PDF or image documents through a drag-and-drop interface or file picker. PDF documents are processed using Apache PDFBox, while scanned images are processed using Tess4J/Tesseract OCR. The extracted text is then passed to a Gemini-based AI service, which generates summaries based on the selected length and identifies key points and improvement suggestions. The application includes client-side validation, loading states, error handling, and extracted-text viewing. The frontend and backend are deployed separately using Vercel and Render, while API credentials are managed through environment variables instead of being stored in source code.

---

## Deployment

### Frontend

The React application is deployed on **Vercel**:

https://saar-ai-frontend.vercel.app/

### Backend

The Spring Boot API is deployed on **Render**:

https://saar-ai-backend-m1n6.onrender.com

The frontend communicates with the backend using the `VITE_API_URL` environment variable.

---

## Future Improvements

* Support additional document formats such as DOCX
* Improve PDF formatting preservation
* Add user authentication and document history
* Add downloadable summaries
* Add summary export to PDF/DOCX
* Improve OCR accuracy for complex scanned documents
* Add automated backend and frontend tests
* Add rate limiting and production monitoring

---

## Author

**Rahul Sharma**

B.Tech — Computer Science & Engineering


