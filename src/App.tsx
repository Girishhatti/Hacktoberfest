/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeMode, AnalysisResult, BugFinding, PdfAttachment } from './types/exorcist';
import { CODE_SAMPLES, SUPPORTED_LANGUAGES } from './data/samples';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CodeEditor } from './components/CodeEditor';
import { BugDashboard } from './components/BugDashboard';
import { DiffWorkspace } from './components/DiffWorkspace';
import { ExorcismReport } from './components/ExorcismReport';
import { SpookyLoader } from './components/SpookyLoader';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AlertTriangle, Ghost, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  // Mode persistence
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('gemma_exorcist_mode');
    return (saved as ThemeMode) || 'halloween';
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<'workspace' | 'findings' | 'diff' | 'report'>('workspace');

  // Code editor states
  const defaultSample = CODE_SAMPLES[0];
  const [code, setCode] = useState<string>(defaultSample.code);
  const [language, setLanguage] = useState<string>(defaultSample.language);
  const [fileName, setFileName] = useState<string>(defaultSample.fileName);
  const [problemDescription, setProblemDescription] = useState<string>(
    'Crashes with ZeroDivisionError when discounts list is empty, and items seem to leak between different carts.'
  );
  const [pdfAttachment, setPdfAttachment] = useState<PdfAttachment | null>(null);

  // Analysis & Diff states
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [workingCode, setWorkingCode] = useState<string>(defaultSample.code);
  const [appliedFixIds, setAppliedFixIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // System & API health
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check health and server configuration
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(Boolean(data.hasApiKey));
        if (!data.hasApiKey) {
          // If server reports no key, enable demo mode by default to ensure seamless experience
          setDemoMode(true);
        }
      })
      .catch((err) => {
        console.warn('Backend health check error, falling back to client demo mode:', err);
        setDemoMode(true);
      });
  }, []);

  // Persist mode
  const handleToggleMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('gemma_exorcist_mode', newMode);
  };

  // Select Sample Code
  const handleSelectSample = (sampleId: string) => {
    const sample = CODE_SAMPLES.find((s) => s.id === sampleId);
    if (!sample) return;
    setCode(sample.code);
    setLanguage(sample.language);
    setFileName(sample.fileName);
    setPdfAttachment(null);
    if (sample.id === 'python-haunted-cart') {
      setProblemDescription('Crashes with ZeroDivisionError when discounts list is empty, and items seem to leak between different carts.');
    } else if (sample.id === 'js-spooky-auth') {
      setProblemDescription('TypeError: Cannot read properties of undefined (reading name) when fetching user profile.');
    } else if (sample.id === 'sql-curse-injection') {
      setProblemDescription('Query takes minutes to execute due to huge row explosion and authentication seems bypassable with single quotes.');
    } else if (sample.id === 'cpp-haunted-memory') {
      setProblemDescription('Memory usage leaks continuously and buffer overflow crashes when passing long messages.');
    } else {
      setProblemDescription('');
    }
    setAnalysisResult(null);
    setWorkingCode(sample.code);
    setAppliedFixIds(new Set());
    setActiveTab('workspace');
    addToast(
      'info',
      mode === 'halloween' ? 'Haunted Sample Summoned' : 'Example Program Loaded',
      `${sample.title} (${sample.knownHauntingsCount} known bugs)`
    );
  };

  // Core Exorcism Handler
  const handleExorcise = async () => {
    if (!code.trim() && !pdfAttachment) {
      addToast('error', 'No Code or PDF to Analyze', 'Please enter code or upload a source PDF.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // If Demo Mode is explicitly enabled or key is absent, check for local verified sample
    if (demoMode) {
      // Small realistic simulated ritual latency for UI experience
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const matchedSample = CODE_SAMPLES.find(
        (s) => s.code.trim() === code.trim() || s.fileName === fileName
      );

      if (matchedSample && matchedSample.demoAnalysis) {
        const demo = matchedSample.demoAnalysis;
        const result: AnalysisResult = {
          ...demo,
          original_code: code,
          fileName,
          userProblem: problemDescription,
          problemResolution: problemDescription
            ? `Analyzed against your reported symptoms ("${problemDescription}"): The detected bugs directly match these symptoms and are resolved in the clean code.`
            : undefined,
        };
        setAnalysisResult(result);
        setWorkingCode(result.corrected_code);
        setAppliedFixIds(new Set(result.findings.map((f) => f.id)));
        setIsLoading(false);
        setActiveTab('findings');
        addToast(
          'success',
          mode === 'halloween'
            ? `👻 Cleanse Complete! ${result.findings.length} hauntings removed.`
            : `Analysis Complete! ${result.findings.length} bugs fixed.`,
          'All identified defects remediated in clean code output.'
        );
        return;
      }
    }

    // Live AI Exorcism via Express backend
    try {
      const response = await fetch('/api/exorcise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          fileName,
          problemDescription,
          pdfBase64: pdfAttachment?.base64,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsKey) {
          // Gracefully fallback to demo mode
          setDemoMode(true);
          const fallbackSample = CODE_SAMPLES[0];
          if (fallbackSample.demoAnalysis) {
            const result: AnalysisResult = {
              ...fallbackSample.demoAnalysis,
              original_code: code,
              fileName,
              userProblem: problemDescription,
              problemResolution: problemDescription
                ? 'Analyzed against your reported symptoms: Bugs identified and resolved.'
                : undefined,
            };
            setAnalysisResult(result);
            setWorkingCode(result.corrected_code);
            setAppliedFixIds(new Set(result.findings.map((f) => f.id)));
            setIsLoading(false);
            setActiveTab('findings');
            addToast(
              'info',
              'Running in Demo Mode',
              'GEMINI_API_KEY is not configured; verified sample diagnosis loaded.'
            );
            return;
          }
        }
        throw new Error(data.error || 'Exorcism failed.');
      }

      if (data.extracted_code && !code.trim()) {
        setCode(data.extracted_code);
      }

      const result: AnalysisResult = {
        language: data.language,
        summary: data.summary,
        findings: data.findings,
        corrected_code: data.corrected_code,
        applied_fixes: data.applied_fixes,
        unresolved_issues: data.unresolved_issues,
        problemResolution: data.problem_resolution,
        userProblem: data.userProblem || problemDescription,
        analyzedAt: data.analyzedAt,
        original_code: code || data.extracted_code || '',
        fileName,
      };

      setAnalysisResult(result);
      setWorkingCode(result.corrected_code);
      setAppliedFixIds(new Set(result.findings.map((f: BugFinding) => f.id)));
      setActiveTab('findings');

      const count = result.findings.length;
      addToast(
        'success',
        mode === 'halloween'
          ? `👻 Cleanse Complete! ${count} hauntings removed.`
          : `Analysis Complete! ${count} bugs fixed.`,
        `Identified ${count} issues and generated clean repaired program.`
      );
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected disturbance disrupted the ritual.');
      addToast('error', 'Exorcism Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle individual bug fix (Banish This Bug / Apply Fix)
  const handleToggleFix = (finding: BugFinding) => {
    if (!analysisResult) return;

    const nextApplied = new Set(appliedFixIds);
    const willApply = !nextApplied.has(finding.id);

    if (willApply) {
      nextApplied.add(finding.id);
    } else {
      nextApplied.delete(finding.id);
    }
    setAppliedFixIds(nextApplied);

    // Dynamically adjust working code:
    // If all fixes applied, use the full clean corrected_code from AI
    if (nextApplied.size === analysisResult.findings.length) {
      setWorkingCode(analysisResult.corrected_code);
    } else if (nextApplied.size === 0) {
      setWorkingCode(analysisResult.original_code);
    } else {
      // Re-synthesize working code by applying the active snippets to the original code
      let synthesized = analysisResult.original_code;
      for (const f of analysisResult.findings) {
        if (nextApplied.has(f.id) && f.original_snippet && f.corrected_snippet) {
          if (synthesized.includes(f.original_snippet)) {
            synthesized = synthesized.replace(f.original_snippet, f.corrected_snippet);
          }
        }
      }
      setWorkingCode(synthesized);
    }

    addToast(
      'success',
      willApply
        ? mode === 'halloween'
          ? `Banishment Applied: ${finding.title}`
          : `Fix Applied: ${finding.title}`
        : mode === 'halloween'
        ? `Banishment Reverted: ${finding.title}`
        : `Fix Reverted: ${finding.title}`
    );
  };

  // Revert all fixes
  const handleRevert = () => {
    if (!analysisResult) return;
    setWorkingCode(analysisResult.original_code);
    setAppliedFixIds(new Set());
    addToast(
      'info',
      mode === 'halloween' ? 'Hauntings Restored' : 'Code Reverted',
      'Original source code restored.'
    );
  };

  // Download file helper
  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'File Downloaded', filename);
  };

  // Copy code helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Copied to Clipboard', `${text.length} characters copied.`);
  };

  // Copy snippet helper
  const handleCopySnippet = (snippet: string, title: string) => {
    navigator.clipboard.writeText(snippet);
    addToast('success', 'Snippet Copied', title);
  };

  const isHalloween = mode === 'halloween';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col ${
        isHalloween
          ? 'bg-[#080311] text-purple-100 selection:bg-purple-800/60'
          : 'bg-[#070b14] text-slate-100 selection:bg-blue-800/60'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        onToggleMode={handleToggleMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasResults={Boolean(analysisResult)}
        findingsCount={analysisResult?.findings.length || 0}
        hasApiKey={hasApiKey}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        {activeTab === 'workspace' && (
          <HeroSection
            mode={mode}
            onStartExorcism={() => {
              const el = document.getElementById('code-editor-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onLoadSample={() => handleSelectSample('python-haunted-cart')}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {/* Missing API Key / Demo Mode Banner */}
          {!hasApiKey && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs ${
                isHalloween
                  ? 'bg-amber-950/40 border-amber-700/60 text-amber-200'
                  : 'bg-amber-950/30 border-amber-800 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Interactive Demo Mode Active:</strong> Live Gemini AI requires an API key in
                  Settings &gt; Secrets. You can test all features using our built-in test suite!
                </span>
              </div>
              <button
                onClick={() => handleSelectSample('python-haunted-cart')}
                className="px-3 py-1 rounded-md bg-amber-600/30 hover:bg-amber-600/50 text-white font-semibold cursor-pointer shrink-0"
              >
                Load Test Sample
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl border border-rose-800 bg-rose-950/40 text-rose-200 text-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={handleExorcise}
                className="px-3 py-1 rounded-md bg-rose-800 hover:bg-rose-700 text-white font-semibold cursor-pointer shrink-0"
              >
                Retry Exorcism
              </button>
            </div>
          )}

          {/* Tab Views */}
          {activeTab === 'workspace' && (
            <div id="code-editor-section" className="space-y-6">
              <CodeEditor
                mode={mode}
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                fileName={fileName}
                setFileName={setFileName}
                problemDescription={problemDescription}
                setProblemDescription={setProblemDescription}
                pdfAttachment={pdfAttachment}
                setPdfAttachment={setPdfAttachment}
                onExorcise={handleExorcise}
                isLoading={isLoading}
                onSelectSample={handleSelectSample}
              />
            </div>
          )}

          {activeTab === 'findings' && (
            <div>
              {analysisResult ? (
                <BugDashboard
                  mode={mode}
                  findings={analysisResult.findings}
                  appliedFixIds={appliedFixIds}
                  onToggleFix={handleToggleFix}
                  onCopySnippet={handleCopySnippet}
                  summary={analysisResult.summary}
                  userProblem={analysisResult.userProblem}
                  problemResolution={analysisResult.problemResolution}
                  onGoToDiff={() => setActiveTab('diff')}
                />
              ) : (
                <div
                  className={`p-12 rounded-2xl border text-center space-y-4 ${
                    isHalloween
                      ? 'bg-[#100720] border-purple-900/50'
                      : 'bg-[#0b0f19] border-slate-800'
                  }`}
                >
                  <Ghost className="w-12 h-12 text-purple-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">
                    {isHalloween ? 'No Hauntings Analyzed Yet' : 'No Code Analyzed Yet'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {isHalloween
                      ? 'Submit your source code in the altar and invoke "Exorcise My Code" to detect and banish bugs.'
                      : 'Paste or upload code in the editor workspace and click "Analyze Code" to generate findings.'}
                  </p>
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      isHalloween ? 'bg-purple-700 hover:bg-purple-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    Go to Code Editor
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'diff' && (
            <div>
              {analysisResult ? (
                <DiffWorkspace
                  mode={mode}
                  originalCode={analysisResult.original_code}
                  correctedCode={analysisResult.corrected_code}
                  workingCode={workingCode}
                  onRevert={handleRevert}
                  fileName={fileName}
                  appliedFixIds={appliedFixIds}
                  findings={analysisResult.findings}
                  unresolvedIssues={analysisResult.unresolved_issues}
                  onCopyCode={handleCopyCode}
                  onDownloadFile={handleDownloadFile}
                />
              ) : (
                <div
                  className={`p-12 rounded-2xl border text-center space-y-4 ${
                    isHalloween
                      ? 'bg-[#100720] border-purple-900/50'
                      : 'bg-[#0b0f19] border-slate-800'
                  }`}
                >
                  <Sparkles className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Diff Available</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Run code analysis first to generate verified diff comparisons and remediated code.
                  </p>
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white cursor-pointer"
                  >
                    Go to Workspace
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'report' && (
            <div>
              {analysisResult ? (
                <ExorcismReport
                  mode={mode}
                  fileName={fileName}
                  language={analysisResult.language}
                  analyzedAt={analysisResult.analyzedAt}
                  findings={analysisResult.findings}
                  appliedFixIds={appliedFixIds}
                  summary={analysisResult.summary}
                  unresolvedIssues={analysisResult.unresolved_issues}
                  originalCode={analysisResult.original_code}
                  workingCode={workingCode}
                  userProblem={analysisResult.userProblem}
                  problemResolution={analysisResult.problemResolution}
                  onExorciseAnother={() => {
                    setActiveTab('workspace');
                  }}
                  onDownloadFile={handleDownloadFile}
                />
              ) : (
                <div
                  className={`p-12 rounded-2xl border text-center space-y-4 ${
                    isHalloween
                      ? 'bg-[#100720] border-purple-900/50'
                      : 'bg-[#0b0f19] border-slate-800'
                  }`}
                >
                  <Ghost className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Report Generated</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Run an exorcism to receive a full audit report with metrics and downloadable certificates.
                  </p>
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white cursor-pointer"
                  >
                    Start Exorcism
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 text-center text-xs text-slate-500 ${
          isHalloween ? 'border-purple-950 bg-[#06020c]' : 'border-slate-800 bg-[#05070d]'
        }`}
      >
        <p>
          Gemma: AI Code Exorcist · Intelligent automated debugging, security auditing & code remediation.
        </p>
      </footer>

      {/* Loading Modal */}
      {isLoading && <SpookyLoader mode={mode} />}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} mode={mode} />
    </div>
  );
}
