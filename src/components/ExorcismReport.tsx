import React, { useState } from 'react';
import { ThemeMode, BugFinding } from '../types/exorcist';
import { Download, FileText, Printer, CheckCircle2, AlertCircle, Ghost, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExorcismReportProps {
  mode: ThemeMode;
  fileName: string;
  language: string;
  analyzedAt: string;
  findings: BugFinding[];
  appliedFixIds: Set<string>;
  summary: string;
  unresolvedIssues: string[];
  originalCode: string;
  workingCode: string;
  userProblem?: string;
  problemResolution?: string;
  onExorciseAnother: () => void;
  onDownloadFile: (filename: string, content: string) => void;
}

export const ExorcismReport: React.FC<ExorcismReportProps> = ({
  mode,
  fileName,
  language,
  analyzedAt,
  findings,
  appliedFixIds,
  summary,
  unresolvedIssues,
  originalCode,
  workingCode,
  userProblem,
  problemResolution,
  onExorciseAnother,
  onDownloadFile,
}) => {
  const isHalloween = mode === 'halloween';
  const totalFindings = findings.length;
  const appliedCount = findings.filter((f) => appliedFixIds.has(f.id)).length;
  const remainingCount = totalFindings - appliedCount;

  // Trigger celebratory confetti on view if all hauntings/bugs applied
  React.useEffect(() => {
    if (appliedCount > 0 && appliedCount === totalFindings) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: isHalloween ? ['#a855f7', '#22c55e', '#f97316'] : ['#3b82f6', '#10b981', '#6366f1'],
        });
      } catch {
        // safely ignore in non-browser envs
      }
    }
  }, [appliedCount, totalFindings, isHalloween]);

  const generateMarkdownReport = () => {
    const timestamp = new Date(analyzedAt).toLocaleString();
    return `# ${isHalloween ? 'Gemma AI Code Exorcism Report 👻' : 'Gemma Code Diagnostic & Remediation Report'}

**Project/File:** \`${fileName}\`  
**Language:** ${language}  
**Date & Time:** ${timestamp}  
**Status:** ${
      appliedCount === totalFindings
        ? isHalloween
          ? 'CLEANSE COMPLETE (ALL HAUNTINGS BANISHED)'
          : 'CLEANSE COMPLETE (ALL DEFECTS REMEDIATED)'
        : `${appliedCount}/${totalFindings} FIXES APPLIED`
    }

---

## Executive Summary
${summary}

${
  userProblem
    ? `---

## Investigated User Problem & Symptoms
**Reported Problem:** "${userProblem}"  
**Diagnosis & Resolution:** ${problemResolution || 'Remediated through automated patches.'}
`
    : ''
}
---

## Exorcism Metrics
- **Identified Issues:** ${totalFindings}
- **Proposed Fixes:** ${totalFindings}
- **Applied Fixes:** ${appliedCount}
- **Remaining Issues:** ${remainingCount}

---

## Detailed Findings & Remediations

${findings
  .map(
    (f, idx) => `### ${idx + 1}. [${f.severity.toUpperCase()}] ${f.title}
- **Category:** ${f.category}
- **Line:** ${f.line}
- **Status:** ${appliedFixIds.has(f.id) ? 'BANISHED / APPLIED' : 'PENDING'}
- **Explanation:** ${f.explanation}
- **Suggested Fix:** ${f.suggested_fix}

\`\`\`${language}
// Corrected snippet:
${f.corrected_snippet}
\`\`\`
`
  )
  .join('\n')}

---

## Remaining Warnings & Limitations
${
  unresolvedIssues.length > 0
    ? unresolvedIssues.map((w) => `- ${w}`).join('\n')
    : '- None. All automated invariants and checks satisfied.'
}

