import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: [path.resolve(__dirname, '.env.local'), path.resolve(__dirname, '.env')],
});

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Multi-model cascade for rock-solid reliability: tries fastest first, then fallbacks
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];

function getGenAIClient(customKey?: string): GoogleGenAI | null {
  const key = customKey || process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateWithGemini(
  prompt: string,
  customKey?: string,
  isJson: boolean = true
): Promise<string> {
  const client = getGenAIClient(customKey);
  if (!client) {
    throw new Error('NO_GEMINI_API_KEY');
  }

  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: isJson ? { responseMimeType: 'application/json' } : undefined,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model ${model} encountered an issue, trying next candidate:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini candidate models failed to generate content');
}

// Curated instant rich presets for the 4 showcase topics
const PRESET_TOPICS: Record<string, any> = {
  photosynthesis: {
    topic: 'Photosynthesis',
    emoji: '🌱',
    headline: 'How plants turn sunlight, air, and water into food and oxygen.',
    flow: [
      { step: 1, label: 'Ingredients', detail: '☀️ Sunlight + 💧 Water + 🌫 CO₂', icon: 'Sun' },
      { step: 2, label: 'The Solar Factory', detail: 'Chloroplasts inside green leaves trap photons', icon: 'Leaf' },
      { step: 3, label: 'The Magic Output', detail: '🍬 Glucose (food) + 💨 Oxygen (air to breathe)', icon: 'Sparkles' },
    ],
    analogy: 'Think of a leaf as a tiny solar-powered bakery. The sun is the oven, water and carbon dioxide are the flour and sugar, and the baked goods are fresh sweet glucose and fresh air!',
    keyPoints: [
      'Chlorophyll is the green pigment that absorbs red and blue light waves.',
      'Plants make glucose for their own energy and store the rest as starch.',
      'All oxygen we breathe originally came from photosynthetic plants and algae.',
    ],
    curiousQuestion: 'Did you know that over 50% of Earth\'s oxygen is produced not by trees, but by microscopic oceanic phytoplankton?',
    sparkSteps: [
      {
        step: 1,
        title: 'The Big Idea',
        description: 'Plants do not eat food from soil. They literally create food out of thin air and pure sunlight.',
        visualHint: 'sun-plant',
      },
      {
        step: 2,
        title: 'The Secret Ingredient: Chlorophyll',
        description: 'Inside plant cells are millions of tiny green solar panels called Chloroplasts packed with chlorophyll.',
        visualHint: 'chloroplast',
      },
      {
        step: 3,
        title: 'The Reaction Formula',
        description: '6CO₂ (carbon dioxide) + 6H₂O (water) + Light ──→ C₆H₁₂O₆ (glucose) + 6O₂ (oxygen).',
        visualHint: 'formula',
      },
      {
        step: 4,
        title: 'Why It Powers All Life',
        description: 'Without photosynthesis, atmospheric oxygen drops to zero and the entire global food chain collapses.',
        visualHint: 'ecosystem',
      },
      {
        step: 5,
        title: 'Takeaway Checkpoint',
        description: 'Sunlight in, glucose stored, oxygen released. Nature\'s cleanest circular engine.',
        visualHint: 'complete',
      },
    ],
    teachChallenge: {
      problem: 'A botanist places a green waterweed plant inside a test tube with water under a lamp. Tiny gas bubbles start rising quickly. What are those bubbles, and what happens if we move the lamp further away?',
      steps: [
        {
          id: 'step1',
          question: 'What gas is inside the rising bubbles produced by the plant under the lamp?',
          options: ['Pure Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen Gas (N₂)', 'Water Vapor (H₂O)'],
          correctIndex: 0,
          hint: 'Think about what gas leaves the plant as a byproduct of photosynthesis when light hits it.',
          encouragement: 'Brilliant deduction! The light reaction splits water molecules and releases pure oxygen gas.',
        },
        {
          id: 'step2',
          question: 'If we slide the lamp twice as far away, what happens to the number of bubbles per minute?',
          options: ['The bubbles increase', 'The bubbles decrease', 'They stay exactly the same', 'The bubbles turn into steam'],
          correctIndex: 1,
          hint: 'Less light means less energy reaching the chloroplasts.',
          encouragement: 'Spot on! Less light intensity slows down the photosynthesis rate, meaning fewer oxygen bubbles.',
        },
        {
          id: 'step3',
          question: 'What would happen if we turned off the light completely and added green dye to the water?',
          options: ['Photosynthesis stops because light is required', 'The plant eats the green dye', 'Oxygen bubbles speed up', 'The water boils'],
          correctIndex: 0,
          hint: 'Photosynthesis literally means "making things using light".',
          encouragement: 'You completely understand the core concept! Without photons of light, the reaction cannot proceed.',
        },
      ],
    },
    quizQuestions: [
      {
        question: 'Which tiny cell organelle is responsible for trapping sunlight?',
        options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'],
        answer: 1,
        explanation: 'Chloroplasts contain chlorophyll, the green molecule that absorbs sunlight energy.',
      },
      {
        question: 'What are the two main products created by photosynthesis?',
        options: ['Glucose and Oxygen', 'Water and Carbon Dioxide', 'Nitrogen and Heat', 'Salt and Minerals'],
        answer: 0,
        explanation: 'Plants produce sugar (glucose) for energy and release oxygen (O₂) into the atmosphere.',
      },
      {
        question: 'Where do plants primarily absorb carbon dioxide from?',
        options: ['Through their roots in soil', 'Through tiny leaf pores called stomata', 'From rainwater droplets', 'Through bark fibers'],
        answer: 1,
        explanation: 'Stomata are microscopic pores on the underside of leaves that inhale CO₂ and exhale O₂.',
      },
    ],
  },
  electricity: {
    topic: 'Electricity',
    emoji: '⚡',
    headline: 'The movement of electrons powering our modern world.',
    flow: [
      { step: 1, label: 'Charge Carrier', detail: 'Tiny negative electrons in atoms', icon: 'Atom' },
      { step: 2, label: 'The Push (Voltage)', detail: 'Batteries create electrical pressure', icon: 'Battery' },
      { step: 3, label: 'The Flow (Current)', detail: 'Electrons drift through conductors to do work', icon: 'Zap' },
    ],
    analogy: 'Think of voltage as water pressure in a pipe, current as the amount of water flowing past every second, and resistance as a narrow nozzle restricting the flow.',
    keyPoints: [
      'Current (Amperes) only flows through a complete, unbroken closed circuit.',
      'Ohm\'s Law connects Voltage (V), Current (I), and Resistance (R): V = I × R.',
      'Metals like copper conduct electricity because their valence electrons can drift freely.',
    ],
    curiousQuestion: 'Did you know that while individual electrons drift at less than 1 mm per second, the electrical wave travels at nearly the speed of light?',
    sparkSteps: [
      {
        step: 1,
        title: 'The Invisible Force',
        description: 'Everything around you is made of atoms. Electricity is simply the organized movement of their outer electrons.',
        visualHint: 'electron-cloud',
      },
      {
        step: 2,
        title: 'The Golden Trio: V, I, and R',
        description: 'Voltage pushes (Volts). Current flows (Amperes). Resistance opposes (Ohms).',
        visualHint: 'ohms-law',
      },
      {
        step: 3,
        title: 'Closed vs Open Circuit',
        description: 'A switch creates an air gap. Air has huge resistance, dropping current instantly to zero.',
        visualHint: 'switch-circuit',
      },
      {
        step: 4,
        title: 'Energy Transformation',
        description: 'Electrons colliding with the filament atom lattice turn kinetic energy into glowing light and warmth.',
        visualHint: 'bulb-glow',
      },
      {
        step: 5,
        title: 'Takeaway Checkpoint',
        description: 'Close the loop, provide the push, and electrons deliver instant power.',
        visualHint: 'complete',
      },
    ],
    teachChallenge: {
      problem: 'You have a 9V battery and a small flashlight bulb with 3 Ohms of resistance. Let\'s find out how much electric current flows!',
      steps: [
        {
          id: 'step1',
          question: 'What relationship connects Voltage (V), Current (I), and Resistance (R)?',
          options: ['V = I × R (Ohm\'s Law)', 'V = I + R', 'V = I ÷ R²', 'V = R ÷ I'],
          correctIndex: 0,
          hint: 'Voltage equals the product of current flowing through the resistance.',
          encouragement: 'Awesome! That is Ohm\'s Law, the foundation of all electrical engineering.',
        },
        {
          id: 'step2',
          question: 'Rearranging the formula to find Current (I), what is the formula?',
          options: ['I = V ÷ R', 'I = V × R', 'I = R ÷ V', 'I = V - R'],
          correctIndex: 0,
          hint: 'Divide both sides of V = I × R by R.',
          encouragement: 'Exactly right! To find current, we divide the voltage push by the resistance.',
        },
        {
          id: 'step3',
          question: 'With V = 9 Volts and R = 3 Ohms, what is the current in Amperes?',
          options: ['3 Amperes', '27 Amperes', '0.33 Amperes', '12 Amperes'],
          correctIndex: 0,
          hint: 'Calculate 9 divided by 3.',
          encouragement: 'Outstanding! 🎉 9 ÷ 3 = 3 Amperes. You solved it using first principles!',
        },
      ],
    },
    quizQuestions: [
      {
        question: 'What happens to the current in a circuit if you double the resistance while keeping voltage the same?',
        options: ['Current doubles', 'Current halves', 'Current stays the same', 'Current drops to zero'],
        answer: 1,
        explanation: 'According to Ohm\'s Law (I = V/R), current is inversely proportional to resistance.',
      },
      {
        question: 'Why are electrical wires wrapped in rubber or plastic?',
        options: ['Because rubber increases voltage', 'Because rubber is an insulator that prevents electric shocks', 'To make the wire heavier', 'To speed up electrons'],
        answer: 1,
        explanation: 'Insulators do not allow free electron flow, keeping electrical energy contained safely.',
      },
      {
        question: 'Which unit measures electrical resistance?',
        options: ['Volt', 'Ampere', 'Ohm (Ω)', 'Watt'],
        answer: 2,
        explanation: 'Resistance is measured in Ohms (Ω), named after Georg Ohm.',
      },
    ],
  },
  'solar system': {
    topic: 'Solar System',
    emoji: '🪐',
    headline: 'Our cosmic neighborhood bound together by gravity.',
    flow: [
      { step: 1, label: 'The Anchor', detail: '☀️ The Sun holds 99.86% of all mass', icon: 'Sun' },
      { step: 2, label: 'The Inner Terrestrials', detail: 'Mercury, Venus, Earth, Mars (Rocky)', icon: 'Globe' },
      { step: 3, label: 'The Outer Giants', detail: 'Jupiter, Saturn, Uranus, Neptune (Gas & Ice)', icon: 'Sparkles' },
    ],
    analogy: 'Imagine swinging a tetherball around a pole on a string. Gravity is the invisible string pulling planets inward while their forward momentum keeps them in eternal orbit!',
    keyPoints: [
      'Formed roughly 4.6 billion years ago from a collapsing interstellar gas cloud.',
      'Inner rocky planets are dense and small; outer planets are massive gas and ice worlds.',
      'Beyond Neptune lies the Kuiper Belt, home to Pluto and icy comets.',
    ],
    curiousQuestion: 'Did you know a day on Venus is longer than its entire year? It takes 243 Earth days to rotate once!',
    sparkSteps: [
      {
        step: 1,
        title: 'The Great Mass',
        description: 'The Sun accounts for virtually all matter in our system. Its gravitational well curves space-time.',
        visualHint: 'sun-gravity',
      },
      {
        step: 2,
        title: 'Two Distinct Zones',
        description: 'Close to the sun was too hot for light gases to condense, leaving dense rock. Further out, giant gas spheres formed.',
        visualHint: 'inner-outer',
      },
      {
        step: 3,
        title: 'The Orbital Dance',
        description: 'Planets move along elliptical paths governed by Kepler\'s Laws and Newton\'s gravity.',
        visualHint: 'orbits',
      },
      {
        step: 4,
        title: 'The Cosmic Shield',
        description: 'Jupiter\'s enormous mass acts as a gravitational vacuum cleaner, sweeping away stray comets.',
        visualHint: 'jupiter-shield',
      },
      {
        step: 5,
        title: 'Takeaway Checkpoint',
        description: 'One star, eight planets, millions of asteroids—all balanced in cosmic harmony.',
        visualHint: 'complete',
      },
    ],
    teachChallenge: {
      problem: 'Why don\'t the planets simply get sucked directly into the Sun by its monstrous gravity?',
      steps: [
        {
          id: 'step1',
          question: 'If a cannonball is shot horizontally fast enough from a tall mountain, what happens?',
          options: ['It curves and falls into orbit around Earth', 'It stops instantly in mid-air', 'It flies in a straight line forever', 'It turns into a meteor'],
          correctIndex: 0,
          hint: 'Think about Newton\'s thought experiment: the ground curves away beneath it at the exact rate it falls.',
          encouragement: 'Yes! An orbit is essentially perpetual freefall that misses the ground because of forward velocity.',
        },
        {
          id: 'step2',
          question: 'What keeps planets from flying off into deep interstellar space?',
          options: ['The Sun\'s gravitational pull', 'A glass dome boundary', 'Magnetic repulsion from other stars', 'Solar wind blowing outward'],
          correctIndex: 0,
          hint: 'The Sun\'s massive gravity acts like a tether.',
          encouragement: 'Exactly! Gravity pulls inward constantly.',
        },
        {
          id: 'step3',
          question: 'So why is planetary orbit stable?',
          options: ['Forward orbital momentum perfectly balances the inward pull of gravity', 'Planets have rocket engines', 'The Sun pushes them away', 'Space is filled with friction'],
          correctIndex: 0,
          hint: 'Forward velocity + inward gravity = continuous orbit.',
          encouragement: 'Magnificent! You now understand orbital mechanics as intuitively as Isaac Newton did! 🎉',
        },
      ],
    },
    quizQuestions: [
      {
        question: 'Which planet has the strongest magnetic field and largest mass in our solar system?',
        options: ['Mars', 'Jupiter', 'Saturn', 'Earth'],
        answer: 1,
        explanation: 'Jupiter is more massive than all other planets combined, with a roaring metallic hydrogen core.',
      },
      {
        question: 'What separates the inner rocky planets from the outer gas giants?',
        options: ['The Kuiper Belt', 'The Main Asteroid Belt', 'The Oort Cloud', 'Saturn\'s Rings'],
        answer: 1,
        explanation: 'The Asteroid Belt lies between the orbits of Mars and Jupiter.',
      },
      {
        question: 'Why is Venus hotter than Mercury even though Mercury is closer to the Sun?',
        options: ['Venus has more volcanoes', 'Venus has an intense runaway greenhouse effect with thick CO₂ atmosphere', 'Mercury has no day time', 'Venus has nuclear reactions on its surface'],
        answer: 1,
        explanation: 'Venus\'s thick CO₂ atmosphere traps heat relentlessly, reaching surface temperatures of 465°C.',
      },
    ],
  },
  dna: {
    topic: 'DNA',
    emoji: '🧬',
    headline: 'The universal molecular blueprint of all living organisms.',
    flow: [
      { step: 1, label: 'The Double Helix', detail: 'Twisted ladder made of sugar-phosphate rails', icon: 'Dna' },
      { step: 2, label: 'The 4 Letters', detail: 'Adenine (A), Thymine (T), Cytosine (C), Guanine (G)', icon: 'Binary' },
      { step: 3, label: 'The Code to Proteins', detail: 'Genes get translated into living physical traits', icon: 'Heart' },
    ],
    analogy: 'DNA is like an infinite computer code written in base-4 instead of binary 0 and 1. The four letters (A, T, C, G) spell out instructions for building every cell, enzyme, and tissue in your body!',
    keyPoints: [
      'Base-pairing rule is strict: Adenine (A) pairs only with Thymine (T); Cytosine (C) pairs only with Guanine (G).',
      'Human DNA contains about 3 billion base pairs in almost every single cell.',
      'During cell division, DNA unzips down the middle so each strand builds an exact copy.',
    ],
    curiousQuestion: 'If you uncoiled all the DNA inside all the cells of your body, it would stretch from Earth to Pluto and back several times!',
    sparkSteps: [
      {
        step: 1,
        title: 'The Master Recipe',
        description: 'Every living creature—from a tiny yeast cell to a blue whale—reads from the same chemical alphabet.',
        visualHint: 'helix-overview',
      },
      {
        step: 2,
        title: 'The Complementary Secret',
        description: 'A always pairs with T (2 hydrogen bonds). C always pairs with G (3 hydrogen bonds).',
        visualHint: 'base-pairing',
      },
      {
        step: 3,
        title: 'Unzipping and Copying',
        description: 'Helicase enzymes split the ladder rungs; polymerase builds the matching half with near-zero error.',
        visualHint: 'replication',
      },
      {
        step: 4,
        title: 'Transcription into RNA',
        description: 'The nucleus creates an mRNA messenger photocopy that travels to the ribosome factory.',
        visualHint: 'ribosome',
      },
      {
        step: 5,
        title: 'Takeaway Checkpoint',
        description: 'Four simple bases, infinite biodiversity, self-replicating life.',
        visualHint: 'complete',
      },
    ],
    teachChallenge: {
      problem: 'A forensic scientist finds a single strand of DNA with the sequence: A - C - G - T - A - A. What is the complementary sequence on the other strand?',
      steps: [
        {
          id: 'step1',
          question: 'What is the golden rule of DNA base pairing?',
          options: ['A pairs with T; C pairs with G', 'A pairs with G; C pairs with T', 'Any letter pairs with any letter', 'A pairs with A; T pairs with T'],
          correctIndex: 0,
          hint: 'Remember: Apples in Trees (A-T), Cars in Garages (C-G).',
          encouragement: 'Yes! Adenine bonds specifically with Thymine, and Cytosine bonds with Guanine.',
        },
        {
          id: 'step2',
          question: 'For the first 3 letters [A - C - G], what are their matching partners?',
          options: ['T - G - C', 'A - C - G', 'U - G - C', 'T - T - T'],
          correctIndex: 0,
          hint: 'A becomes T, C becomes G, G becomes C.',
          encouragement: 'Spot on! T matches A, G matches C, and C matches G.',
        },
        {
          id: 'step3',
          question: 'Finishing the last 3 letters [T - A - A], what completes the strand?',
          options: ['A - T - T', 'T - A - A', 'G - C - C', 'A - A - T'],
          correctIndex: 0,
          hint: 'T matches A, and A matches T.',
          encouragement: 'Perfection! Full complementary strand is T - G - C - A - T - T. You just replicated genetic code! 🎉',
        },
      ],
    },
    quizQuestions: [
      {
        question: 'Which chemical bond holds the base pairs together across the center of the helix?',
        options: ['Covalent bonds', 'Hydrogen bonds', 'Ionic bonds', 'Metallic bonds'],
        answer: 1,
        explanation: 'Weak hydrogen bonds hold bases together, allowing the DNA to unzip easily during replication.',
      },
      {
        question: 'In DNA, which base always pairs with Adenine (A)?',
        options: ['Cytosine', 'Guanine', 'Thymine', 'Uracil'],
        answer: 2,
        explanation: 'Adenine binds specifically to Thymine with two hydrogen bonds (in RNA, Uracil replaces Thymine).',
      },
      {
        question: 'What sugar forms the backbone of the DNA molecule?',
        options: ['Ribose', 'Deoxyribose', 'Glucose', 'Sucrose'],
        answer: 1,
        explanation: 'DNA stands for Deoxyribonucleic Acid, named after its deoxyribose sugar backbone.',
      },
    ],
  },
};

function cleanJsonText(raw: string): string {
  let clean = (raw || '').trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean.trim();
}

// Status endpoint to verify AI connection and available models
app.get('/api/status', (req: Request, res: Response) => {
  const customKey = (req.headers['x-gemini-api-key'] as string) || (req.query.key as string);
  const hasKey = Boolean(
    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') || customKey
  );
  return res.json({
    status: 'ok',
    hasApiKey: hasKey,
    primaryModel: 'gemini-2.5-flash',
    candidateModels: CANDIDATE_MODELS,
  });
});

// 1. POST /api/study/explain
app.post('/api/study/explain', async (req: Request, res: Response) => {
  const { topic, isPreset } = req.body;
  const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
  const trimmed = (topic || '').trim();

  if (!trimmed) {
    return res.status(400).json({ error: 'Topic or question is required.' });
  }

  // Exact preset match ONLY when isPreset flag is set or topic is an exact preset key
  const lowerExact = trimmed.toLowerCase();
  if (isPreset && PRESET_TOPICS[lowerExact]) {
    return res.json({ success: true, data: PRESET_TOPICS[lowerExact], isPreset: true });
  }

  try {
    const prompt = `You are Google Study Buddy, an intuitive, warm, and student-friendly AI tutor designed for Duolingo/Apple-level simplicity.

A student asked or searched: "${trimmed}".

Your mission:
Provide a crystal-clear, highly tailored, student-friendly learning breakdown specifically answering and explaining what they asked.
DO NOT use generic placeholder text. Every single field must be specifically written for: "${trimmed}".

Return ONLY a valid JSON object matching this schema:
{
  "topic": "Clean capitalized topic name (e.g. 'Why the Sky is Blue' or 'Gravity')",
  "userQuestion": "${trimmed.replace(/"/g, '\\"')}",
  "directAnswer": "2 crisp, friendly, engaging sentences directly answering what they asked in simple language.",
  "emoji": "a single highly relevant emoji (e.g. 🌤️, 🪐, ⚡, 🧬, 🚀)",
  "headline": "A single crisp, beautiful sentence summarizing the core phenomenon.",
  "flow": [
    {"step": 1, "label": "Short label (2-3 words)", "detail": "Short visual step with emojis explaining the start/cause", "icon": "Sun"},
    {"step": 2, "label": "Short label (2-3 words)", "detail": "Short explanation of the transformation/mechanism", "icon": "Wind"},
    {"step": 3, "label": "Short label (2-3 words)", "detail": "The clear result or observation", "icon": "Sparkles"}
  ],
  "analogy": "A relatable 'Think of it like...' everyday analogy written in 1-2 friendly, intuitive sentences.",
  "keyPoints": [
    "Punchy memorable takeaway 1 (15 words max)",
    "Punchy memorable takeaway 2 (15 words max)",
    "Punchy memorable takeaway 3 (15 words max)"
  ],
  "curiousQuestion": "A fascinating 'Did you know...?' hook about this exact topic.",
  "sparkSteps": [
    {"step": 1, "title": "The Big Idea", "description": "Crisp 15-word line introducing the core idea.", "visualHint": "concept"},
    {"step": 2, "title": "The Mechanism", "description": "Crisp 15-word line showing how it works.", "visualHint": "process"},
    {"step": 3, "title": "What Happens", "description": "Crisp 15-word line showing the effect.", "visualHint": "action"},
    {"step": 4, "title": "Why It Matters", "description": "Crisp 15-word line explaining its real impact.", "visualHint": "impact"},
    {"step": 5, "title": "Takeaway Checkpoint", "description": "Crisp summary line.", "visualHint": "complete"}
  ],
  "teachChallenge": {
    "problem": "A concrete, relatable puzzle or scenario specifically about ${trimmed.replace(/"/g, '\\"')}",
    "steps": [
      {
        "id": "step1",
        "question": "A clear question guiding the student to think through the first logical step?",
        "options": ["Accurate Answer", "Plausible Misconception", "Incorrect Alternative"],
        "correctIndex": 0,
        "hint": "Gentle nudge toward the answer",
        "encouragement": "Warm, encouraging feedback!"
      },
      {
        "id": "step2",
        "question": "The second logical question building on step 1?",
        "options": ["Accurate Answer", "Plausible Misconception", "Incorrect Alternative"],
        "correctIndex": 0,
        "hint": "Gentle nudge toward the answer",
        "encouragement": "Outstanding connection! 🎉"
      }
    ]
  },
  "quizQuestions": [
    {
      "question": "Clear, fun comprehension question testing understanding of ${trimmed.replace(/"/g, '\\"')}?",
      "options": ["Correct Answer", "Distractor 1", "Distractor 2", "Distractor 3"],
      "answer": 0,
      "explanation": "Clear 1-sentence explanation why this answer is correct."
    },
    {
      "question": "Second interesting comprehension question about ${trimmed.replace(/"/g, '\\"')}?",
      "options": ["Correct Answer", "Distractor 1", "Distractor 2", "Distractor 3"],
      "answer": 0,
      "explanation": "Clear 1-sentence explanation why this answer is correct."
    }
  ]
}`;

    const raw = await generateWithGemini(prompt, customKey, true);
    const parsed = JSON.parse(cleanJsonText(raw));
    parsed.userQuestion = parsed.userQuestion || trimmed;
    parsed.isAiGenerated = true;
    return res.json({ success: true, data: parsed, isAiGenerated: true });
  } catch (error: any) {
    console.error('Error generating explain content:', error?.message || error);
    const isNoKey = String(error?.message).includes('NO_GEMINI_API_KEY');
    return res.status(isNoKey ? 401 : 500).json({
      success: false,
      error: isNoKey
        ? 'Gemini API key is not configured. Please add GEMINI_API_KEY in .env or configure in settings.'
        : `AI generation failed: ${error?.message || 'Unknown error'}.`,
      needsApiKey: isNoKey,
    });
  }
});

// 2. POST /api/study/verify
app.post('/api/study/verify', async (req: Request, res: Response) => {
  try {
    const { statement } = req.body;
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
    if (!statement || typeof statement !== 'string') {
      return res.status(400).json({ error: 'Statement is required.' });
    }

    const prompt = `You are Google Study Buddy's fact verification companion.
The user wants to check this statement: "${statement}".
Slogan: "Don't blindly trust AI. Check it. Understand it."
Analyze the statement for factual accuracy. Keep it student-friendly, calm, trustworthy, and non-judgmental.

Respond ONLY with a JSON object:
{
  "verified": boolean,
  "confidence": "High" | "Medium",
  "headline": "Crisp 4-6 word verdict",
  "summary": "1 sentence verdict in friendly language",
  "explanation": "2-3 short sentences explaining the underlying science/truth clearly and simply.",
  "correction": "If verified is false, provide the accurate statement here. If true, provide null.",
  "socraticPrompt": "1 thought-provoking question for the student to test or think about."
}`;

    const raw = await generateWithGemini(prompt, customKey, true);
    const parsed = JSON.parse(cleanJsonText(raw));
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error verifying statement:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Verification failed',
    });
  }
});

