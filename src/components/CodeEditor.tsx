import React, { useRef, useState } from 'react';
import { ThemeMode, LanguageOption, PdfAttachment } from '../types/exorcist';
import { SUPPORTED_LANGUAGES, CODE_SAMPLES } from '../data/samples';
import {
  Upload,
  Trash2,
  Wand2,
  Sparkles,
  FileCode,
  FileText,
  ChevronDown,
  X,
  MessageSquareWarning,
  Flame,
  FilePlus,
  HelpCircle,
  Bug,
  CornerDownLeft,
} from 'lucide-react';

interface CodeEditorProps {
  mode: ThemeMode;
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
  problemDescription: string;
  setProblemDescription: (desc: string) => void;
  pdfAttachment: PdfAttachment | null;
  setPdfAttachment: (att: PdfAttachment | null) => void;
  onExorcise: () => void;
  isLoading: boolean;
  onSelectSample: (sampleId: string) => void;
}

const COMMON_SYMPTOMS = [
  'Crashes with ZeroDivision / null reference',
  'Off-by-one / loop boundary exception',
  'Memory leak / unclosed resource descriptor',
  'Unhandled async promise rejection',
  'SQL injection / security vulnerability',
  'Incorrect calculation or return value',
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  mode,
  code,
  setCode,
  language,
  setLanguage,
  fileName,
  setFileName,
  problemDescription,
  setProblemDescription,
  pdfAttachment,
  setPdfAttachment,
  onExorcise,
  isLoading,
  onSelectSample,
}) => {
  const isHalloween = mode === 'halloween';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handlePromptKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (code.trim() || pdfAttachment)) {
        onExorcise();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Support Ctrl+Enter / Cmd+Enter to execute analysis from code editor
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && (code.trim() || pdfAttachment)) {
        onExorcise();
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = '';
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    // Check if uploaded file is a PDF
    if (file.type === 'application/pdf' || ext === '.pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPdfAttachment({
          name: file.name,
          size: file.size,
          base64: base64,
        });
      };
      reader.readAsDataURL(file);
      return;
    }

    // Standard code file
    const matchedLang = SUPPORTED_LANGUAGES.find((l) => l.extension === ext);
    if (matchedLang) {
      setLanguage(matchedLang.id);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content !== undefined) {
        setCode(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* SECTION: Problem Description Input (Targeted Bug Hunter) */}
      <div
        className={`rounded-2xl border p-4 transition-all ${
          isHalloween
            ? 'bg-[#120722] border-purple-800/50 shadow-[0_4px_20px_rgba(18,7,34,0.5)]'
            : 'bg-[#0f172a] border-slate-800 shadow-md'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isHalloween ? (
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            ) : (
              <MessageSquareWarning className="w-4 h-4 text-blue-400" />
            )}
            <label className="text-xs font-bold text-white uppercase tracking-wider">
              {isHalloween
                ? 'Whisper Your Curse · Describe the Bug Symptoms / Problem'
                : 'Problem Description · Describe Bug Symptoms, Expected Behavior, or Error Messages'}
            </label>
          </div>

          {problemDescription && (
            <button
              onClick={() => setProblemDescription('')}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Clear problem
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 mb-2.5">
          {isHalloween
            ? 'Tell Gemma what sinister malfunction haunts your execution (e.g. error trace, zero division, or unexpected crash).'
            : 'Provide context on the bug you are investigating (e.g., input values that trigger the failure, stack trace, or expected output).'}
        </p>

        <div className="relative">
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            onKeyDown={handlePromptKeyDown}
            rows={2}
            placeholder={
              isHalloween
                ? 'Type your bug prompt or symptoms here... Press Enter ↵ to Exorcise (Shift+Enter for new line)'
                : 'Type your bug description or question here... Press Enter ↵ to Analyze (Shift+Enter for new line)'
            }
            className={`w-full p-3 pr-24 rounded-xl border text-xs sm:text-sm font-sans focus:outline-none transition-all resize-y ${
              isHalloween
                ? 'bg-[#0b0416] border-purple-900/60 text-purple-100 placeholder:text-purple-900/80 focus:border-green-400'
                : 'bg-[#090d16] border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-blue-400'
            }`}
          />

          {/* Quick inline Enter action button */}
          <div className="absolute right-2 bottom-3 flex items-center">
            <button
              type="button"
              onClick={onExorcise}
              disabled={isLoading || (!code.trim() && !pdfAttachment)}
              title="Press Enter to submit prompt"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow disabled:opacity-40 disabled:cursor-not-allowed ${
                isHalloween
                  ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white hover:from-purple-500 hover:to-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
              }`}
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>Enter ↵</span>
            </button>
          </div>
        </div>

        {/* Enter shortcut prompt hint and quick chips */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
              <Bug className="w-3 h-3 text-slate-500" />
              <span>Quick symptoms:</span>
            </span>
            {COMMON_SYMPTOMS.map((symptom, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (problemDescription.trim()) {
                    setProblemDescription(`${problemDescription.trim()}, ${symptom.toLowerCase()}`);
                  } else {
                    setProblemDescription(symptom);
                  }
                }}
                className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                  isHalloween
                    ? 'bg-purple-950/60 border-purple-800/60 text-purple-200 hover:bg-purple-900 hover:text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                + {symptom}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-slate-700 text-slate-300">
              Enter ↵
            </kbd>
            <span>{isHalloween ? 'exorcise' : 'analyze'}</span>
            <span className="text-slate-600">·</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-slate-700 text-slate-400">
              Shift + Enter
            </kbd>
            <span>new line</span>
          </div>
        </div>
      </div>

      {/* PDF Attachment Notice (if PDF is uploaded) */}
      {pdfAttachment && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
            isHalloween
              ? 'bg-purple-950/60 border-purple-700/80 text-purple-200'
              : 'bg-blue-950/40 border-blue-800 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isHalloween ? 'bg-purple-900 text-orange-400' : 'bg-blue-900 text-blue-300'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono">{pdfAttachment.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-black/40 text-slate-300">
                  {formatFileSize(pdfAttachment.size)}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded">
                  PDF Attached
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Gemini 3.8 will analyze this PDF document and cross-reference code and specifications directly.
              </p>
            </div>
          </div>

          <button
            onClick={() => setPdfAttachment(null)}
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Remove attached PDF"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION: Code Editor Altar */}
      <div
        className={`rounded-2xl border transition-all flex flex-col ${
          isHalloween
            ? 'bg-[#0f071d] border-purple-900/50 shadow-[0_4px_25px_rgba(15,7,29,0.7)]'
            : 'bg-[#0b0f19] border-slate-800 shadow-lg'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Editor Header Bar */}
        <div
          className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
            isHalloween ? 'border-purple-900/40 bg-[#160b2b]/60' : 'border-slate-800 bg-[#0e1424]/60'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value;
                  setLanguage(newLang);
                  const opt = SUPPORTED_LANGUAGES.find((l) => l.id === newLang);
                  if (opt && fileName.includes('.')) {
                    const base = fileName.split('.')[0];
                    setFileName(`${base}${opt.extension}`);
                  }
                }}
                className={`text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border appearance-none cursor-pointer focus:outline-none transition-colors ${
                  isHalloween
                    ? 'bg-purple-950/80 border-purple-700/60 text-purple-200 focus:border-green-400'
                    : 'bg-slate-800 border-slate-700 text-slate-200 focus:border-blue-400'
                }`}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-slate-900 text-white">
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>

            {/* Current file name */}
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              {fileName}
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {/* Sample code dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors flex items-center gap-1.5 ${
                  isHalloween
                    ? 'bg-purple-950/50 border-purple-800/60 text-slate-300 hover:text-white hover:bg-purple-900/40'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                <span>{isHalloween ? 'Haunted Samples' : 'Samples'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showSampleDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-xl border shadow-2xl z-40 p-1.5 backdrop-blur-xl ${
                    isHalloween
                      ? 'bg-[#180c30] border-purple-700/80 text-slate-200'
                      : 'bg-[#0f172a] border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isHalloween ? 'Summon Cursed Sample' : 'Select Example Program'}
                  </div>
                  {CODE_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onSelectSample(sample.id);
                        setShowSampleDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors flex items-start justify-between gap-2 ${
                        isHalloween ? 'hover:bg-purple-900/60' : 'hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-white">{sample.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{sample.description}</p>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isHalloween ? 'bg-purple-950 text-orange-400' : 'bg-slate-800 text-blue-300'
                        }`}
                      >
                        {sample.knownHauntingsCount} bugs
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upload PDF Button */}
            <input
              type="file"
              ref={pdfInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,application/pdf"
            />
            <button
              onClick={() => pdfInputRef.current?.click()}
              title="Upload code PDF or assignment document (all formats supported)"
              className={`text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors flex items-center gap-1.5 ${
                isHalloween
                  ? 'bg-purple-950/60 border-purple-700 text-orange-300 hover:text-white hover:bg-purple-900/60'
                  : 'bg-blue-950/60 border-blue-700 text-blue-200 hover:text-white hover:bg-blue-900/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              <span>Upload PDF</span>
            </button>

            {/* Upload Source Code File Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.py,.js,.ts,.jsx,.tsx,.java,.cpp,.c,.h,.hpp,.sql,.html,.css,.txt"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload source file from disk"
              className={`text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors flex items-center gap-1.5 ${
                isHalloween
                  ? 'bg-purple-950/50 border-purple-800/60 text-slate-300 hover:text-white hover:bg-purple-900/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Upload Code</span>
            </button>

            {/* Clear Code */}
            <button
              onClick={() => {
                setCode('');
                setPdfAttachment(null);
                setFileName(`program.${SUPPORTED_LANGUAGES.find((l) => l.id === language)?.extension.replace('.', '') || 'txt'}`);
              }}
              title="Clear editor contents"
              className={`text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors flex items-center gap-1.5 text-slate-400 hover:text-rose-400 ${
                isHalloween
                  ? 'bg-purple-950/30 border-purple-900/40 hover:bg-rose-950/30'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-rose-950/30'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="relative flex-1 min-h-[380px] max-h-[540px] flex overflow-hidden">
          {/* Line Numbers Gutter */}
          <div
            ref={lineNumbersRef}
            aria-hidden="true"
            className={`w-12 select-none py-4 text-right pr-3 font-mono text-xs leading-6 overflow-hidden shrink-0 border-r ${
              isHalloween
                ? 'bg-[#0d061a] border-purple-950 text-purple-700'
                : 'bg-[#090d16] border-slate-900 text-slate-600'
            }`}
          >
            {Array.from({ length: Math.max(lineCount, 16) }).map((_, idx) => (
              <div key={idx} className="tabular-nums">
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code Input Area */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder={
              isHalloween
                ? '// Paste your haunted source code here...\n// Or upload any source file / PDF above to witness the exorcism!'
                : '// Paste or upload source code (or PDF document) here for automated analysis and repair...'
            }
            spellCheck={false}
            className={`flex-1 p-4 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none bg-transparent overflow-auto ${
              isHalloween
                ? 'text-purple-100 placeholder:text-purple-900/70 selection:bg-purple-800/60'
                : 'text-slate-100 placeholder:text-slate-600 selection:bg-blue-800/60'
            }`}
          />

          {/* Drag Over Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-purple-950/90 backdrop-blur-sm border-2 border-dashed border-green-400 flex flex-col items-center justify-center z-30">
              <Upload className="w-10 h-10 text-green-400 animate-bounce mb-2" />
              <p className="text-sm font-semibold text-white">Drop your source code or PDF file here</p>
              <p className="text-xs text-purple-300 mt-1">Supports code files and all PDF formats</p>
            </div>
          )}
        </div>

        {/* Editor Footer & Primary CTA Bar */}
        <div
          className={`px-4 py-3 border-t flex flex-wrap items-center justify-between gap-3 ${
            isHalloween ? 'border-purple-900/40 bg-[#140a28]/80' : 'border-slate-800 bg-[#0e1424]/80'
          }`}
        >
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span>{lineCount} lines</span>
            <span>{code.length} chars</span>
            <span className="hidden sm:inline capitalize">{language}</span>
            {pdfAttachment && (
              <span className="text-emerald-400 font-bold hidden md:inline">
                + PDF: {pdfAttachment.name}
              </span>
            )}
          </div>

          {/* Exorcise Button */}
          <button
            onClick={onExorcise}
            disabled={isLoading || (!code.trim() && !pdfAttachment)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all flex items-center gap-2.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              isHalloween
                ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-green-600 hover:from-purple-500 hover:to-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isHalloween ? 'Exorcising Demons...' : 'Analyzing Code & PDF...'}</span>
              </>
            ) : (
              <>
                {isHalloween ? (
                  <Wand2 className="w-4 h-4 text-green-300 animate-pulse" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isHalloween ? 'Exorcise My Code' : 'Analyze Code'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
