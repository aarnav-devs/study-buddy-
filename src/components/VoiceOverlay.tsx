import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2 } from 'lucide-react';
import { StudyBuddyLogo } from './StudyBuddyLogo';

interface VoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

export const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
  isOpen,
  onClose,
  onSelectQuery,
}) => {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [recognizedText, setRecognizedText] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(true);
      setTranscript('');
      setRecognizedText(null);
      return;
    }

    // Try Web Speech API if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    let recognition: any = null;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          if (event.results[current].isFinal) {
            setRecognizedText(text);
            setTimeout(() => {
              onSelectQuery(text);
              onClose();
            }, 900);
          }
        };

        recognition.onerror = () => {
          // Fall back gracefully
        };

        recognition.start();
      } catch (err) {
        console.warn('Speech recognition not active:', err);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch {}
      }
    };
  }, [isOpen, onSelectQuery, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-150 text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot Logo with Headphones */}
        <div className="mb-4">
          <StudyBuddyLogo size={70} animated={true} />
        </div>

        {/* Soft Waveform Bars */}
        <div className="flex items-center justify-center gap-1.5 h-10 mb-4">
          {[40, 75, 50, 90, 65, 80, 45].map((height, i) => (
            <div
              key={i}
              className="w-1.5 bg-blue-600 rounded-full animate-pulse"
              style={{
                height: `${height}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>

        {/* State Label */}
        <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
          {recognizedText ? 'Voice Captured' : 'Listening...'}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {recognizedText ? (
            `"${recognizedText}"`
          ) : transcript ? (
            `"${transcript}"`
          ) : (
            'Ask Study Buddy anything...'
          )}
        </h3>

        <p className="text-xs text-slate-500 max-w-xs mb-6">
          Speak your question naturally. Study Buddy will break it down into clean visual steps.
        </p>

        {/* Quick Voice Prompt Shortcuts */}
        <div className="w-full pt-4 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Or tap a voice prompt:
          </div>
          <div className="flex flex-col gap-1.5 text-xs">
            {[
              'Explain photosynthesis simply',
              'How does electrical current flow?',
              'Why do planets orbit the Sun?',
              'What is DNA base pairing?',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setRecognizedText(q);
                  setTimeout(() => {
                    onSelectQuery(q);
                    onClose();
                  }, 600);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-left transition font-medium flex items-center justify-between cursor-pointer"
              >
                <span>"{q}"</span>
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
