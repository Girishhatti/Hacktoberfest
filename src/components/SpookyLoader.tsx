import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../types/exorcist';
import { Ghost, Sparkles, Terminal, Wand2 } from 'lucide-react';

interface SpookyLoaderProps {
  mode: ThemeMode;
}

const HALLOWEEN_STEPS = [
  'Summoning spectral AST parsers...',
  'Interrogating trapped memory leaks...',
  'Banishing off-by-one poltergeists...',
  'Sanctifying unhandled promise rejections...',
  'Dispelling SQL injection curses...',
  'Synthesizing pure resurrected code...',
];

const NORMAL_STEPS = [
  'Lexical and semantic AST analysis...',
  'Inspecting runtime edge cases and null dereferences...',
  'Auditing security invariants and sanitization...',
  'Evaluating boundary conditions and algorithmic efficiency...',
  'Generating validated source-code remediation...',
];

export const SpookyLoader: React.FC<SpookyLoaderProps> = ({ mode }) => {
  const isHalloween = mode === 'halloween';
  const steps = isHalloween ? HALLOWEEN_STEPS : NORMAL_STEPS;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`max-w-md w-full p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-6 relative overflow-hidden ${
          isHalloween
            ? 'bg-[#140827] border-purple-700/60 shadow-[0_0_50px_rgba(168,85,247,0.35)]'
            : 'bg-[#0f172a] border-slate-700 shadow-xl'
        }`}
      >
        {/* Background Atmosphere Image for Halloween Mode */}
        {isHalloween && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="/src/assets/images/haunted_code_laboratory_1793090538052.jpg"
              alt="Haunted Code Lab"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="relative z-10 space-y-4">
          {/* Animated Icon Orb */}
          <div className="flex justify-center">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center relative ${
                isHalloween
                  ? 'bg-purple-900/60 border border-purple-500/50 shadow-[0_0_25px_rgba(34,197,94,0.35)] animate-ghost-float text-green-400'
                  : 'bg-blue-600/20 border border-blue-500/40 text-blue-400'
              }`}
            >
              {isHalloween ? (
                <Ghost className="w-10 h-10 animate-pulse text-green-300" />
              ) : (
                <Terminal className="w-10 h-10 animate-pulse text-blue-400" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white">
              {isHalloween ? 'Exorcism In Progress' : 'Deep Static Code Analysis'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Powered by Gemini 3.8
            </p>
          </div>

          {/* Stepper Status */}
          <div
            className={`p-3 rounded-xl border text-xs font-mono transition-all ${
              isHalloween
                ? 'bg-purple-950/80 border-purple-800 text-green-300'
                : 'bg-slate-900 border-slate-800 text-blue-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
              <span>{steps[currentStep]}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            {isHalloween
              ? 'Stand back while Gemma unearths and banishes stealthy code demons.'
              : 'Verifying syntax, execution safety, and generating complete repaired program.'}
          </p>
        </div>
      </div>
    </div>
  );
};
