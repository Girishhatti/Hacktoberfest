import React, { useState } from 'react';
import { ThemeMode, BugFinding } from '../types/exorcist';
import { diffLines, Change } from 'diff';
import { Copy, Download, RotateCcw, Check, Columns, AlignJustify, Wand2, ShieldAlert } from 'lucide-react';

interface DiffWorkspaceProps {
  mode: ThemeMode;
  originalCode: string;
  correctedCode: string;
  workingCode: string;
  onRevert: () => void;
  fileName: string;
  appliedFixIds: Set<string>;
  findings: BugFinding[];
  unresolvedIssues: string[];
  onCopyCode: (code: string) => void;
  onDownloadFile: (filename: string, content: string) => void;
}

export const DiffWorkspace: React.FC<DiffWorkspaceProps> = ({
  mode,
  originalCode,
  correctedCode,
  workingCode,
  onRevert,
  fileName,
  appliedFixIds,
  findings,
  unresolvedIssues,
  onCopyCode,
  onDownloadFile,
}) => {
  const isHalloween = mode === 'halloween';
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copied, setCopied] = useState(false);

  // Calculate diff between originalCode and current workingCode
  const diffResult: Change[] = diffLines(originalCode, workingCode);

  const appliedCount = findings.filter((f) => appliedFixIds.has(f.id)).length;
  const totalFindings = findings.length;

  const handleCopy = () => {
    onCopyCode(workingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = fileName.includes('.') ? fileName.split('.').pop() : 'txt';
    const base = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    const downloadName = isHalloween ? `${base}_exorcised.${ext}` : `${base}_cleaned.${ext}`;
    onDownloadFile(downloadName, workingCode);
  };

  const originalLines = originalCode.split('\n');
  const workingLines = workingCode.split('\n');

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
          isHalloween
            ? 'bg-[#120722] border-purple-800/40 text-purple-100'
            : 'bg-[#0f172a] border-slate-800 text-slate-200'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold tabular-nums ${
                isHalloween
                  ? 'bg-green-950/80 text-green-300 border border-green-700/60'
                  : 'bg-blue-950 text-blue-300 border border-blue-800'
              }`}
            >
              {appliedCount} of {totalFindings} {isHalloween ? 'Hauntings Banished' : 'Fixes Applied'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {fileName}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {isHalloween
              ? 'Compare original haunted source with the sanctified code.'
              : 'Review line-by-line differences between original and remediated code.'}
          </p>
        </div>

        {/* View mode toggle & File Actions */}
        <div className="flex items-center gap-2">
          {/* Split / Unified Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                viewMode === 'split'
                  ? isHalloween
                    ? 'bg-purple-900/80 text-green-300 font-semibold'
                    : 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                viewMode === 'unified'
                  ? isHalloween
                    ? 'bg-purple-900/80 text-green-300 font-semibold'
                    : 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Unified Diff</span>
            </button>
          </div>

          {/* Revert Button */}
          <button
            onClick={onRevert}
            title="Revert all fixes back to original code"
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors flex items-center gap-1.5 text-slate-300 hover:text-rose-400 ${
              isHalloween
                ? 'bg-purple-950/40 border-purple-900/40 hover:bg-rose-950/30'
                : 'bg-slate-800 border-slate-700 hover:bg-rose-950/30'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert</span>
          </button>

          {/* Copy Clean Code */}
          <button
            onClick={handleCopy}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold border cursor-pointer transition-colors flex items-center gap-1.5 ${
              isHalloween
                ? 'bg-purple-950 border-purple-700 text-purple-200 hover:text-white hover:bg-purple-900'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Clean Code</span>
              </>
            )}
          </button>

          {/* Download File */}
          <button
            onClick={handleDownload}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow ${
              isHalloween
                ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white hover:from-purple-500 hover:to-green-500 shadow-[0_0_15px_rgba(34,197,94,0.25)]'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Diff Display Container */}
      {viewMode === 'split' ? (
        /* Side by Side Split View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Original Code */}
          <div
            className={`rounded-2xl border flex flex-col overflow-hidden ${
              isHalloween ? 'bg-[#0e061b] border-purple-950' : 'bg-[#090d16] border-slate-800'
            }`}
          >
            <div
              className={`px-4 py-2.5 border-b text-xs font-semibold flex items-center justify-between ${
                isHalloween
                  ? 'bg-rose-950/30 border-rose-900/30 text-rose-300'
                  : 'bg-red-950/20 border-red-900/30 text-red-300'
              }`}
            >
              <span>{isHalloween ? 'Haunted Original Program' : 'Original Source Code'}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {originalLines.length} lines
              </span>
            </div>

            <div className="flex flex-1 max-h-[580px] overflow-auto font-mono text-xs leading-6">
              <div className="w-10 select-none py-3 text-right pr-2 text-slate-600 bg-black/20 shrink-0">
                {originalLines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="p-3 text-slate-300 overflow-x-auto flex-1 whitespace-pre">
                {originalLines.map((line, i) => (
                  <div key={i} className="hover:bg-white/5 px-1 rounded">
                    {line || ' '}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Corrected / Working Code */}
          <div
            className={`rounded-2xl border flex flex-col overflow-hidden ${
              isHalloween ? 'bg-[#091515] border-green-950' : 'bg-[#09121a] border-blue-900/40'
            }`}
          >
            <div
              className={`px-4 py-2.5 border-b text-xs font-semibold flex items-center justify-between ${
                isHalloween
                  ? 'bg-green-950/40 border-green-900/40 text-green-300'
                  : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
              }`}
            >
              <span>{isHalloween ? 'Sanctified / Exorcised Program' : 'Remediated Source Code'}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {workingLines.length} lines
              </span>
            </div>

            <div className="flex flex-1 max-h-[580px] overflow-auto font-mono text-xs leading-6">
              <div className="w-10 select-none py-3 text-right pr-2 text-slate-600 bg-black/20 shrink-0">
                {workingLines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="p-3 text-green-100 overflow-x-auto flex-1 whitespace-pre">
                {workingLines.map((line, i) => (
                  <div key={i} className="hover:bg-green-500/10 px-1 rounded">
                    {line || ' '}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Unified Diff View */
        <div
          className={`rounded-2xl border overflow-hidden ${
            isHalloween ? 'bg-[#0b0515] border-purple-950' : 'bg-[#090d16] border-slate-800'
          }`}
        >
          <div
            className={`px-4 py-2.5 border-b text-xs font-semibold flex items-center justify-between ${
              isHalloween ? 'border-purple-900/40 text-slate-300' : 'border-slate-800 text-slate-300'
            }`}
          >
            <span>Unified Diff Inspection</span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> + Additions
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> - Deletions
              </span>
            </div>
          </div>

          <div className="p-4 font-mono text-xs leading-6 overflow-auto max-h-[600px]">
            {diffResult.map((part, index) => {
              const lines = part.value.split('\n');
              if (lines[lines.length - 1] === '') lines.pop();

              return lines.map((line, lineIdx) => {
                if (part.added) {
                  return (
                    <div
                      key={`${index}-${lineIdx}`}
                      className="bg-emerald-950/40 text-emerald-200 px-2 py-0.5 rounded flex items-start"
                    >
                      <span className="text-emerald-400 select-none w-6 font-bold">+</span>
                      <span className="whitespace-pre flex-1">{line}</span>
                    </div>
                  );
                }
                if (part.removed) {
                  return (
                    <div
                      key={`${index}-${lineIdx}`}
                      className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded flex items-start"
                    >
                      <span className="text-rose-400 select-none w-6 font-bold">-</span>
                      <span className="whitespace-pre flex-1 line-through opacity-80">{line}</span>
                    </div>
                  );
                }
                return (
                  <div
                    key={`${index}-${lineIdx}`}
                    className="text-slate-400 px-2 py-0.5 flex items-start hover:bg-slate-800/30"
                  >
                    <span className="select-none w-6 text-slate-600"> </span>
                    <span className="whitespace-pre flex-1">{line}</span>
                  </div>
                );
              });
            })}
          </div>
        </div>
      )}

      {/* Unresolved Warnings Notice (if any) */}
      {unresolvedIssues.length > 0 && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            isHalloween
              ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
              : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
          }`}
        >
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-semibold text-white">Remaining Developer Decisions:</h4>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              {unresolvedIssues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
