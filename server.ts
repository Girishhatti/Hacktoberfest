import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI SDK as per gemini-api guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    model: 'gemini-3.8-flash',
  });
});

// Code Exorcism / Analysis Endpoint
app.post('/api/exorcise', async (req, res) => {
  try {
    const { code, language, fileName, problemDescription, pdfBase64 } = req.body;

    if ((!code || typeof code !== 'string' || !code.trim()) && !pdfBase64) {
      return res.status(400).json({ error: 'Please provide source code or upload a code PDF document for analysis.' });
    }

    if (code && code.length > 100000) {
      return res.status(400).json({ error: 'Code size exceeds maximum limit of 100KB.' });
    }

    const lang = (language || 'plaintext').trim();
    const targetFile = fileName || `source.${lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : lang === 'typescript' ? 'ts' : 'txt'}`;

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please configure your key in Settings > Secrets or enable Demo Mode.',
        needsKey: true,
      });
    }

    const systemInstruction = `You are "Gemma: The AI Code Exorcist" — a world-class principal software engineer, security auditor, and compiler specialist.
Your mission is to perform deep, rigorous static and semantic analysis on the user's submitted source code or uploaded PDF document in ${lang}.

Special User Input:
- The user may specify a "problemDescription" describing the specific symptoms, bug hypotheses, expected vs actual behavior, or errors they observed.
- The user may attach a PDF file (e.g. source code export, homework specification, error log document, bug ticket, or code listing).
- If a PDF is provided and code is not fully in the text editor, extract the complete program from the PDF and analyze it thoroughly.
- Explicitly diagnose whether and how the user's reported problem manifests in the code and provide a targeted "problem_resolution".

Requirements:
1. Detect real, concrete bugs across:
   - Syntax errors and typos.
   - Logical bugs (off-by-one errors, infinite loops, inverted conditions, bad state updates).
   - Potential runtime errors (null/undefined dereferences, unhandled exceptions/rejections, missing returns).
   - Edge cases (division by zero, empty collections, integer overflow, boundary values).
   - Security vulnerabilities (SQL injection, XSS, insecure deserialization, unsafe secrets/eval, resource leaks).
   - Performance bottlenecks (unnecessary re-renders, O(N^2) lookups where O(1) suffices, unindexed queries).
2. For each finding:
   - Provide a unique ID (e.g. "bug-1", "bug-2").
   - Title: concise descriptive title.
   - Line: approximate 1-based line number in the original code where the issue starts.
   - Category: one of 'syntax', 'logic', 'runtime', 'security', 'performance', 'edge_case'.
   - Severity: one of 'critical', 'high', 'medium', 'low'.
   - Explanation: clear, pedagogical explanation of why this bug occurs and what catastrophe it causes.
   - Suggested fix: plain instructions on how to remedy it.
   - Original snippet: the exact snippet from the submitted code containing the flaw.
   - Corrected snippet: the precise, clean replacement code for that snippet.
3. Generate a FULL, COMPLETE "corrected_code":
   - This must be the entire corrected source code of the program, fully runnable, formatted, preserving comments and intended business logic, with all confident fixes applied.
   - Do NOT omit code with placeholders like "// rest of code remains the same". Provide the complete program from start to finish.
4. "applied_fixes": Array of string descriptions matching the findings that are safely fixed in corrected_code.
5. "unresolved_issues": Array of string warnings or edge cases requiring manual user domain decisions.
6. "problem_resolution": Concise explanation directly answering the user's problem description and confirming whether it is resolved.
7. "summary": A scannable 2-4 sentence executive summary of the code's health, major hauntings banished, and runtime stability improvements.
8. Grounding: Avoid speculative issues. Only report confirmed or highly probable flaws.`;

    let userPromptText = `Target File: ${targetFile}\nLanguage: ${lang}\n`;
    if (problemDescription && problemDescription.trim()) {
      userPromptText += `\nUser's Reported Problem / Symptoms / Bug Hypothesis:\n"""\n${problemDescription.trim()}\n"""\n`;
    }

    if (code && code.trim()) {
      userPromptText += `\nSource Code to Exorcise:\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    } else {
      userPromptText += `\nPlease extract the complete source code from the attached PDF document and analyze all bugs in it.\n`;
    }

    const parts: any[] = [];
    if (pdfBase64 && typeof pdfBase64 === 'string') {
      // Strip data url header if present
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        },
      });
    }

    parts.push({ text: userPromptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING },
            summary: { type: Type.STRING },
            extracted_code: {
              type: Type.STRING,
              description: "The complete source code extracted from the PDF if no code was pasted in editor",
            },
            problem_resolution: {
              type: Type.STRING,
              description: "Direct response to the user's typed problem description",
            },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  line: { type: Type.INTEGER },
                  category: {
                    type: Type.STRING,
                    description: "One of: syntax, logic, runtime, security, performance, edge_case",
                  },
                  severity: {
                    type: Type.STRING,
                    description: "One of: critical, high, medium, low",
                  },
                  explanation: { type: Type.STRING },
                  suggested_fix: { type: Type.STRING },
                  original_snippet: { type: Type.STRING },
                  corrected_snippet: { type: Type.STRING },
                },
                required: [
                  'id',
                  'title',
                  'line',
                  'category',
                  'severity',
                  'explanation',
                  'suggested_fix',
                  'original_snippet',
                  'corrected_snippet',
                ],
              },
            },
            corrected_code: { type: Type.STRING },
            applied_fixes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            unresolved_issues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['summary', 'findings', 'corrected_code', 'applied_fixes', 'unresolved_issues'],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);

    // Normalize IDs and categories if model varied
    const findings = (parsedData.findings || []).map((f: any, idx: number) => ({
      id: f.id || `haunting-${idx + 1}`,
      title: f.title || `Issue #${idx + 1}`,
      line: typeof f.line === 'number' && f.line > 0 ? f.line : 1,
      category: ['syntax', 'logic', 'runtime', 'security', 'performance', 'edge_case'].includes(f.category?.toLowerCase())
        ? f.category.toLowerCase()
        : 'logic',
      severity: ['critical', 'high', 'medium', 'low'].includes(f.severity?.toLowerCase())
        ? f.severity.toLowerCase()
        : 'medium',
      explanation: f.explanation || 'Anomalous behavior detected in this code block.',
      suggested_fix: f.suggested_fix || 'Apply verified bug fix.',
      original_snippet: f.original_snippet || '',
      corrected_snippet: f.corrected_snippet || '',
    }));

    return res.json({
      success: true,
      language: parsedData.language || lang,
      summary: parsedData.summary || 'Code exorcism complete.',
      findings,
      extracted_code: parsedData.extracted_code || '',
      corrected_code: parsedData.corrected_code || code,
      applied_fixes: parsedData.applied_fixes || findings.map((f: any) => f.title),
      unresolved_issues: parsedData.unresolved_issues || [],
      problem_resolution: parsedData.problem_resolution || (problemDescription ? 'Analyzed against your reported symptoms.' : undefined),
      userProblem: problemDescription || undefined,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during code exorcism:', error);
    return res.status(500).json({
      error: error.message || 'The exorcism ritual encountered an unexpected disturbance. Please retry.',
    });
  }
});

// In development, hook up Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Gemma Code Exorcist server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
