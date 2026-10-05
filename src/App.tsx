import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { HomeDashboard } from './components/HomeDashboard';
import { LearnScreen } from './components/LearnScreen';
import { ProgressView } from './components/ProgressView';
import { SparkModal } from './components/SparkModal';
import { VoiceOverlay } from './components/VoiceOverlay';
import { OnboardingModal } from './components/OnboardingModal';
import { PRESET_TOPICS_CLIENT } from './data/presetTopics';
import { LearningMode, ProgressItem, TopicData, UserPreferences } from './types';
import { apiJson } from './lib/api';

const INITIAL_PROGRESS: ProgressItem[] = [
  { id: '1', topic: 'Photosynthesis', emoji: '🌱', percent: 82, lastSubtopic: 'Chloroplast Thylakoids', lastUpdated: 'Today' },
  { id: '2', topic: 'Electricity', emoji: '⚡', percent: 64, lastSubtopic: 'Ohm’s Law & Resistance', lastUpdated: 'Yesterday' },
  { id: '3', topic: 'DNA', emoji: '🧬', percent: 90, lastSubtopic: 'Complementary Base Pairing', lastUpdated: '3 days ago' },
  { id: '4', topic: 'Solar System', emoji: '🪐', percent: 75, lastSubtopic: 'Keplerian Orbits', lastUpdated: '4 days ago' },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'learn' | 'progress'>('home');
  const [activeTopic, setActiveTopic] = useState('Photosynthesis');
  const [topicData, setTopicData] = useState<TopicData>(PRESET_TOPICS_CLIENT['photosynthesis']);
  const [activeMode, setActiveMode] = useState<LearningMode>('explain');

  // Overlays
  const [isSparkOpen, setIsSparkOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // API connection status
  const [hasServerKey, setHasServerKey] = useState(false);

  // User & Progress State
  const [progressList, setProgressList] = useState<ProgressItem[]>(INITIAL_PROGRESS);
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    name: 'Alex',
    learningStyle: 'visual',
    gradeLevel: 'high',
    soundEnabled: true,
    streakDays: 5,
  });
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    apiJson<{ hasApiKey: boolean }>('/api/status')
      .then((d) => {
        if (d && typeof d.hasApiKey === 'boolean') {
          setHasServerKey(d.hasApiKey);
        }
      })
      .catch((err) => console.warn('Status check warning:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to load or fetch topic
  const loadTopic = async (
    topicName: string,
    targetMode: LearningMode = 'explain',
    isPresetClick: boolean = false
  ) => {
    const trimmed = topicName.trim();
    if (!trimmed) return;
    const norm = trimmed.toLowerCase();
    setActiveTopic(trimmed);
    setActiveMode(targetMode);

    // If explicitly clicked on one of the 4 curated demo presets, load instant visual preset
    if (isPresetClick && PRESET_TOPICS_CLIENT[norm]) {
      setTopicData(PRESET_TOPICS_CLIENT[norm]);
      setCurrentTab('learn');
      return;
    }

    // Dynamic AI generation tailored directly to what the student asked
    setIsLoadingTopic(true);
    setCurrentTab('learn');

    try {
      const data = await apiJson<{
        success: boolean;
        data?: TopicData;
        needsApiKey?: boolean;
        error?: string;
      }>('/api/study/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmed, isPreset: isPresetClick }),
      });

      if (data.success && data.data) {
        const generatedData = data.data;
        setTopicData(generatedData);
        setActiveTopic(generatedData.topic);

        // Track in learning list
        setProgressList((prev) => {
          const exists = prev.some((p) => p.topic.toLowerCase() === generatedData.topic.toLowerCase());
          if (!exists) {
            return [
              {
                id: Date.now().toString(),
                topic: generatedData.topic,
                emoji: generatedData.emoji || '💡',
                percent: 35,
                lastSubtopic: generatedData.headline?.slice(0, 30) || 'Started',
                lastUpdated: 'Just now',
              },
              ...prev,
            ];
          }
          return prev;
        });
      } else if (data.needsApiKey) {
        showToast('Gemini key is missing. Set GEMINI_API_KEY in Vercel environment variables and redeploy.');
      } else {
        showToast(data.error || 'Could not load AI explanation. Please try again.');
      }
    } catch (err: any) {
      console.warn('Failed to load topic from server:', err);
      showToast(err instanceof Error ? err.message : 'Could not connect to Study Buddy AI.');
    } finally {
      setIsLoadingTopic(false);
    }
  };

  const handleLaunchSpark = async (topicName?: string, isPresetClick: boolean = false) => {
    const target = topicName || activeTopic;
    const norm = target.toLowerCase().trim();

    if (isPresetClick && PRESET_TOPICS_CLIENT[norm]) {
      const found = PRESET_TOPICS_CLIENT[norm];
      setTopicData(found);
      setActiveTopic(found.topic);
      setIsSparkOpen(true);
    } else if (topicData.topic.toLowerCase() === norm) {
      setIsSparkOpen(true);
    } else {
      await loadTopic(target, 'explain', isPresetClick);
      setIsSparkOpen(true);
    }
  };

  const handleMarkUnderstood = () => {
    setProgressList((prev) => {
      const exists = prev.some((item) => item.topic.toLowerCase() === activeTopic.toLowerCase());
      if (exists) {
        return prev.map((item) => {
          if (item.topic.toLowerCase() === activeTopic.toLowerCase()) {
            const newPercent = Math.min(100, item.percent + 8);
            return { ...item, percent: newPercent, lastUpdated: 'Just now' };
          }
          return item;
        });
      } else {
        const newItem: ProgressItem = {
          id: Date.now().toString(),
          topic: activeTopic,
          emoji: topicData.emoji || '💡',
          percent: 50,
          lastSubtopic: 'Core Concepts',
          lastUpdated: 'Just now',
        };
        return [newItem, ...prev];
      }
    });
    showToast(`Progress saved: ${activeTopic} understanding increased! 🌱`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbff] text-slate-900 pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        streakDays={userPrefs.streakDays}
        onOpenPreferences={() => setIsOnboardingOpen(true)}
        hasAiConnected={hasServerKey}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-4 pb-12">
        {currentTab === 'home' && (
          <HomeDashboard
            onSearchTopic={(q) => loadTopic(q, 'explain', false)}
            onLaunchSpark={(topicName) => handleLaunchSpark(topicName, true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onSelectShortcutMode={(t, mode) => loadTopic(t, mode, true)}
            progressList={progressList}
          />
        )}

        {currentTab === 'learn' && (
          <LearnScreen
            currentTopicData={topicData}
            activeMode={activeMode}
            onSelectMode={setActiveMode}
            onLaunchSpark={() => setIsSparkOpen(true)}
            isLoadingTopic={isLoadingTopic}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            progressList={progressList}
            streakDays={userPrefs.streakDays}
            onContinueTopic={(t) => loadTopic(t, 'explain', false)}
            onLaunchSpark={(t) => handleLaunchSpark(t, false)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* 30-Second Spark Modal (Visual Highlight) */}
      <SparkModal
        isOpen={isSparkOpen}
        onClose={() => setIsSparkOpen(false)}
        topic={topicData.topic}
        emoji={topicData.emoji}
        sparkSteps={topicData.sparkSteps}
        onOpenTeachMe={() => {
          setCurrentTab('learn');
          setActiveMode('teach');
        }}
        onMarkUnderstood={handleMarkUnderstood}
      />

      {/* Voice Recognition Modal */}
      <VoiceOverlay
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSelectQuery={(q) => loadTopic(q, 'explain', false)}
      />

      {/* Personalisation Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(newPrefs, chosenTopic) => {
          setUserPrefs(newPrefs);
          if (chosenTopic) {
            loadTopic(chosenTopic, 'explain', false);
          }
          showToast('Preferences updated for Google Study Buddy!');
        }}
      />

      {/* Clean toast notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-slate-800 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
