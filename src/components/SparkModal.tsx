import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Play, Pause, RotateCcw, ArrowRight, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { SparkStep } from '../types';
import { StudyBuddyLogo } from './StudyBuddyLogo';

interface SparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  emoji: string;
  sparkSteps: SparkStep[];
  onOpenTeachMe: () => void;
  onMarkUnderstood: () => void;
}

export const SparkModal: React.FC<SparkModalProps> = ({
  isOpen,
  onClose,
  topic,
  emoji,
  sparkSteps,
  onOpenTeachMe,
  onMarkUnderstood,
}) => {
  const safeSteps: SparkStep[] = sparkSteps && sparkSteps.length > 0 ? sparkSteps : [
    { step: 1, title: 'The Big Idea', description: `Explore the foundational concept behind ${topic}.`, visualHint: 'core' },
    { step: 2, title: 'The Mechanism', description: 'See how the components interact in harmony.', visualHint: 'process' },
    { step: 3, title: 'In Action', description: 'Observe the transformation step-by-step.', visualHint: 'action' },
    { step: 4, title: 'Real World Impact', description: 'Why this concept shapes our everyday lives.', visualHint: 'impact' },
    { step: 5, title: 'Takeaway Checkpoint', description: 'One key truth to remember forever.', visualHint: 'complete' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // 30-second countdown
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setTimeLeft(30);
      setIsRunning(true);
      setIsFinished(false);
      return;
    }

    if (!isRunning || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isRunning, isFinished]);

  // Synchronize step progression forward with the 30-second clock (6 seconds per step)
  useEffect(() => {
    if (!isFinished && isRunning) {
      const elapsed = 30 - timeLeft;
      const calculatedStep = Math.min(safeSteps.length - 1, Math.floor(elapsed / 6));
      // Only advance forward! Never snap back if student navigated forward
      if (calculatedStep > currentStep) {
        setCurrentStep(calculatedStep);
      }
    }
  }, [timeLeft, isFinished, isRunning, safeSteps.length, currentStep]);

  if (!isOpen) return null;

  const activeStepData = safeSteps[currentStep] || safeSteps[0];

  const handleNextStep = () => {
    if (currentStep < safeSteps.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      setIsFinished(true);
      setTimeLeft(0);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setTimeLeft(30);
    setIsRunning(true);
    setIsFinished(false);
  };

  const handleUnderstand = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
    });
    onMarkUnderstood();
    setTimeout(() => {
      onClose();
    }, 900);
  };

  // Visual Concept Illustration for each step
  const renderVisualIllustration = () => {
    const hint = activeStepData?.visualHint || '';
    const norm = topic.toLowerCase();

    if (norm.includes('photo') || hint.includes('plant') || hint.includes('sun')) {
      return (
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping opacity-20" />
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl shadow-emerald-500/20 flex flex-col items-center justify-center text-white transition-all transform duration-500">
            <span className="text-4xl sm:text-5xl mb-1 animate-bounce" style={{ animationDuration: '2.5s' }}>
              {currentStep === 0 ? '☀️' : currentStep === 1 ? '🍃' : currentStep === 2 ? '💧' : currentStep === 3 ? '🍬' : '🌱'}
            </span>
            <span className="text-xs font-bold tracking-wider uppercase opacity-90">
              {currentStep === 0 ? 'Solar Energy' : currentStep === 1 ? 'Chloroplast' : currentStep === 2 ? 'Splitting H₂O' : currentStep === 3 ? 'Glucose' : 'Mastered'}
            </span>
          </div>
        </div>
      );
    }

    if (norm.includes('electr') || hint.includes('circuit')) {
      return (
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-100/50 animate-ping opacity-25" />
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-xl shadow-amber-500/20 flex flex-col items-center justify-center text-white">
            <span className="text-4xl sm:text-5xl mb-1 animate-pulse">
              {currentStep === 0 ? '⚛️' : currentStep === 1 ? '🔋' : currentStep === 2 ? '⚡' : currentStep === 3 ? '💡' : '✨'}
            </span>
            <span className="text-xs font-bold tracking-wider uppercase opacity-90">
              {currentStep === 0 ? 'Electrons' : currentStep === 1 ? 'Voltage Push' : currentStep === 2 ? 'Current Flow' : currentStep === 3 ? 'Glowing Light' : 'Loop Closed'}
            </span>
          </div>
        </div>
      );
    }

    if (norm.includes('solar') || hint.includes('sun') || hint.includes('orbit')) {
      return (
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-sky-200 animate-spin" style={{ animationDuration: '10s' }} />
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-xl shadow-sky-600/20 flex flex-col items-center justify-center text-white">
            <span className="text-4xl sm:text-5xl mb-1">
              {currentStep === 0 ? '☀️' : currentStep === 1 ? '🪐' : currentStep === 2 ? '🌍' : currentStep === 3 ? '🚀' : '🌌'}
            </span>
            <span className="text-xs font-bold tracking-wider uppercase opacity-90">
              {currentStep === 0 ? 'Solar Mass' : currentStep === 1 ? 'Kepler Orbits' : currentStep === 2 ? 'Gravitational Lock' : currentStep === 3 ? 'Cosmic Shield' : 'Harmony'}
            </span>
          </div>
        </div>
      );
    }

    // Default DNA or generic
    return (
      <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 shadow-xl shadow-blue-500/20 flex flex-col items-center justify-center text-white">
          <span className="text-4xl sm:text-5xl mb-1 animate-pulse">
            {emoji || '💡'}
          </span>
          <span className="text-xs font-bold tracking-wider uppercase opacity-90">
            Step {currentStep + 1}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">30-Second Spark</div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-none">{topic}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 00:30 Timer Display */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
              <span>00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>

            {/* Play / Pause toggle */}
            {!isFinished && (
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title={isRunning ? 'Pause spark' : 'Resume spark'}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Line: 1 ─ 2 ─ 3 ─ 4 ─ 5 */}
        <div className="px-6 pt-4 flex items-center justify-between max-w-xs mx-auto w-full">
          {safeSteps.map((_, idx) => (
            <React.Fragment key={idx}>
              <div
                onClick={() => {
                  setCurrentStep(idx);
                  setIsRunning(false);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 cursor-pointer ${
                  idx === currentStep
                    ? 'bg-blue-600 text-white shadow-xs scale-110'
                    : idx < currentStep
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {idx + 1}
              </div>
              {idx < safeSteps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1.5 transition-colors duration-300 ${
                    idx < currentStep ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Focused Educational Concept Area */}
        <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center">
          {!isFinished ? (
            <div className="space-y-6">
              {renderVisualIllustration()}

              <div className="max-w-md mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Concept 0{currentStep + 1} of 0{safeSteps.length}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeStepData?.title}
                </h4>
                <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                  {activeStepData?.description}
                </p>
              </div>

              {/* Next Step Primary CTA */}
              <div className="pt-2">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentStep < sparkSteps.length - 1 ? 'Next Concept' : 'Finish Spark'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* End Screen: Got it? */
            <div className="space-y-6 py-4 animate-fade-in">
              <div className="flex justify-center">
                <StudyBuddyLogo size={68} animated={true} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">30 Seconds Finished</span>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Got It?
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  You’ve grasped the core engine of {topic}. How do you want to proceed?
                </p>
              </div>

              {/* Required 3 Actions: [I understand ✓], [Explain again ↻], [Teach me →] */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleUnderstand}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I understand ✓</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Explain again ↻</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenTeachMe();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Teach me →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
