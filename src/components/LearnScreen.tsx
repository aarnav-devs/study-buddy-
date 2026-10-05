import React from 'react';
import { Sparkles, Lightbulb, BookOpen, HelpCircle, Clock, MessageSquare, CheckCircle, RotateCw } from 'lucide-react';
import { LearningMode, TopicData } from '../types';
import { ExplainMode } from './modes/ExplainMode';
import { ExampleMode } from './modes/ExampleMode';
import { QuizMode } from './modes/QuizMode';
import { ExamMode } from './modes/ExamMode';
import { TeachMeMode } from './modes/TeachMeMode';
import { VerifyMode } from './modes/VerifyMode';

interface LearnScreenProps {
  currentTopicData: TopicData;
  activeMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  onLaunchSpark: () => void;
  isLoadingTopic?: boolean;
}

const MODES: { id: LearningMode; label: string; icon: any }[] = [
  { id: 'explain', label: 'Explain', icon: Lightbulb },
  { id: 'example', label: 'Example', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'exam', label: 'Exam', icon: Clock },
  { id: 'teach', label: 'Teach Me', icon: MessageSquare },
  { id: 'verify', label: 'Verify', icon: CheckCircle },
];

export const LearnScreen: React.FC<LearnScreenProps> = ({
  currentTopicData,
  activeMode,
  onSelectMode,
  onLaunchSpark,
  isLoadingTopic = false,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2 sm:py-4">
      {/* 1. Spark Shortcut */}
      <div className="flex justify-end pb-2">
        {/* 30-Second Spark Launch CTA */}
        <button
          onClick={onLaunchSpark}
          className="self-start sm:self-auto px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>30s Spark ⚡</span>
        </button>
      </div>

      {/* 2. Horizontal Learning Mode Segmented Bar */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl sm:rounded-full border border-slate-200/60 min-w-max">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Loading State */}
      {isLoadingTopic ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-150 shadow-sm space-y-3">
          <RotateCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Getting your lesson ready...</h3>
          <p className="text-xs text-slate-400">
            Study Buddy is synthesizing visual flows, analogies, and questions.
          </p>
        </div>
      ) : (
        /* 4. Active Mode Content */
        <div className="transition-all duration-300">
          {activeMode === 'explain' && (
            <ExplainMode
              data={currentTopicData}
              onLaunchSpark={onLaunchSpark}
            />
          )}

          {activeMode === 'example' && (
            <ExampleMode
              data={currentTopicData}
              onSelectMode={onSelectMode}
            />
          )}

          {activeMode === 'quiz' && (
            <QuizMode
              questions={currentTopicData.quizQuestions}
              topic={currentTopicData.topic}
              onSelectMode={onSelectMode}
            />
          )}

          {activeMode === 'exam' && (
            <ExamMode
              questions={currentTopicData.quizQuestions}
              topic={currentTopicData.topic}
              onSelectMode={onSelectMode}
            />
          )}

          {activeMode === 'teach' && (
            <TeachMeMode
              data={currentTopicData}
              onSelectMode={onSelectMode}
            />
          )}

          {activeMode === 'verify' && (
            <VerifyMode
              topic={currentTopicData.topic}
            />
          )}
        </div>
      )}
    </div>
  );
};
