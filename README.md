# Gemma — AI Code Exorcist 👻

> **"Your Code Has a Few Ghosts. Let's Find Them."**

Gemma is a full-stack, AI-powered web application that detects bugs, explains errors, suggests actionable fixes, and generates a complete, clean version of submitted programs using Google Gemini (`gemini-3.8-flash`).

---

## 🌟 Key Features

1. **Multi-Language Code Altar & Editor**
   - Supports **Python, JavaScript, TypeScript, Java, C++, C, SQL, HTML, and CSS**.
   - **All PDF formats supported**: Upload PDF files directly (code listings, assignment sheets, bug tickets, error trace documents) with native Gemini multimodal ingestion.
   - **Targeted Problem Typing Section**: Dedicated input area to type the specific problem, symptoms, stack trace, or bug hypothesis with quick-pick symptom chips.
   - Line numbers with synchronized scrolling, tab indentation, and clean monospace styling.
   - File upload supporting `.pdf, .py, .js, .ts, .java, .cpp, .c, .sql, .html, .css, .txt`.
   - Built-in test library with real buggy programs across multiple languages.

2. **Spectral AI Bug Detection**
   - Detects syntax errors, logical defects (off-by-one, infinite loops), runtime traps (null dereference, unhandled async errors), edge cases (zero division), security vulnerabilities (SQL injection, XSS, buffer overruns), and resource leaks.
   - Categorized by **Critical, High, Medium, and Low** severity.
   - Structured diagnostic cards with line numbers, code diffs, root-cause explanations, and suggested remedies.

3. **Two Distinct UI Experiences (Instant Switcher)**
   - **Halloween Mode (Default)**: Deep obsidian & purple aesthetics, glowing neon green and pumpkin orange accents, ghost mascot illustrations, floating animations, and spooky engineering language (*"Exorcise My Code"*, *"Code Hauntings"*, *"Banish This Bug"*, *"Ghost Report"*, *"Cleanse Complete"*).
   - **Normal Mode**: Clean, sleek, high-productivity developer engineering console with standard industry phrasing (*"Analyze Code"*, *"Detected Issues"*, *"Apply Fix"*, *"Analysis Report"*, *"Analysis Complete"*).
   - Selected mode is persisted in `localStorage`.

4. **Interactive Bug Banishment & Live Diff Studio**
   - "Banish This Bug" action on individual findings.
   - Real-time side-by-side or unified diff comparison.
   - Highlights additions in emerald green and deletions in crimson.
   - One-click copy, download corrected source file, or revert back to original.

5. **Certified Exorcism / Analysis Report**
   - Dynamic report reflecting exact number of applied fixes vs remaining warnings.
   - Prominent completion message: `👻 Cleanse Complete! X hauntings removed.`
   - Download as **Markdown (`.md`)** or **Plain Text (`.txt`)**, with print/PDF support.

---

## 🚀 Environment Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Environment Variables
Configure the following in your `.env` file (copied from `.env.example`):

```bash
# GEMINI_API_KEY: Required for live Gemini AI analysis.
# When running inside Google AI Studio, this is automatically injected.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# PORT: (Optional, defaults to 3000)
PORT=3000
```

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server (Express + Vite)
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## 🧪 Included Test Samples

You can instantly test the exorcist using the **"Haunted Samples"** dropdown in the editor:
- **Python**: `checkout_calculator.py` (Mutable default argument, ZeroDivisionError, off-by-one IndexError, file handle resource leak).
- **JavaScript**: `user_service.js` (Missing async await, nested null pointer dereference, loose type coercion).
- **SQL**: `haunted_queries.sql` (Authentication SQL injection, Cartesian product cross-join explosion, unindexed table scan).
- **C++**: `spectral_buffer.cpp` (Unsafe strcpy buffer overrun, missing RAII destructor memory leak, raw pointer allocation leak).

---

## 🔒 Security & Code Integrity

- Submitted user code is treated as strictly untrusted input.
- Code is sent directly to Gemini for static & semantic analysis; code is **never executed or `eval`'d** on the server.
- All Gemini API calls run securely server-side inside `server.ts` using `@google/genai`. Secrets and API keys are never exposed to the client bundle.
