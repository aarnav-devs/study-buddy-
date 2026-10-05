import React from 'react';
import { Flame, SlidersHorizontal, Sparkles } from 'lucide-react';
import { StudyBuddyLogo } from './StudyBuddyLogo';

interface NavbarProps {
  currentTab: 'home' | 'learn' | 'progress';
  onSelectTab: (tab: 'home' | 'learn' | 'progress') => void;
  streakDays: number;
  onOpenPreferences: () => void;
  hasAiConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  streakDays,
  onOpenPreferences,
  hasAiConnected = true,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fafbff]/90 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand with Logo */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <StudyBuddyLogo size={36} animated={true} />
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition">
              Google Study Buddy
            </span>
          </div>
        </button>

        {/* Minimal Desktop Nav: Home · Learn · Progress */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/50">
          {[
            { id: 'home', label: 'Home' },
            { id: 'learn', label: 'Learn' },
            { id: 'progress', label: 'Progress' },
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right side tools */}
        <div className="flex items-center gap-2">
          {/* AI Connection Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
              hasAiConnected
                ? 'bg-blue-50/80 text-blue-700 border-blue-200/80'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title="Gemini AI connection status"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${hasAiConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Gemini AI</span>
          </div>

          <div
            onClick={() => onSelectTab('progress')}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold cursor-pointer hover:bg-amber-100/80 transition"
            title={`${streakDays} days learning streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{streakDays}</span>
          </div>

          <button
            onClick={onOpenPreferences}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            title="Personalization preferences"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
