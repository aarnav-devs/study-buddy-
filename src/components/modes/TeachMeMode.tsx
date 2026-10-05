import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, ArrowRight, MessageSquare, RotateCcw } from 'lucide-react';
import { TopicData, TeachStep } from '../../types';
import { StudyBuddyLogo } from '../StudyBuddyLogo';

interface TeachMeModeProps {
  data: TopicData;
  onSelectMode: (mode: any) => void;
}

export const TeachMeMode: React.FC<TeachMeModeProps> = ({ data, onSelectMode }) => {
  const challenge = data.teachChallenge?.steps?.length ? data.teachChallenge : {
    problem: `Let’s explore the core foundation of ${data.topic}. How does it operate when tested?`,
    steps: [
      {
        id: 'step1',
        question: `What is the key principle to keep in mind when exploring ${data.topic}?`,
        options: ['Identify the core inputs and mechanism', 'Memorize without understanding', 'Skip the fundamentals'],
        correctIndex: 0,
        hint: 'Always focus on the relationship between causes and effects.',
        encouragement: 'Brilliant! Starting with the core relationship is the hallmark of great scientific thinking.',
      },
      {
        id: 'step2',
        question: 'When inputs or conditions change, how should we expect the system to respond?',
        options: ['Predictably according to natural or mathematical laws', 'Randomly without reason', 'It stops existing'],
        correctIndex: 0,
        hint: 'Consistent laws govern physical and biological processes.',
        encouragement: 'Outstanding! You reasoned through the puzzle with first principles. 🎉',
      },
    ],
  };
  const steps: TeachStep[] = challenge.steps;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleSelectOption = (idx: number) => {
    // If student already selected the correct answer, lock this step
    if (isAnswered && selectedOption === currentStep.correctIndex) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentStep.correctIndex) {
      if (currentStepIndex === steps.length - 1) {
        setIsCompleted(true);
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
        });
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setIsAnswered(false);
    setIsCompleted(false);
  };

  if (!currentStep) {
    return (
      <div className="p-8 text-center text-slate-500">
        No challenge currently available for this topic.
      </div>
    );
  }

  const isCorrect = selectedOption === currentStep.correctIndex;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Introduction Card with Study Buddy Avatar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm flex items-start gap-4">
        <StudyBuddyLogo size={52} animated={true} className="mt-1" />
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Socratic Guided Learning</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Let’s Think Through This Together
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {challenge.problem}
          </p>
        </div>
      </div>

      {/* Main Interactive Socratic Step */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Question → Think → Hint → Understand
            </span>
          </div>

          {!showHint && !isAnswered && (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need a nudge?</span>
            </button>
          )}
        </div>

        {/* Nudge / Hint banner */}
        {showHint && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5 animate-fade-in">
            <span className="text-sm">💡</span>
            <div>
              <strong className="font-bold">Friendly Nudge: </strong>
              {currentStep.hint}
            </div>
          </div>
        )}

        {/* The Question */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-5">
          {currentStep.question}
        </h3>

        {/* Interactive Option Cards */}
        <div className="space-y-3">
          {currentStep.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isThisCorrect = idx === currentStep.correctIndex;

            let buttonStyle = 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/90 text-slate-800';

            if (isAnswered) {
              if (isThisCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20';
              } else if (isSelected) {
                buttonStyle = 'bg-amber-50/70 border-amber-300 text-amber-900';
              } else {
                buttonStyle = 'bg-slate-50 border-slate-150 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered && isCorrect}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${buttonStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Conversational Socratic Feedback */}
        {isAnswered && (
          <div
            className={`mt-6 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed animate-fade-in ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            {isCorrect ? (
              <div>
                <span className="font-bold block mb-1">You’ve got it! ✨</span>
                {currentStep.encouragement}
              </div>
            ) : (
              <div>
                <span className="font-bold block mb-1">Almost there — let’s think about this:</span>
                {currentStep.hint} Try choosing the option that directly connects to that principle!
              </div>
            )}
          </div>
        )}

        {/* Next step button */}
        {isAnswered && isCorrect && !isCompleted && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNextStep}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Guided Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Completed Socratic mastery */}
        {isCompleted && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <span>🎉 Concept Mastered</span>
            </div>
            <h4 className="text-xl font-black text-slate-900">
              You Thought It Through Like a Scientist!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Instead of just reading an answer, you reasoned through the problem step-by-step.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Again</span>
              </button>
              <button
                onClick={() => onSelectMode('verify')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify a Science Fact</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
