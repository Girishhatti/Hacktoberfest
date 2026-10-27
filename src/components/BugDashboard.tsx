import React, { useState } from 'react';
import { ThemeMode, BugFinding, Severity, BugCategory } from '../types/exorcist';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  Flame,
  Ghost,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface BugDashboardProps {
  mode: ThemeMode;
  findings: BugFinding[];
  appliedFixIds: Set<string>;
  onToggleFix: (finding: BugFinding) => void;
  onCopySnippet: (text: string, title: string) => void;
  summary: string;
  userProblem?: string;
  problemResolution?: string;
  onGoToDiff: () => void;
}

export const BugDashboard: React.FC<BugDashboardProps> = ({
  mode,
  findings,
  appliedFixIds,
  onToggleFix,
  onCopySnippet,
  summary,
  userProblem,
  problemResolution,
  onGoToDiff,
}) => {
  const isHalloween = mode === 'halloween';
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(findings.slice(0, 3).map((f) => f.id))
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Counters
  const totalFindings = findings.length;
  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const highCount = findings.filter((f) => f.severity === 'high').length;
  const mediumCount = findings.filter((f) => f.severity === 'medium').length;
  const lowCount = findings.filter((f) => f.severity === 'low').length;

  const appliedCount = findings.filter((f) => appliedFixIds.has(f.id)).length;

  // Filtering
  const filteredFindings = findings.filter((f) => {
    if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    return true;
  });

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const handleCopy = (snippet: string, id: string, title: string) => {
    onCopySnippet(snippet, title);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'critical':
        return {
          bg: isHalloween ? 'bg-red-950/80 text-red-300 border-red-700/60' : 'bg-red-950 text-red-300 border-red-800',
          dot: 'bg-red-500',
          label: 'Critical',
        };
      case 'high':
        return {
          bg: isHalloween ? 'bg-orange-950/80 text-orange-300 border-orange-700/60' : 'bg-amber-950 text-amber-300 border-amber-800',
          dot: 'bg-orange-500',
          label: 'High',
        };
      case 'medium':
        return {
          bg: isHalloween ? 'bg-purple-950/80 text-purple-300 border-purple-700/60' : 'bg-blue-950 text-blue-300 border-blue-800',
          dot: 'bg-yellow-400',
          label: 'Medium',
        };
      case 'low':
        return {
          bg: isHalloween ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' : 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-emerald-400',
          label: 'Low',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isHalloween
            ? 'bg-[#120722] border-purple-800/40 text-purple-100 shadow-[0_4px_20px_rgba(18,7,34,0.6)]'
            : 'bg-[#0f172a] border-slate-800 text-slate-200 shadow-md'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              {isHalloween ? (
                <Ghost className="w-5 h-5 text-orange-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-blue-400" />
              )}
              <h2 className="text-base font-bold text-white">
                {isHalloween ? 'Spectral Haunting Diagnosis' : 'Static Analysis Findings'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{summary}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToDiff}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                isHalloween
                  ? 'bg-purple-900/60 hover:bg-purple-800 text-green-300 border border-purple-600/50'
                  : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40'
              }`}
            >
              <span>{isHalloween ? 'Inspect Sanctified Diff' : 'View Code Diff'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Reported Problem & Resolution Diagnosis (if user typed a problem) */}
      {userProblem && (
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isHalloween
              ? 'bg-[#15092a] border-purple-700/60 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
              : 'bg-[#0e1726] border-blue-800 text-blue-100'
          }`}
        >
          <div className="flex items-start gap-3">
            <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isHalloween ? 'Your Investigated Curse:' : 'Targeted Problem Investigation:'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-black/40 text-green-400">
                  Targeted Analysis
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans italic bg-black/30 p-2 rounded-lg border border-white/5">
                "{userProblem}"
              </p>
              {problemResolution && (
                <div className="pt-1">
                  <p className="text-xs font-semibold text-emerald-400 mb-0.5">
                    {isHalloween ? 'Gemma’s Exorcism Diagnosis & Remedy:' : 'Remediation Verdict:'}
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {problemResolution}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPI Severity Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setSeverityFilter('all')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'all'
              ? isHalloween
                ? 'bg-purple-900/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-slate-800/80 border-slate-600'
              : isHalloween
              ? 'bg-[#100720]/60 border-purple-950/80 hover:border-purple-800'
              : 'bg-[#0b0f19] border-slate-800 hover:border-slate-700'
          }`}
        >
          <p className="text-xs text-slate-400">Total {isHalloween ? 'Hauntings' : 'Findings'}</p>
          <p className="text-2xl font-bold text-white font-mono tabular-nums mt-1">{totalFindings}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {appliedCount} {isHalloween ? 'banished' : 'applied'}
          </p>
        </div>

        <div
          onClick={() => setSeverityFilter('critical')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'critical'
              ? 'border-red-500 bg-red-950/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : isHalloween
              ? 'bg-[#100720]/60 border-purple-950/80 hover:border-red-900/60'
              : 'bg-[#0b0f19] border-slate-800 hover:border-red-900/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-red-400 font-medium">Critical</p>
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-300 font-mono tabular-nums mt-1">{criticalCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Severe execution stop</p>
        </div>

        <div
          onClick={() => setSeverityFilter('high')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'high'
              ? 'border-orange-500 bg-orange-950/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
              : isHalloween
              ? 'bg-[#100720]/60 border-purple-950/80 hover:border-orange-900/60'
              : 'bg-[#0b0f19] border-slate-800 hover:border-amber-900/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-orange-400 font-medium">High</p>
            <span className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-300 font-mono tabular-nums mt-1">{highCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Logical & memory flaws</p>
        </div>

        <div
          onClick={() => setSeverityFilter('medium')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'medium'
              ? 'border-amber-500 bg-amber-950/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : isHalloween
              ? 'bg-[#100720]/60 border-purple-950/80 hover:border-amber-900/60'
              : 'bg-[#0b0f19] border-slate-800 hover:border-blue-900/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-amber-400 font-medium">Medium</p>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 font-mono tabular-nums mt-1">{mediumCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Edge cases & leaks</p>
        </div>

        <div
          onClick={() => setSeverityFilter('low')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'low'
              ? 'border-emerald-500 bg-emerald-950/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : isHalloween
              ? 'bg-[#100720]/60 border-purple-950/80 hover:border-emerald-900/60'
              : 'bg-[#0b0f19] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-emerald-400 font-medium">Low</p>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-300 font-mono tabular-nums mt-1">{lowCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Cleanups & styles</p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 px-2 py-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {['all', 'security', 'runtime', 'logic', 'syntax', 'performance', 'edge_case'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md capitalize cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? isHalloween
                      ? 'bg-purple-900/80 text-green-300 font-semibold'
                      : 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <span className="text-slate-400 font-mono">
          Showing {filteredFindings.length} of {totalFindings} findings
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div
            className={`p-10 rounded-2xl border text-center ${
              isHalloween ? 'bg-[#100720] border-purple-900/40' : 'bg-[#0b0f19] border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-white">No Hauntings in this Category</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select another filter or view all issues above.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isExpanded = expandedIds.has(finding.id);
            const isApplied = appliedFixIds.has(finding.id);
            const badge = getSeverityBadge(finding.severity);

            return (
              <div
                key={finding.id}
                className={`rounded-2xl border transition-all ${
                  isHalloween
                    ? isApplied
                      ? 'bg-[#110a22]/90 border-green-700/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                      : 'bg-[#0f071d] border-purple-900/50 hover:border-purple-700/70'
                    : isApplied
                    ? 'bg-[#0a1426]/90 border-blue-600/50'
                    : 'bg-[#0b0f19] border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(finding.id)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Severity Badge */}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold flex items-center gap-1.5 ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>

                    {/* Category Label */}
                    <span className="text-xs text-slate-400 font-mono capitalize">
                      {finding.category.replace('_', ' ')}
                    </span>

                    {/* Line reference */}
                    <span className="text-xs text-slate-400 font-mono">
                      Line {finding.line}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {finding.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isApplied && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{isHalloween ? 'Banished' : 'Applied'}</span>
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    className={`px-5 pb-5 pt-2 border-t space-y-4 ${
                      isHalloween ? 'border-purple-900/30' : 'border-slate-800'
                    }`}
                  >
                    {/* Explanation */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        {isHalloween ? 'Why This Haunts Your Code:' : 'Defect Explanation:'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {finding.explanation}
                      </p>
                    </div>

                    {/* Suggested Fix */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        {isHalloween ? 'Prescribed Ritual / Fix:' : 'Remediation Strategy:'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {finding.suggested_fix}
                      </p>
                    </div>

                    {/* Snippet Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* Original Flawed Snippet */}
                      <div
                        className={`p-3 rounded-xl border text-xs font-mono overflow-x-auto ${
                          isHalloween
                            ? 'bg-[#150a28]/80 border-rose-950 text-rose-200'
                            : 'bg-red-950/20 border-red-900/40 text-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-rose-400 mb-1.5 pb-1 border-b border-rose-900/30">
                          <span>{isHalloween ? 'Cursed Snippet' : 'Original Flawed Code'}</span>
                          <span>Line {finding.line}</span>
                        </div>
                        <pre className="whitespace-pre-wrap">{finding.original_snippet || '// Original code segment'}</pre>
                      </div>

                      {/* Corrected Snippet */}
                      <div
                        className={`p-3 rounded-xl border text-xs font-mono overflow-x-auto ${
                          isHalloween
                            ? 'bg-[#0d1a1b]/80 border-green-950 text-green-200'
                            : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-green-400 mb-1.5 pb-1 border-b border-green-900/30">
                          <span>{isHalloween ? 'Sanctified Snippet' : 'Corrected Replacement'}</span>
                          <button
                            onClick={() =>
                              handleCopy(finding.corrected_snippet, finding.id, finding.title)
                            }
                            title="Copy corrected snippet"
                            className="flex items-center gap-1 text-[11px] hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedId === finding.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap">{finding.corrected_snippet}</pre>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() =>
                          handleCopy(finding.corrected_snippet, finding.id, finding.title)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors flex items-center gap-1.5 ${
                          isHalloween
                            ? 'bg-purple-950/60 border-purple-800 text-purple-200 hover:text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Corrected Snippet</span>
                      </button>

                      {/* Banish This Bug / Apply Fix Button */}
                      <button
                        onClick={() => onToggleFix(finding)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                          isApplied
                            ? isHalloween
                              ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                            : isHalloween
                            ? 'bg-purple-900/80 hover:bg-purple-800 text-orange-300 border border-purple-600'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{isHalloween ? 'Haunting Banished ✓' : 'Fix Applied ✓'}</span>
                          </>
                        ) : (
                          <>
                            {isHalloween ? (
                              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            <span>{isHalloween ? 'Banish This Bug' : 'Apply Fix'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
