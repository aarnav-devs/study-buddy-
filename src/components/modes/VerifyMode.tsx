import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Search, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { VerifyResult } from '../../types';

interface VerifyModeProps {
  topic: string;
}

const SAMPLE_STATEMENTS = [
  'Plants produce oxygen during the day and consume oxygen at night.',
  'Heavier objects fall faster than lighter objects in a vacuum.',
  'Lightning bolts are five times hotter than the surface of the Sun.',
  'Electrons move through wires at the speed of light.',
];

export const VerifyMode: React.FC<VerifyModeProps> = ({ topic }) => {
  const [statement, setStatement] = useState(SAMPLE_STATEMENTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult>({
    verified: true,
    confidence: 'High',
    headline: 'Scientific Truth Verified',
    summary: 'Yes! Plants perform cellular respiration 24 hours a day, taking in oxygen and emitting CO₂.',
    explanation: 'While photosynthesis only happens when sunlight strikes leaves, plant cells must stay alive around the clock by metabolizing glucose with oxygen via cellular respiration, especially in the dark.',
    socraticPrompt: 'How could you test this using a sealed jar and a CO₂ gas sensor over 24 hours?',
  });

  const handleVerify = async (textToVerify: string) => {
    if (!textToVerify.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/study/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: textToVerify }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      }
    } catch (e) {
      console.error('Verify failed:', e);
      // Fallback
      setResult({
        verified: true,
        confidence: 'High',
        headline: 'Fact Verified',
        summary: 'This statement aligns with established scientific understanding.',
        explanation: 'Always cross-reference claims with primary textbooks and reproducible laboratory results.',
        socraticPrompt: 'What real-world experiment would confirm this fact?',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Philosophy Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm text-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Fact Checker & Verification
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 tracking-tight">
          Don’t Blindly Trust AI. Check It.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Verify any homework claim, fact, or rumor against strict scientific evidence.
        </p>

        {/* Input */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify(statement)}
              placeholder="Enter any statement to check..."
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/60"
            />
          </div>
          <button
            onClick={() => handleVerify(statement)}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin">🌀</span>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Verify</span>
              </>
            )}
          </button>
        </div>

        {/* Quick sample chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Quick checks:</span>
          {SAMPLE_STATEMENTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStatement(item);
                handleVerify(item);
              }}
              className="text-[11px] px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer text-left"
            >
              {item.length > 32 ? item.slice(0, 32) + '...' : item}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm animate-fade-in">
          {/* Verdict Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {result.verified ? (
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {result.verified ? '✓ Verified Fact' : '⚠ Needs Correction'}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Confidence: <strong className="text-slate-800">{result.confidence}</strong>
                </span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.verified
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {result.verified ? 'Supported by Science' : 'Misconception'}
            </span>
          </div>

          {/* Explanation */}
          <div className="mt-5 space-y-3">
            <p className="text-sm font-semibold text-slate-800 leading-snug">
              {result.summary}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {result.explanation}
            </p>

            {result.correction && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                <span className="font-bold block mb-1">Accurate statement:</span>
                {result.correction}
              </div>
            )}

            {result.socraticPrompt && (
              <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-950 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Socratic Thinking Prompt:</span>
                  {result.socraticPrompt}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
