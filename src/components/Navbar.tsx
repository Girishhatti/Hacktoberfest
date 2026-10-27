import React from 'react';
import { ThemeMode } from '../types/exorcist';
import { Ghost, Terminal, Flame, Cpu } from 'lucide-react';

interface NavbarProps {
  mode: ThemeMode;
  onToggleMode: (mode: ThemeMode) => void;
  activeTab: 'workspace' | 'findings' | 'diff' | 'report';
  setActiveTab: (tab: 'workspace' | 'findings' | 'diff' | 'report') => void;
  hasResults: boolean;
  findingsCount: number;
  hasApiKey: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onToggleMode,
  activeTab,
  setActiveTab,
  hasResults,
  findingsCount,
  demoMode,
  setDemoMode,
}) => {
  const isHalloween = mode === 'halloween';

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-200 border-b ${
        isHalloween
          ? 'bg-[#0b0514]/90 border-purple-900/40 text-slate-100'
          : 'bg-[#090d16]/90 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isHalloween
                ? 'bg-purple-900/60 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-green-400'
                : 'bg-blue-600/20 border border-blue-500/40 text-blue-400'
            }`}
          >
            {isHalloween ? <Ghost className="w-5 h-5 animate-pulse" /> : <Terminal className="w-5 h-5" />}
          </div>
          <button
            onClick={() => setActiveTab('workspace')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                Gemma
              </span>
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                  isHalloween
                    ? 'text-orange-400 bg-orange-950/60 border border-orange-500/30'
                    : 'text-blue-400 bg-blue-950/60 border border-blue-500/30'
                }`}
              >
                {isHalloween ? 'Code Exorcist 👻' : 'Code Diagnostic Studio'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 Clean Navigation Tabs with whitespace-nowrap */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'workspace'
                ? isHalloween
                  ? 'text-green-400 font-semibold border-b-2 border-green-400'
                  : 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isHalloween ? 'Altar & Workspace' : 'Editor Workspace'}
          </button>

          <button
            onClick={() => setActiveTab('findings')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-2 cursor-pointer ${
              activeTab === 'findings'
                ? isHalloween
                  ? 'text-green-400 font-semibold border-b-2 border-green-400'
                  : 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{isHalloween ? 'Code Hauntings' : 'Detected Issues'}</span>
            {hasResults && (
              <span
                className={`text-xs px-2 py-0.2 rounded-full tabular-nums font-mono ${
                  findingsCount > 0
                    ? isHalloween
                      ? 'bg-purple-900/80 text-orange-400 border border-purple-700/60'
                      : 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {findingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'diff'
                ? isHalloween
                  ? 'text-green-400 font-semibold border-b-2 border-green-400'
                  : 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isHalloween ? 'Sanctified Diff Studio' : 'Code Diff & Fixes'}
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'report'
                ? isHalloween
                  ? 'text-green-400 font-semibold border-b-2 border-green-400'
                  : 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isHalloween ? 'Ghost Report' : 'Analysis Report'}
          </button>
        </nav>

        {/* Zone 3: Mode Switcher & Status Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            title="Toggle between live Gemini AI and deterministic sample verification"
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              demoMode
                ? 'bg-amber-950/70 border-amber-600/50 text-amber-300'
                : isHalloween
                ? 'bg-purple-950/40 border-purple-800/40 text-slate-400 hover:text-slate-200'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{demoMode ? 'Demo Mode: ON' : 'AI Mode: Live'}</span>
          </button>

          {/* Theme Mode Toggle (Halloween vs Normal) */}
          <button
            onClick={() => onToggleMode(isHalloween ? 'normal' : 'halloween')}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
              isHalloween
                ? 'bg-purple-950/80 border-purple-600/60 text-orange-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:border-purple-400'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
            title="Switch between Halloween and Normal Mode"
          >
            {isHalloween ? (
              <>
                <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
                <span>Halloween Mode</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Normal Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
