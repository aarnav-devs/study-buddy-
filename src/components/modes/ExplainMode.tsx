import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, HelpCircle } from 'lucide-react';
import { TopicData } from '../../types';

interface ExplainModeProps {
  data: TopicData;
  onLaunchSpark: () => void;
}

export const ExplainMode: React.FC<ExplainModeProps> = ({
  data,
  onLaunchSpark,
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* 0. Direct Answer to What Student Asked */}
      {data.directAnswer && (
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white rounded-3xl p-6 sm:p-7 border border-blue-200/80 shadow-xs relative overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Direct Answer</span>
            </div>
            {data.isAiGenerated && (
              <span className="text-[11px] font-semibold text-blue-700 bg-white/90 px-2.5 py-0.5 rounded-full border border-blue-100">
                ✨ Answered by Study Buddy AI
              </span>
            )}
          </div>
          {data.userQuestion && (
            <div className="text-xs font-semibold text-slate-500 mb-1.5">
              You asked: <span className="text-slate-800 font-bold">&ldquo;{data.userQuestion}&rdquo;</span>
            </div>
          )}
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {data.directAnswer}
          </p>
        </div>
      )}

      {/* 1. Header & Headline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <span>{data.emoji}</span>
          <span>{data.isAiGenerated ? 'AI Generated Lesson' : 'Core Concept'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {data.topic}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed max-w-2xl">
          {data.headline}
        </p>
      </div>

      {/* 2. Visual Flow (Ingredients -> Process -> Output) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          How It Works at a Glance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
          {data.flow.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-blue-600 mb-1">
                  0{item.step}. {item.label}
                </div>
                <div className="text-sm font-semibold text-slate-800 leading-snug">
                  {item.detail}
                </div>
              </div>
              {idx < data.flow.length - 1 && (
                <div className="hidden md:flex justify-end mt-2">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* 3. Everyday Analogy ("Think of it like...") */}
      <div className="bg-amber-50/50 rounded-3xl p-6 sm:p-7 border border-amber-100/80 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
            Intuitive Analogy
          </h4>
          <p className="text-sm text-slate-800 leading-relaxed font-normal">
            {data.analogy}
          </p>
        </div>
      </div>

      {/* 4. Three Key Takeaways */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          3 Things to Remember
        </h3>
        <div className="space-y-3">
          {data.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/60 border border-slate-150/60"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-normal">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Curious Question */}
      <div className="bg-sky-50/60 rounded-3xl p-6 border border-sky-100 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">
            Did You Know?
          </h4>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            {data.curiousQuestion}
          </p>
        </div>
      </div>

      {/* Bottom Secondary Action: 30-Second Spark CTA */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">Have 30 seconds?</div>
            <div className="text-[11px] text-slate-400">Experience this topic as a tiny animated journey</div>
          </div>
        </div>
        <button
          onClick={onLaunchSpark}
          className="w-full sm:w-auto px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition shadow-xs cursor-pointer"
        >
          Launch 30s Spark ⚡
        </button>
      </div>
    </div>
  );
};
