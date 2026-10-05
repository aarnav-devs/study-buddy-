import React, { useState } from 'react';
import { Search, Mic, ArrowRight, Lightbulb, HelpCircle, MessageSquare } from 'lucide-react';
import { LearningMode, ProgressItem } from '../types';
import { StudyBuddyLogo } from './StudyBuddyLogo';

interface HomeDashboardProps {
  onSearchTopic: (query: string) => void;
  onLaunchSpark: (topicName: string) => void;
  onOpenVoice: () => void;
  onSelectShortcutMode: (topicName: string, mode: LearningMode) => void;
  progressList: ProgressItem[];
}

const SPARK_TOPICS = [
  { name: 'Photosynthesis', emoji: '🌱' },
  { name: 'Electricity', emoji: '⚡' },
  { name: 'Solar System', emoji: '🪐' },
  { name: 'DNA', emoji: '🧬' },
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSearchTopic,
  onLaunchSpark,
  onOpenVoice,
  onSelectShortcutMode,
  progressList,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearchTopic(query);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4 sm:py-8">
      {/* 1. Main Hero Focus: Question Input */}
      <div className="text-center space-y-3">
        {/* Friendly Mascot Logo Banner */}
        <div className="flex justify-center mb-1">
          <div className="relative group cursor-pointer inline-flex flex-col items-center">
            <StudyBuddyLogo size={76} animated={true} />
            <span className="mt-2 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full shadow-xs">
              Hi, I'm Study Buddy 👋
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          What do you want to understand today?
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
          Ask any concept. Study Buddy will break it down into clean visual steps.
        </p>

        {/* Large Centered Input */}
        <form onSubmit={handleSubmit} className="pt-4 max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-full shadow-lg shadow-blue-500/5 border border-slate-200/90 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-2 pl-5 pr-2">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Study Buddy anything..."
              className="w-full px-3 py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            {/* Prominent Voice Microphone Button */}
            <button
              type="button"
              onClick={onOpenVoice}
              className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition flex items-center justify-center shrink-0 cursor-pointer"
              title="Ask using voice"
            >
              <Mic className="w-5 h-5" />
            </button>
            {/* Search Submit Arrow */}
            {query.trim() && (
              <button
                type="submit"
                className="ml-1 p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center shrink-0 cursor-pointer animate-fade-in"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 2. 30-Second Spark Shortcuts */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            30-Second Spark
          </h2>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Tiny animated lessons</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SPARK_TOPICS.map((t) => (
            <button
              key={t.name}
              onClick={() => onLaunchSpark(t.name)}
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-150 hover:border-blue-300 shadow-xs hover:shadow-sm transition-all duration-200 text-left flex items-center gap-3 cursor-pointer group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {t.emoji}
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {t.name}
                </div>
                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                  Launch 30s ⚡
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Learn Your Way Shortcuts */}
      <div className="space-y-3 text-center sm:text-left">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Learn Your Way
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {([
            { id: 'explain', label: 'Explain Simply', desc: 'Bite-sized breakdown', icon: Lightbulb, color: 'text-amber-500 bg-amber-50' },
            { id: 'quiz', label: 'Quiz Me', desc: 'Instant feedback test', icon: HelpCircle, color: 'text-emerald-500 bg-emerald-50' },
            { id: 'teach', label: 'Teach Me', desc: 'Socratic step guidance', icon: MessageSquare, color: 'text-purple-500 bg-purple-50' },
          ] satisfies { id: LearningMode; label: string; desc: string; icon: typeof Lightbulb; color: string }[]).map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectShortcutMode('Photosynthesis', mode.id)}
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-150 hover:border-slate-300 shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-xl ${mode.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{mode.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Compact Learning Progress Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-150 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Your Learning Progress
          </h3>
          <span className="text-[11px] font-semibold text-blue-600">Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {progressList.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSearchTopic(item.topic)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{item.emoji}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.topic}</div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    {item.percent}% understood
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          ))}
        </div>

        {/* Keep Learning banner */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-slate-600">
            <span className="text-slate-400 font-medium">Keep Learning: </span>
            <strong className="text-slate-900">Chloroplasts</strong>
          </div>
          <button
            onClick={() => onSearchTopic('Photosynthesis')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
