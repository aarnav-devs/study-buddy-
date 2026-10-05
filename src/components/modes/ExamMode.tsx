import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../../types';

interface ExamModeProps {
  questions: QuizQuestion[];
  topic: string;
  onSelectMode: (mode: any) => void;
}

export const ExamMode: React.FC<ExamModeProps> = ({ questions, topic, onSelectMode }) => {
  const safeList: QuizQuestion[] = questions && questions.length > 0 ? questions : [
    {
      question: `What fundamental rule governs ${topic}?`,
      options: ['Inputs transform systematically into observable outputs', 'Randomness without physical laws', 'It operates differently each second'],
      answer: 0,
      explanation: 'Core scientific and mathematical rules govern physical systems predictably.',
    },
    {
      question: 'Which method best validates conclusions about this topic?',
      options: ['Repeatable empirical experiments with controlled variables', 'Unchecked intuition', 'Ignoring contradictory data'],
      answer: 0,
      explanation: 'Empirical testing and peer review form the bedrock of scientific truth.',
    },
  ];

  const examQuestions = safeList.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const handleSelect = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    let correctCount = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / examQuestions.length) * 100);

    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-150 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Exam Assessment</span>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          {percent >= 80 ? 'Mastery Verified! 🌟' : 'Solid Assessment Check'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          You answered <strong className="text-slate-900">{correctCount} of {examQuestions.length}</strong> questions correctly under timed conditions.
        </p>

        {/* Circular score */}
        <div className="my-6 inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-blue-500 bg-blue-50/50">
          <span className="text-3xl font-black text-blue-700">{percent}%</span>
          <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">Mastery</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedAnswers({});
              setTimeLeft(120);
              setIsFinished(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
          <button
            onClick={() => onSelectMode('explain')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Review Concepts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const currentQ = examQuestions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
        {/* Header with Countdown Timer */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Focus Assessment</span>
            <div className="text-sm font-bold text-slate-800">
              Question {currentIndex + 1} of {examQuestions.length}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
            <Timer className="w-3.5 h-3.5 text-amber-600" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentIndex] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <span>{opt}</span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Nav buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((c) => Math.max(0, c - 1))}
            className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold disabled:opacity-30 cursor-pointer"
          >
            Previous
          </button>

          {currentIndex < examQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((c) => Math.min(examQuestions.length - 1, c + 1))}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
