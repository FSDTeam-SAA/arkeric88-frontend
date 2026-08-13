export type WellnessArchetypeId = "burned_out_achiever" | "transformer" | "seeker" | "optimizer" | "escapist" | "reconnector";

export type QuizQuestion = {
  key: string;
  title: string;
  prompt?: string;
  kind?: "options" | "cards" | "date" | "range" | "text" | "archetypes";
  options?: string[];
  multiple?: boolean;
};

export type WellnessArchetype = {
  id: WellnessArchetypeId;
  name: string;
  description: string;
  coreTraits: string[];
  needs: string[];
  avoid: string[];
  sampleRetreats: string[];
  questions: QuizQuestion[];
};

export const wellnessArchetypes: WellnessArchetype[] = [
  {
    id: "burned_out_achiever",
    name: "Burned-Out Achiever",
    description: "I am successful and driven, but mentally or physically exhausted.",
    coreTraits: ["High-performing", "Mentally exhausted", "Overstimulated"],
    needs: ["Nervous system regulation", "Quiet luxury", "Restorative sleep"],
    avoid: ["Aggressive programming", "Forced socialization"],
    sampleRetreats: ["Sensei Lanai", "COMO Shambhala", "Kamalaya"],
    questions: [
      {
        key: "burnout_recovery_priority",
        title: "What most needs to recover right now?",
        options: ["Restorative sleep", "My nervous system", "Mental clarity", "Physical energy"],
      },
      {
        key: "burnout_current_pressure",
        title: "How does pressure show up in your daily life?",
        options: ["I am always switched on", "I feel mentally overloaded", "My sleep is suffering", "I have very little time for myself"],
      },
      {
        key: "burnout_support_style",
        title: "What kind of support would feel restorative?",
        options: ["Private and self-paced", "Gentle expert guidance", "A clear but spacious program", "Mostly rest with optional activities"],
      },
      {
        key: "burnout_social_boundary",
        title: "How much social interaction feels right?",
        options: ["As little as possible", "A few meaningful interactions", "Small calm groups", "I am open to connecting when it feels natural"],
      },
    ],
  },
  {
    id: "transformer",
    name: "Transformer",
    description: "I am ready for growth, challenge, and a meaningful personal shift.",
    coreTraits: ["Growth-oriented", "Challenge-seeking", "Open to discomfort"],
    needs: ["Structure", "Accountability", "Physical engagement"],
    avoid: ["Unstructured retreats", "Passive retreats"],
    sampleRetreats: ["The Ranch Malibu", "Lanserhof", "SHA Wellness"],
    questions: [
      {
        key: "transformation_focus",
        title: "Where do you most want to create change?",
        options: ["Physical vitality", "Habits and discipline", "Confidence and resilience", "A major life transition"],
      },
      {
        key: "transformation_challenge",
        title: "How much challenge are you ready for?",
        options: ["Gentle momentum", "A meaningful stretch", "A demanding reset", "Push me beyond my comfort zone"],
      },
      {
        key: "transformation_structure",
        title: "What keeps you most engaged?",
        options: ["A clear daily schedule", "Expert coaching", "Measurable milestones", "Shared accountability"],
      },
      {
        key: "transformation_movement",
        title: "How should movement support your transformation?",
        options: ["Daily functional movement", "Strength and conditioning", "Hiking and outdoor challenge", "A varied physical program"],
      },
    ],
  },
  {
    id: "seeker",
    name: "Seeker",
    description: "I want reflection, meaning, and a deeper inner or spiritual connection.",
    coreTraits: ["Introspective", "Spiritually curious", "Meaning-seeking"],
    needs: ["Mindfulness", "Nature immersion", "Emotional grounding"],
    avoid: ["Clinical environments", "Data-heavy language"],
    sampleRetreats: ["Ananda", "Fivelements", "Blue Spirit Costa Rica"],
    questions: [
      {
        key: "seeker_intention",
        title: "What are you hoping to understand more deeply?",
        options: ["My purpose", "My emotions", "A life decision", "My spiritual path"],
      },
      {
        key: "seeker_practice",
        title: "Which practice feels most supportive?",
        options: ["Meditation and silence", "Yoga and breathwork", "Ritual and spiritual guidance", "Journaling and reflection"],
      },
      {
        key: "seeker_nature",
        title: "How would you like nature to be part of the journey?",
        options: ["Deep immersion every day", "A peaceful setting for reflection", "Guided nature experiences", "A balance of nature and comfort"],
      },
      {
        key: "seeker_guidance",
        title: "How much guidance would you welcome?",
        options: ["Mostly solitary exploration", "Occasional one-to-one guidance", "A guided daily practice", "A supportive like-minded group"],
      },
    ],
  },
  {
    id: "optimizer",
    name: "Optimizer",
    description: "I value evidence, measurable outcomes, and long-term performance.",
    coreTraits: ["Performance-oriented", "Data-driven", "Biohacking-curious"],
    needs: ["Diagnostics", "Measurable outcomes", "Longevity focus"],
    avoid: ["Vague wellness offerings", "Unstructured wellness offerings"],
    sampleRetreats: ["Clinique La Prairie", "Velaa", "RAKxa"],
    questions: [
      {
        key: "optimizer_outcome",
        title: "Which outcome matters most to you?",
        options: ["Longevity and prevention", "Energy and performance", "Sleep and recovery", "Metabolic health"],
      },
      {
        key: "optimizer_diagnostics",
        title: "How much diagnostic insight do you want?",
        options: ["A focused health assessment", "Comprehensive testing", "Continuous measurement", "Only tests that change the plan"],
      },
      {
        key: "optimizer_tracking",
        title: "How would you like progress to be measured?",
        options: ["Clear before-and-after metrics", "Daily data and feedback", "Expert interpretation", "A practical long-term plan"],
      },
      {
        key: "optimizer_program",
        title: "What program style suits you best?",
        options: ["Highly structured and clinical", "Evidence-led with luxury", "Intensive but time-efficient", "Personalized with room to recharge"],
      },
    ],
  },
  {
    id: "escapist",
    name: "Escapist",
    description: "I feel emotionally drained and want beauty, freedom, and simplicity.",
    coreTraits: ["Emotionally drained", "Craving beauty", "Craving simplicity"],
    needs: ["Sensory reset", "Freedom", "Stunning environments"],
    avoid: ["Heavy structure", "Intensity", "Group pressure"],
    sampleRetreats: ["Soneva Soul", "Amangiri", "Post Ranch Inn"],
    questions: [
      {
        key: "escape_from",
        title: "What do you most want a break from?",
        options: ["Noise and stimulation", "Responsibility and decisions", "Routine and repetition", "Emotional heaviness"],
      },
      {
        key: "escape_sensation",
        title: "What would make you exhale the moment you arrive?",
        options: ["A breathtaking view", "Silence and privacy", "Warmth, water, and sunshine", "Beautiful design and effortless service"],
      },
      {
        key: "escape_freedom",
        title: "How much structure do you want?",
        options: ["Almost none", "A few optional rituals", "One anchor activity each day", "A gentle plan I can change anytime"],
      },
      {
        key: "escape_reset",
        title: "What kind of reset sounds most appealing?",
        options: ["Digital disconnection", "Sensory indulgence", "Creative inspiration", "Doing absolutely nothing"],
      },
    ],
  },
  {
    id: "reconnector",
    name: "Reconnector",
    description: "I want emotional warmth and meaningful time with people I care about.",
    coreTraits: ["Relationship-oriented", "Seeking shared experiences"],
    needs: ["Intimacy", "Emotional warmth", "Softer structure"],
    avoid: ["Solo-only experiences", "Cold clinical settings"],
    sampleRetreats: ["BodyHoliday", "Miraval Arizona", "Zulal"],
    questions: [
      {
        key: "reconnection_focus",
        title: "Who or what do you most want to reconnect with?",
        options: ["My partner", "Family or close friends", "Myself before reconnecting with others", "A sense of community"],
      },
      {
        key: "reconnection_experience",
        title: "Which shared experience feels most meaningful?",
        options: ["Unhurried conversations", "Wellness rituals together", "Play and adventure", "Learning something new together"],
      },
      {
        key: "reconnection_tone",
        title: "What emotional tone should the journey have?",
        options: ["Warm and nurturing", "Joyful and celebratory", "Quiet and intimate", "Healing and restorative"],
      },
      {
        key: "reconnection_balance",
        title: "What balance of togetherness feels right?",
        options: ["Almost everything together", "Shared highlights with personal downtime", "A balanced mix", "Plenty of individual space"],
      },
    ],
  },
];