// 3. POST /api/study/teach-step
app.post('/api/study/teach-step', async (req: Request, res: Response) => {
  try {
    const { topic, userHistory, studentAnswer } = req.body;
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;

    const prompt = `You are Google Study Buddy in "Teach Me" Socratic mode.
Topic: "${topic}".
Student's latest response: "${studentAnswer}".
Conversation history: ${JSON.stringify(userHistory || [])}.

Your rules:
1. NEVER dump the final answer immediately.
2. Follow the sequence: Question → Think → Hint → Try → Understand.
3. Be encouraging and warm ("You're on the right track!", "Almost there — think about the formula.", "Exactly! 🎉").
4. Provide immediate feedback on their response, plus the next guided step or conclude if they mastered it.

Return ONLY a JSON object:
{
  "feedback": "Encouraging 1-2 sentence response to their answer",
  "isCorrect": boolean,
  "nextQuestion": "The next gentle Socratic question (or null if finished)",
  "options": ["Option 1", "Option 2", "Option 3"],
  "correctOptionIndex": 0,
  "hint": "Gentle nudge if they get stuck",
  "encouragement": "Warm motivational words",
  "isFinished": boolean
}`;

    const raw = await generateWithGemini(prompt, customKey, true);
    const parsed = JSON.parse(cleanJsonText(raw));
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in teach-step:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Teach step failed',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Google Study Buddy dev server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.VERCEL !== '1') {
  startServer();
}
