import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, BookOpen, Brain, Zap } from 'lucide-react';
import { UserPreferences } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (prefs: UserPreferences, chosenTopic?: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [learningStyle, setLearningStyle] = useState<'visual' | 'step-by-step' | 'socratic'>('visual');
  const [gradeLevel, setGradeLevel] = useState<'middle' | 'high' | 'college'>('high');
  const [chosenTopic, setChosenTopic] = useState('Photosynthesis');

  if (!isOpen) return null;

  const handleFinish = () => {
    onComplete(
      {
        name: 'Student',
        learningStyle,
        gradeLevel,
        soundEnabled: true,
        streakDays: 5,
      },
      chosenTopic
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-150 relative">
        {/* Progress indicator: 1 / 3 */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-6">
          <span className="uppercase tracking-wider">Personalize Your Buddy</span>
          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
            {step} / 3
          </span>
        </div>

        {/* Step 1: Learning Style */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                How do you understand concepts best?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We will adapt our explanations and visual models to match your natural flow.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                {
                  id: 'visual',
                  title: 'Visual & Interactive',
                  desc: 'Animated models, diagrams, and direct hands-on simulations',
                  icon: '🎨',
                },
                {
                  id: 'step-by-step',
                  title: 'Step-by-Step Breakdown',
                  desc: 'Bite-sized cards, clear formulas, and structured checklists',
                  icon: '📝',
                },
                {
                  id: 'socratic',
                  title: 'Socratic Dialogue',
                  desc: 'Guide me with questions and hints so I figure it out myself',
                  icon: '🤝',
                },
              ].map((item) => {
                const isSelected = learningStyle === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLearningStyle(item.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-bold">{item.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Level */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                What level describes your studies?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Keeps vocabulary and depth just right—never too simplistic, never overwhelming.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'middle', title: 'Middle School', desc: 'Ages 11–14 · Foundational principles & big picture', icon: '🎒' },
                { id: 'high', title: 'High School', desc: 'Ages 14–18 · Standard curriculum & exam preparation', icon: '📐' },
                { id: 'college', title: 'College & Lifelong Learner', desc: 'Deeper mechanisms, formulas, and real-world rigor', icon: '🎓' },
              ].map((item) => {
                const isSelected = gradeLevel === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setGradeLevel(item.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-bold">{item.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose initial topic */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Where should we begin?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Pick a topic to jump straight into your first 30-Second Spark or exploration.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                { name: 'Photosynthesis', emoji: '🌱', desc: 'Solar Energy & Plants' },
                { name: 'Electricity', emoji: '⚡', desc: 'Circuits & Electrons' },
                { name: 'Solar System', emoji: '🪐', desc: 'Gravity & Planetary Orbits' },
                { name: 'DNA', emoji: '🧬', desc: 'Double Helix & Code of Life' },
              ].map((item) => {
                const isSelected = chosenTopic.toLowerCase() === item.name.toLowerCase();
                return (
                  <button
                    key={item.name}
                    onClick={() => setChosenTopic(item.name)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Learning</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
