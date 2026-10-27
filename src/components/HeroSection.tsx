import React from 'react';
import { ThemeMode } from '../types/exorcist';
import { FileCode2, ArrowRight, Wand2, Zap } from 'lucide-react';

interface HeroSectionProps {
  mode: ThemeMode;
  onStartExorcism: () => void;
  onLoadSample: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  mode,
  onStartExorcism,
  onLoadSample,
}) => {
  const isHalloween = mode === 'halloween';

  return (
    <section
      className={`relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8 border-b ${
        isHalloween
          ? 'bg-gradient-to-b from-[#120722] via-[#0b0514] to-[#08030f] border-purple-900/30'
          : 'bg-gradient-to-b from-[#0b1120] via-[#090d16] to-[#070a10] border-slate-800'
      }`}
    >
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 blur-3xl pointer-events-none rounded-full ${
          isHalloween ? 'bg-purple-900/20' : 'bg-blue-900/15'
        }`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Call to action */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-opacity-30">
              <span
                className={`w-2 h-2 rounded-full ${
                  isHalloween ? 'bg-green-400' : 'bg-blue-400'
                }`}
              />
              <span className={isHalloween ? 'text-green-300' : 'text-blue-300'}>
                {isHalloween
                  ? 'Spectral Bug Exorcism Engine · Powered by Gemini'
                  : 'AI Static Analysis & Automated Code Repair · Powered by Gemini'}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {isHalloween
                ? 'Your Code Has a Few Ghosts. Let’s Find Them.'
                : 'Diagnose Logic Flaws, Runtime Errors & Security Bugs.'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {isHalloween
                ? 'Summon Gemma to unearth stealthy hauntings in your programs. Detect memory curses, off-by-one poltergeists, and unhandled exceptions, then banish them with pristine, resurrected code.'
                : 'Inspect syntax errors, logical defects, security vulnerabilities, and runtime exceptions. Inspect precise diffs, apply certified fixes, and export production-grade code.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartExorcism}
                className={`px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all flex items-center gap-2.5 shadow-lg ${
                  isHalloween
                    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-green-600 hover:from-purple-500 hover:to-green-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                }`}
              >
                {isHalloween ? <Wand2 className="w-4 h-4 text-green-300" /> : <Zap className="w-4 h-4" />}
                <span>{isHalloween ? 'Start Exorcism' : 'Analyze Code Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLoadSample}
                className={`px-5 py-3 rounded-xl text-sm font-medium border cursor-pointer transition-colors flex items-center gap-2 ${
                  isHalloween
                    ? 'bg-purple-950/40 border-purple-800/60 text-slate-200 hover:bg-purple-900/40 hover:text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileCode2 className="w-4 h-4 text-slate-400" />
                <span>{isHalloween ? 'Test Haunted Sample' : 'Load Example Program'}</span>
              </button>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800/60">
              <div>
                <p className="text-xl font-bold text-white font-mono tabular-nums">9 Languages</p>
                <p className="text-xs text-slate-400">Python, JS, TS, Java, C++, SQL...</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-mono tabular-nums">Multi-Tier</p>
                <p className="text-xs text-slate-400">Critical to Low Severity</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-mono tabular-nums">Verified Diff</p>
                <p className="text-xs text-slate-400">Full clean code generated</p>
              </div>
            </div>
          </div>

          {/* Right Column: Gemma Mascot Art */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-xs w-full">
              <div
                className={`absolute -inset-1 rounded-2xl blur-xl opacity-60 transition-opacity ${
                  isHalloween
                    ? 'bg-gradient-to-r from-purple-600 to-green-500 group-hover:opacity-100'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:opacity-80'
                }`}
              />
              <div
                className={`relative rounded-2xl overflow-hidden border p-2 backdrop-blur-xl ${
                  isHalloween
                    ? 'bg-[#150a2b]/90 border-purple-700/50'
                    : 'bg-[#0f172a]/90 border-slate-700'
                }`}
              >
                <img
                  src="/src/assets/images/gemma_ghost_mascot_1793090538265.jpg"
                  alt="Gemma AI Code Exorcist Mascot"
                  className="w-full h-auto aspect-square object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 text-center">
                  <p className="text-xs font-semibold text-slate-200">
                    {isHalloween ? 'Gemma · The AI Code Exorcist' : 'Gemma · Code Diagnostic Assistant'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isHalloween ? 'Armed with celestial runes and Gemini 3.8' : 'Automated bug detection and remediation'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
