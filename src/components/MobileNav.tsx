import React from 'react';
import { Home, Compass, BarChart2 } from 'lucide-react';

interface MobileNavProps {
  currentTab: 'home' | 'learn' | 'progress';
  onSelectTab: (tab: 'home' | 'learn' | 'progress') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-2.5 flex items-center justify-around shadow-lg">
      {[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'learn', label: 'Learn', icon: Compass },
        { id: 'progress', label: 'Progress', icon: BarChart2 },
      ].map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as any)}
            className={`flex flex-col items-center gap-1 transition cursor-pointer ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