export const commonJourneyQuestions: QuizQuestion[] = [
  {
    key: "energy_level",
    title: "What's your energy like\nfor this trip?",
    options: ["Low", "Medium", "High"],
  },
  {
    key: "travel_style",
    title: "Who will share this\njourney with you?",
    kind: "cards",
    options: ["Solo|Just me and my thoughts", "Couple|An intimate shared experience", "Small Group|2–6 close companions", "Family|Travel with loved ones"],
  },
  {
    key: "trip_organization",
    title: "How would you like your\ntrip to be organized?",
    options: ["Loosely planned", "Well Planned", "Hour by hour"],
  },
  {
    key: "activity_restrictions",
    title: "Are there any activities\nyou'd like to avoid or can't\ndo?",
    kind: "cards",
    multiple: true,
    options: ["Intense hiking or climbing", "Extreme heat or cold", "High-impact physical activity", "Water activities", "Long drives or transport", "No limitations"],
  },
  {
    key: "preferred_environments",
    title: "What environment speaks to\nyour soul?",
    multiple: true,
    options: ["Mountains", "Nature", "Ocean", "Beach", "City", "Culture", "Countryside", "Farmland", "Desert", "Snow", "Warm Weather", "Cold Weather"],
  },
  { key: "birthdate", title: "Your Birthdate", kind: "date" },
  {
    key: "total_trip_budget",
    title: "Your Trip Budget",
    prompt: "Approximate total trip budget?",
    kind: "range",
  },
  {
    key: "trip_length_days",
    title: "Your Trip length",
    prompt: "How many days are you planning to travel?",
    options: ["1–3 days", "4–7 days", "1–2 weeks", "2+ weeks"],
  },
  {
    key: "hope_of_this_trip",
    title: "What do you hope this\ntrip gives you?",
    prompt: "Write freely... there are no wrong answers.",
    kind: "text",
  },
];

export const archetypeSelectionQuestion: QuizQuestion = {
  key: "selected_archetype",
  title: "Which wellness traveler feels\nmost like you right now?",
  prompt: "Choose the closest fit. Your next questions will be tailored to it.",
  kind: "archetypes",
};

export function isWellnessArchetypeId(value: unknown): value is WellnessArchetypeId {
  return wellnessArchetypes.some((archetype) => archetype.id === value);
}

export function getWellnessArchetype(value: unknown) {
  return wellnessArchetypes.find((archetype) => archetype.id === value);
}

export function getQuizQuestions(value: unknown): QuizQuestion[] {
  const archetype = getWellnessArchetype(value);
  return [archetypeSelectionQuestion, ...(archetype?.questions || []), ...commonJourneyQuestions];
}

export const archetypeQuestionKeys = new Set(wellnessArchetypes.flatMap((archetype) => archetype.questions.map((question) => question.key)));
