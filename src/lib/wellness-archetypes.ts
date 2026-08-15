export type WellnessArchetypeId = "burned_out_achiever" | "transformer" | "seeker" | "optimizer" | "escapist" | "reconnector";

export type QuizOption = string | {
  value: string;
  label: string;
  description?: string;
};

export type QuizQuestion = {
  key: string;
  title: string;
  prompt?: string;
  kind?: "options" | "cards" | "date" | "range" | "text" | "timing" | "archetypes";
  options?: QuizOption[];
  multiple?: boolean;
  maxSelections?: number;
  required?: boolean;
  mapsTo?: string[];
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
    key: "break_from",
    title: "What do you most want a break from?",
    mapsTo: ["emotional_tone", "transform_focus"],
    options: [
      { value: "noise_stimulation", label: "Noise and stimulation" },
      { value: "responsibility_decisions", label: "Responsibility and decisions" },
      { value: "routine_repetition", label: "Routine and repetition" },
      { value: "emotional_heaviness", label: "Emotional heaviness" },
    ],
  },
  {
    key: "arrival_priority",
    title: "What would make you exhale the moment you arrive?",
    mapsTo: ["nature_score", "emotional_safety", "solo_privacy", "luxury_score"],
    options: [
      { value: "breathtaking_view", label: "A breathtaking view" },
      { value: "silence_privacy", label: "Silence and privacy" },
      { value: "warmth_water_sunshine", label: "Warmth, water, and sunshine" },
      { value: "beautiful_design_service", label: "Beautiful design and effortless service" },
    ],
  },
  {
    key: "retreat_structure",
    title: "How much structure do you want, day to day?",
    mapsTo: ["structure"],
    options: [
      { value: "almost_none", label: "Almost none — I'll do what I feel like" },
      { value: "optional_rituals", label: "A few optional rituals I can join or skip" },
      { value: "one_daily_anchor", label: "One anchor activity a day, rest is free time" },
      { value: "full_program", label: "A full program that's planned for me" },
    ],
  },
  {
    key: "reset_style",
    title: "What kind of reset sounds most appealing?",
    mapsTo: ["transform_focus", "emotional_tone"],
    options: [
      { value: "digital_disconnection", label: "Digital disconnection" },
      { value: "sensory_indulgence", label: "Sensory indulgence" },
      { value: "creative_inspiration", label: "Creative inspiration" },
      { value: "doing_nothing", label: "Doing absolutely nothing" },
    ],
  },
  {
    key: "physical_intensity",
    title: "How intense do you want the physical side of this trip to be?",
    mapsTo: ["physical_intensity"],
    options: [
      { value: "gentle", label: "Gentle — minimal exertion, lots of rest" },
      { value: "moderate", label: "Moderate — some movement, nothing demanding" },
      { value: "challenging", label: "Challenging — I want to push myself physically" },
    ],
  },
  {
    key: "travel_party",
    title: "Who will share this\njourney with you?",
    mapsTo: ["solo_score", "couple_score", "social_score"],
    kind: "cards",
    options: [
      { value: "solo", label: "Solo" },
      { value: "couple", label: "Couple" },
      { value: "small_group", label: "Small Group" },
      { value: "family", label: "Family" },
    ],
  },
  {
    key: "spirituality",
    title: "How open are you to spiritual or ceremonial elements?",
    mapsTo: ["spirituality"],
    options: [
      { value: "none", label: "Not for me — I want wellness, not spirituality" },
      { value: "light", label: "Open to light practices (yoga, meditation basics)" },
      { value: "moderate", label: "I'd like this to be a real part of the experience" },
      { value: "deep", label: "I want deep immersion (ashram, silent retreat, ceremony)" },
    ],
  },
  {
    key: "travel_timing",
    title: "When are you hoping to travel?",
    mapsTo: ["best_season"],
    kind: "timing",
    options: [
      { value: "flexible", label: "Flexible / year-round" },
      { value: "specific", label: "Specific season or month" },
    ],
  },
  {
    key: "planning_service",
    title: "How would you like your trip organized?",
    prompt: "This affects the planning support for your itinerary, not which retreat matches you.",
    mapsTo: ["planning_service"],
    options: [
      { value: "loose", label: "Loosely — I'll figure it out as I go" },
      { value: "well_planned", label: "Well planned — a clear day-by-day itinerary" },
      { value: "hour_by_hour", label: "Hour by hour — I don't want to think about logistics" },
    ],
  },
  {
    key: "activity_restrictions",
    title: "Are there any activities you'd like to avoid, or things you can't do?",
    prompt: "For example: no hiking, water activities, long drives, extreme heat, or high-impact exercise.",
    mapsTo: ["restriction_flags"],
    kind: "text",
    required: false,
  },
  {
    key: "preferred_setting",
    title: "What environment speaks to your soul?",
    mapsTo: ["setting"],
    multiple: true,
    options: [
      { value: "mountains", label: "Mountains" },
      { value: "ocean_beach", label: "Ocean / Beach" },
      { value: "jungle_rainforest", label: "Jungle / Rainforest" },
      { value: "desert", label: "Desert" },
      { value: "countryside_farmland", label: "Countryside / Farmland" },
      { value: "lake", label: "Lake" },
      { value: "city_urban", label: "City / Urban" },
      { value: "no_preference", label: "No strong preference" },
    ],
  },
  {
    key: "budget_per_night",
    title: "What's your trip budget per night?",
    mapsTo: ["avg_night", "budget_tier"],
    kind: "range",
  },
  {
    key: "trip_length",
    title: "How long is your trip?",
    mapsTo: ["trip_length_context"],
    options: [
      { value: "1_3_nights", label: "1–3 nights" },
      { value: "4_7_nights", label: "4–7 nights" },
      { value: "1_2_weeks", label: "1–2 weeks" },
      { value: "2_plus_weeks", label: "2+ weeks" },
    ],
  },
  {
    key: "transform_focus",
    title: "What do you hope this trip gives you?",
    prompt: "Select up to 3.",
    mapsTo: ["transform_focus"],
    multiple: true,
    maxSelections: 3,
    options: [
      { value: "Burnout Recovery", label: "Burnout recovery" },
      { value: "Longevity", label: "Longevity / healthy aging" },
      { value: "Detox", label: "Detox" },
      { value: "Weight Loss", label: "Weight loss" },
      { value: "Spiritual Growth", label: "Spiritual growth" },
      { value: "Emotional Healing", label: "Emotional healing" },
      { value: "Nervous System Reset", label: "Nervous system reset" },
      { value: "Fitness", label: "Fitness" },
      { value: "Creativity", label: "Creativity" },
      { value: "Relationship Repair", label: "Relationship repair" },
      { value: "Community", label: "Community / connection" },
      { value: "Sleep", label: "Better sleep" },
      { value: "Digital Detox", label: "Digital detox" },
      { value: "Cultural Immersion", label: "Cultural immersion" },
    ],
  },
];

export const archetypeSelectionQuestion: QuizQuestion = {
  key: "selected_archetype",
  title: "Which wellness traveler feels\nmost like you right now?",
  prompt: "Choose the closest fit for how you feel right now.",
  mapsTo: ["archetypes"],
  kind: "archetypes",
};

export const travelPeriodOptions: QuizOption[] = [
  { value: "1", label: "January" }, { value: "2", label: "February" },
  { value: "3", label: "March" }, { value: "4", label: "April" },
  { value: "5", label: "May" }, { value: "6", label: "June" },
  { value: "7", label: "July" }, { value: "8", label: "August" },
  { value: "9", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" },
];

export function isWellnessArchetypeId(value: unknown): value is WellnessArchetypeId {
  return wellnessArchetypes.some((archetype) => archetype.id === value);
}

export function getWellnessArchetype(value: unknown) {
  return wellnessArchetypes.find((archetype) => archetype.id === value);
}

export function getQuizQuestions(value: unknown): QuizQuestion[] {
  void value;
  return [archetypeSelectionQuestion, ...commonJourneyQuestions];
}

export const archetypeQuestionKeys = new Set(wellnessArchetypes.flatMap((archetype) => archetype.questions.map((question) => question.key)));