---
*Report generated automatically by Gemma AI Code Exorcist.*
`;
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport();
    const base = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    onDownloadFile(`${base}_exorcism_report.md`, md);
  };

  const handleDownloadText = () => {
    const md = generateMarkdownReport();
    const base = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    onDownloadFile(`${base}_exorcism_report.txt`, md);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Prominent Completion Message */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all relative overflow-hidden ${
          isHalloween
            ? 'bg-gradient-to-r from-[#17092c] via-[#100720] to-[#0c1815] border-purple-800/60 shadow-[0_0_30px_rgba(168,85,247,0.25)]'
            : 'bg-gradient-to-r from-[#0d1627] via-[#09121f] to-[#0a191c] border-slate-700 shadow-xl'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isHalloween ? (
                <Ghost className="w-8 h-8 text-green-400 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isHalloween
                  ? `👻 Cleanse Complete! ${appliedCount} hauntings removed.`
                  : `Analysis Complete! ${appliedCount} bugs fixed.`}
              </h2>
            </div>
            <p className="text-sm text-slate-300">
              {remainingCount === 0
                ? isHalloween
                  ? 'Every detected ghost has been banished from the codebase. The program is fully sanctified.'
                  : 'All identified defects have been remediated. The codebase is clean and compliant.'
                : isHalloween
                ? `${appliedCount} hauntings banished, ${remainingCount} hauntings remaining for manual review.`
                : `${appliedCount} fixes applied, ${remainingCount} issues pending resolution.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExorciseAnother}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-2 ${
                isHalloween
                  ? 'bg-purple-900 hover:bg-purple-800 text-green-300 border border-purple-600/50'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <span>{isHalloween ? 'Exorcise Another File' : 'Analyze Another Program'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Report Document Container */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border ${
          isHalloween ? 'bg-[#0f071d] border-purple-950 text-slate-200' : 'bg-[#0b0f19] border-slate-800 text-slate-200'
        }`}
      >
        {/* Header Metadata */}
        <div className="border-b border-slate-800 pb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {isHalloween ? 'Spectral Audit & Exorcism Certificate' : 'Software Health & Remediation Report'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Generated by Gemma AI · {new Date(analyzedAt).toLocaleString()}
            </p>
          </div>

          {/* Export Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Text (.txt)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* File & Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">Target File:</span>
            <p className="font-mono font-bold text-white text-sm mt-0.5">{fileName}</p>
          </div>
          <div>
            <span className="text-slate-400">Language:</span>
            <p className="font-mono font-bold text-white text-sm mt-0.5 capitalize">{language}</p>
          </div>
          <div>
            <span className="text-slate-400">{isHalloween ? 'Hauntings Detected:' : 'Total Findings:'}</span>
            <p className="font-mono font-bold text-orange-400 text-sm mt-0.5">{totalFindings}</p>
          </div>
          <div>
            <span className="text-slate-400">{isHalloween ? 'Hauntings Banished:' : 'Remediations Applied:'}</span>
            <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
              {appliedCount} / {totalFindings}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="py-6 border-b border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Executive Summary
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
        </div>

        {/* Investigated Problem */}
        {userProblem && (
          <div className="py-6 border-b border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isHalloween ? 'Investigated Haunting & Curse' : 'Investigated Problem & Bug Symptoms'}
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
              <p className="text-slate-300 italic">"{userProblem}"</p>
              {problemResolution && (
                <p className="text-emerald-300 font-medium pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 font-normal">Resolution: </span>
                  {problemResolution}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Table of Findings and Proposed Fixes */}
        <div className="py-6 border-b border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isHalloween ? 'Detailed Hauntings Log' : 'Issue Ledger & Remediations'}
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 pr-3 font-semibold">#</th>
                  <th className="py-2.5 pr-4 font-semibold">Title</th>
                  <th className="py-2.5 pr-4 font-semibold">Severity</th>
                  <th className="py-2.5 pr-4 font-semibold">Category</th>
                  <th className="py-2.5 pr-4 font-semibold">Line</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {findings.map((f, i) => {
                  const isApplied = appliedFixIds.has(f.id);
                  return (
                    <tr key={f.id} className="hover:bg-slate-800/20">
                      <td className="py-2.5 pr-3 text-slate-500">{i + 1}</td>
                      <td className="py-2.5 pr-4 font-sans font-medium text-white">{f.title}</td>
                      <td className="py-2.5 pr-4 capitalize">
                        <span
                          className={
                            f.severity === 'critical'
                              ? 'text-red-400'
                              : f.severity === 'high'
                              ? 'text-orange-400'
                              : f.severity === 'medium'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {f.severity}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-400 capitalize">{f.category}</td>
                      <td className="py-2.5 pr-4 text-slate-400">L{f.line}</td>
                      <td className="py-2.5">
                        {isApplied ? (
                          <span className="text-emerald-400 font-semibold font-sans">
                            {isHalloween ? 'Banished' : 'Applied'}
                          </span>
                        ) : (
                          <span className="text-amber-400 font-sans">
                            {isHalloween ? 'Pending' : 'Unapplied'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unresolved Warnings or Limitations */}
        <div className="pt-6 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Remaining Invariants & Limitations
          </h4>
          {unresolvedIssues.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-xs text-amber-300">
              {unresolvedIssues.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">
              No outstanding runtime ambiguities identified. The exorcised program satisfies all structural integrity checks.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
