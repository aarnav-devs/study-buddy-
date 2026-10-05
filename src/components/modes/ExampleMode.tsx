import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { TopicData } from '../../types';

interface ExampleModeProps {
  data: TopicData;
  onSelectMode: (mode: any) => void;
}

interface Scenario {
  title: string;
  question: string;
  explanation: string;
  tag: string;
}

const TOPIC_SCENARIOS: Record<string, Scenario[]> = {
  photosynthesis: [
    {
      title: 'Autumn Leaf Colors',
      question: 'Why do green tree leaves turn brilliant red, orange, and yellow in autumn?',
      explanation: 'When days shorten and temperatures drop, trees stop producing green chlorophyll. As the green fades away, underlying carotenoids (orange) and anthocyanins (red) are finally revealed!',
      tag: 'Nature Mystery',
    },
    {
      title: 'The Phytoplankton Paradox',
      question: 'Why do ocean waves produce more oxygen than the Amazon rainforest?',
      explanation: 'Billions of trillions of microscopic ocean algae (phytoplankton) photosynthesize across 71% of Earth’s surface, generating 50% to 80% of all atmospheric oxygen!',
      tag: 'Planet Earth',
    },
    {
      title: 'Houseplants in Winter',
      question: 'Why do houseplants grow slower in winter even inside a warm heated house?',
      explanation: 'Even with warm temperatures and moist soil, shorter winter sunlight hours mean chloroplasts receive far fewer photons, throttling glucose production.',
      tag: 'Daily Observation',
    },
  ],
  electricity: [
    {
      title: 'The Bird on the High-Voltage Line',
      question: 'Why don’t birds get electrocuted when perched on uninsulated power wires carrying 10,000 volts?',
      explanation: 'Electricity flows through the path of least resistance between two different electrical potentials. Both of the bird’s feet are on the same wire at the same voltage, so no current flows through its body!',
      tag: 'Physics Wonder',
    },
    {
      title: 'Why Static Shocks Spark in Winter',
      question: 'Why do you get zapped by metal doorknobs after walking on carpets in dry winter air?',
      explanation: 'Dry cold air is an insulator that prevents static electrons from dissipating into water vapor. Your body builds up thousands of volts until touching metal provides an instant conductive path.',
      tag: 'Everyday Shock',
    },
    {
      title: 'Why Charging Phones Heat Up',
      question: 'Why does your phone or laptop charger brick get warm while charging fast?',
      explanation: 'According to Joule heating (P = I² × R), pushing high electrical currents through internal circuits produces waste heat due to internal electrical resistance.',
      tag: 'Tech in Pocket',
    },
  ],
  'solar system': [
    {
      title: 'Why Mercury Isn’t the Hottest',
      question: 'Why is Venus significantly hotter than Mercury, even though Mercury is twice as close to the Sun?',
      explanation: 'Mercury has virtually no atmosphere to trap heat, so heat escapes into space. Venus has a monstrous 96% CO₂ atmosphere creating an impenetrable greenhouse trap at 465°C!',
      tag: 'Cosmic Mystery',
    },
    {
      title: 'Weightless Astronauts',
      question: 'Why do astronauts float on the International Space Station if Earth’s gravity up there is still 90% as strong?',
      explanation: 'Astronauts are NOT in zero gravity! They and the space station are in perpetual freefall around Earth at 28,000 km/h. They float because the station falls at the exact same rate they do.',
      tag: 'Orbital Mechanics',
    },
  ],
  dna: [
    {
      title: 'Identical Twins & Fingerprints',
      question: 'Identical twins share 100% of their DNA. Why don’t they have identical fingerprints?',
      explanation: 'While DNA writes the initial cellular blueprint, physical forces like amniotic fluid swirls, umbilical cord movement, and intrauterine pressure sculpt fingerprint ridges uniquely for each twin.',
      tag: 'Genetics & Life',
    },
    {
      title: 'Forensic DNA Fingerprinting',
      question: 'How can a single drop of saliva from a 20-year-old cold case solve a crime?',
      explanation: 'PCR (Polymerase Chain Reaction) machines replicate a few target DNA fragments billions of times in hours, matching unique short tandem repeats (STRs) with 99.999% statistical accuracy.',
      tag: 'Forensics',
    },
  ],
};

export const ExampleMode: React.FC<ExampleModeProps> = ({ data, onSelectMode }) => {
  const normalized = (data.topic || '').toLowerCase();
  const scenarios = TOPIC_SCENARIOS[normalized] || [
    {
      title: `Real-world Application of ${data.topic}`,
      question: `How does understanding ${data.topic} help engineers and scientists today?`,
      explanation: `Principles of ${data.topic} allow us to model complex systems, optimize real outcomes, and avoid common errors by predicting behavior before building prototypes.`,
      tag: 'Application',
    },
    {
      title: `Common Everyday Paradox`,
      question: `What is the biggest myth people believe about ${data.topic}?`,
      explanation: `People often assume systems operate by sheer chance, but systematic principles and formulas explain every nuance once broken down into small steps.`,
      tag: 'Mythbuster',
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World Scenarios</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          How {data.topic} Works in Real Life
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore curious real-world puzzles that become crystal clear once you know the core principles.
        </p>
      </div>

      <div className="space-y-3.5">
        {scenarios.map((sc, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-150 shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition"
              >
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    {sc.tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {sc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                    {sc.question}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-slate-100 text-slate-600 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-slate-100 mt-2 bg-blue-50/30">
                  <div className="pt-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    <span className="font-bold text-blue-900 block mb-1">The Science Behind It:</span>
                    {sc.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Primary Action Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-150 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready for a challenge?</div>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">
            Step into Teach Me mode and solve a guided problem together.
          </p>
        </div>
        <button
          onClick={() => onSelectMode('teach')}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Try Guided Teach Me</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
