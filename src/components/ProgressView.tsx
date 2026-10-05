import React from 'react';
import { Sparkles, ArrowRight, Flame, Trophy, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { ProgressItem } from '../types';

interface ProgressViewProps {
  progressList: ProgressItem[];
  streakDays: number;
  onContinueTopic: (topicName: string) => void;
  onLaunchSpark: (topicName: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progressList,
  streakDays,
  onContinueTopic,
  onLaunchSpark,
}) => {
  // Find topic that needs the most focus (lowest percent or first)
  const activeItem = [...progressList].sort((a, b) => a.percent - b.percent)[0] || {
    id: '1',
    topic: 'Photosynthesis',
    emoji: '🌱',
    percent: 82,
    lastSubtopic: 'Chloroplasts',
    lastUpdated: 'Today',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with Motivating Streak */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Your Growth Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Keep the Curiosity Flowing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Understanding builds step-by-step. Celebrate every concept you explore.
          </p>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50/80 border border-amber-200/80">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-base font-black text-amber-950 leading-none">
              {streakDays} Days Strong
            </div>
            <div className="text-[11px] font-medium text-amber-700 mt-0.5">
              Daily spark streak
            </div>
          </div>
        </div>
      </div>

      {/* Keep Learning Next Focus */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended Next Step</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            {activeItem.topic} & {activeItem.lastSubtopic}
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md">
            Pick up right where you left off in {activeItem.topic} ({activeItem.percent}% understood).
          </p>
        </div>

        <button
          onClick={() => onContinueTopic(activeItem.topic)}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Your Learning Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
          Your Learning
        </h3>

        <div className="space-y-4">
          {progressList.map((item) => {
            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-100/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  {/* Circular progress visual */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        className="text-slate-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        className="text-blue-600 transition-all duration-700 ease-out"
                        strokeWidth="3.5"
                        strokeDasharray={88}
                        strokeDashoffset={88 - (88 * item.percent) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                      />
                    </svg>
                    <span className="absolute text-sm">{item.emoji}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {item.topic}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      <strong className="text-slate-800">{item.percent}% understood</strong> · Last explored: {item.lastSubtopic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
                  <button
                    onClick={() => onLaunchSpark(item.topic)}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-white transition cursor-pointer"
                  >
                    30s Spark ⚡
                  </button>
                  <button
                    onClick={() => onContinueTopic(item.topic)}
                    className="flex-1 sm:flex-none px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Learn</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Badge Shelf */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-150 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Earned Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'Socratic Mind', icon: '🤝', desc: 'Finished Teach Me' },
            { title: 'Curiosity Spark', icon: '⚡', desc: '5-Day Streak' },
            { title: 'Truth Checker', icon: '✓', desc: 'Verified 3 facts' },
          ].map((b, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-center flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">{b.icon}</span>
              <div className="text-xs font-bold text-slate-800">{b.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
