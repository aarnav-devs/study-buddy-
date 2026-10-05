import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../../types';

interface QuizModeProps {
  questions: QuizQuestion[];
  topic: string;
  onFinish?: (score: number) => void;
  onSelectMode: (mode: any) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  questions,
  topic,
  onFinish,
  onSelectMode,
}) => {
  const safeQuestions: QuizQuestion[] = questions && questions.length > 0 ? questions : [
    {
      question: `What is the primary foundation of ${topic}?`,
      options: ['Understanding the key mechanism and inputs', 'Memorizing terms without context', 'Assuming random outcomes'],
      answer: 0,
      explanation: 'Grasping the core inputs and transformation mechanism makes every concept easy to understand.',
    },
    {
      question: 'How do scientists test hypotheses about this concept?',
      options: ['By changing one variable and observing the outcome', 'By ignoring contradictory evidence', 'By guessing once'],
      answer: 0,
      explanation: 'Controlled experiments isolate variables to confirm cause-and-effect relationships.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = safeQuestions[currentIndex] || safeQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < safeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
      });
      if (onFinish) {
        onFinish(score + (selectedOption === currentQ.answer ? 0 : 0));
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const percent = Math.round((score / safeQuestions.length) * 100);
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-150 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Quiz Complete!</span>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          {percent >= 70 ? 'Brilliant Mastery! 🎉' : 'Great Effort! Keep Exploring 🌱'}
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          You scored <strong className="text-slate-900">{score} out of {safeQuestions.length}</strong> on {topic}.
        </p>

        {/* Big score meter */}
        <div className="my-6 inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-emerald-500 bg-emerald-50/50">
          <span className="text-3xl font-black text-emerald-700">{percent}%</span>
          <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">Score</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <button
            onClick={() => onSelectMode('teach')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Level Up in Teach Me</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption === currentQ.answer;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
        {/* Progress Dots */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            {safeQuestions.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-7 bg-blue-600'
                    : idx < currentIndex
                    ? 'w-3 bg-emerald-500'
                    : 'w-3 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Question {currentIndex + 1} of {safeQuestions.length}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-6">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCurrentCorrect = idx === currentQ.answer;

            let buttonStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800';

            if (isAnswered) {
              if (isCurrentCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-50 border-rose-300 text-rose-900';
              } else {
                buttonStyle = 'bg-slate-50 border-slate-150 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${buttonStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isCurrentCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCurrentCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback & Explanation */}
        {isAnswered && (
          <div
            className={`mt-6 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed animate-fade-in ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {isCorrect ? (
                <>
                  <span>🎉 Exactly right!</span>
                </>
              ) : (
                <>
                  <span>💡 Good try! Here is why:</span>
                </>
              )}
            </div>
            <div>{currentQ.explanation}</div>
          </div>
        )}

        {/* Primary CTA button */}
        {isAnswered && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex < safeQuestions.length - 1 ? 'Next Question' : 'See Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
