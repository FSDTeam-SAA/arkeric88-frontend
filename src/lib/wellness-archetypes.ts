export type QuizOption = {
  value: string;
  label: string;
  description?: string;
};

export type QuizQuestion = {
  key: string;
  title: string;
  prompt: string;
  whyWeAsk: string;
  kind?: "options" | "cards" | "party" | "restrictions" | "departure" | "timing" | "range";
  options?: QuizOption[];
  multiple?: boolean;
  maxSelections?: number;
  required?: boolean;
  otherOption?: string;
};

export const restrictionOptions: QuizOption[] = [
  { value: "mobility_accessibility", label: "Mobility or accessibility" },
  { value: "food_dietary", label: "Food allergy or dietary need" },
  { value: "no_long_drives", label: "No long drives" },
  { value: "no_intense_activity", label: "No intense activity" },
  { value: "no_water_activities", label: "No water activities" },
  { value: "avoid_extreme_heat", label: "Avoid extreme heat" },
  { value: "avoid_cold_weather", label: "Avoid cold weather" },
  { value: "other", label: "Other" },
];

export const travelPeriodOptions: QuizOption[] = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" },
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
];

export const journeyQuestions: QuizQuestion[] = [
  {
    key: "recent_feelings",
    title: "How have you been feeling lately?",
    prompt: "Select up to two.",
    whyWeAsk: "Your starting point helps us understand what you want travel to change or add.",
    multiple: true,
    maxSelections: 2,
    otherOption: "something_else",
    options: [
      { value: "stretched_thin", label: "Stretched thin" },
      { value: "stuck_in_routine", label: "Stuck in a routine" },
      { value: "disconnected", label: "Disconnected" },
      { value: "curious", label: "Curious" },
      { value: "energized", label: "Energized" },
      { value: "turning_point", label: "At a turning point" },
      { value: "content_ready", label: "Content and ready to enjoy life" },
      { value: "something_else", label: "Something else" },
    ],
  },
  {
    key: "trip_goals",
    title: "What are you hoping this trip gives you?",
    prompt: "Select up to two. You can change your mind later.",
    whyWeAsk: "The feeling you want guides our recommendations. There is more than one way to get there.",
    kind: "cards",
    multiple: true,
    maxSelections: 2,
    options: [
      { value: "restoration", label: "Restoration", description: "Space to slow down and feel less pulled in every direction" },
      { value: "connection", label: "Connection", description: "Meaningful time with people who matter to you" },
      { value: "discovery", label: "Discovery", description: "New places, flavors, stories and perspectives" },
      { value: "adventure", label: "Adventure", description: "Movement, challenge and doing something new" },
      { value: "inspiration", label: "Inspiration", description: "Fresh ideas through art, learning or creativity" },
      { value: "celebration", label: "Celebration", description: "Joy, pleasure and a moment worth remembering" },
      { value: "reflection", label: "Reflection", description: "Quiet and perspective to think about what matters" },
      { value: "growth", label: "Growth", description: "An experience that helps you stretch or make a change" },
    ],
  },
  {
    key: "trip_prompt",
    title: "What prompted this trip?",
    prompt: "Choose one.",
    whyWeAsk: "The reason for going helps us shape the trip around the moment you’re in.",
    otherOption: "something_else",
    options: [
      { value: "need_a_break", label: "I need a break" },
      { value: "time_with_someone", label: "Time with someone" },
      { value: "celebrating", label: "I’m celebrating" },
      { value: "curious_to_explore", label: "I’m curious to explore" },
      { value: "ready_for_change", label: "I’m ready for change" },
      { value: "change_of_scenery", label: "A change of scenery" },
      { value: "no_particular_reason", label: "No particular reason" },
      { value: "something_else", label: "Something else" },
    ],
  },
  {
    key: "preferred_moments",
    title: "Which moments sound most like your kind of trip?",
    prompt: "Select up to three.",
    whyWeAsk: "People can want the same feeling from very different experiences.",
    multiple: true,
    maxSelections: 3,
    options: [
      { value: "food_drinks", label: "Memorable food and drinks" },
      { value: "art_history_culture", label: "Art, history and culture" },
      { value: "nature_wildlife", label: "Nature and wildlife" },
      { value: "beaches_water", label: "Beaches and water" },
      { value: "movement_adventure", label: "Movement and adventure" },
      { value: "quiet_privacy", label: "Quiet and privacy" },
      { value: "meeting_people", label: "Meeting people" },
      { value: "spa_wellness", label: "Spa and wellness" },
      { value: "music_nightlife", label: "Music and nightlife" },
      { value: "learning_making", label: "Learning or making something" },
    ],
  },
  {
    key: "preferred_environments",
    title: "What setting draws you in?",
    prompt: "Select up to two.",
    whyWeAsk: "This helps us find places you’ll enjoy spending time in.",
    multiple: true,
    maxSelections: 2,
    options: [
      { value: "coast", label: "Coast" },
      { value: "mountains", label: "Mountains" },
      { value: "forest_jungle", label: "Forest or jungle" },
      { value: "desert", label: "Desert" },
      { value: "countryside", label: "Countryside" },
      { value: "small_town", label: "Small town" },
      { value: "vibrant_city", label: "Vibrant city" },
      { value: "surprise_me", label: "Surprise me" },
    ],
  },
  {
    key: "trip_pace",
    title: "What pace would feel good?",
    prompt: "Choose one.",
    whyWeAsk: "We use this to leave the right amount of space in your itinerary.",
    options: [
      { value: "mostly_open", label: "Mostly open time" },
      { value: "one_highlight", label: "One highlight each day, with plenty of free time" },
      { value: "balanced", label: "A balance of activities and downtime" },
      { value: "full_days", label: "Full days with plenty to do" },
    ],
  },
  {
    key: "travel_party",
    title: "Who is traveling?",
    prompt: "Choose one.",
    whyWeAsk: "Your travel party affects rooms, activities and the pace of the trip.",
    kind: "party",
    options: [
      { value: "solo", label: "Just me" },
      { value: "couple", label: "My partner and me" },
      { value: "group", label: "Friends or a group" },
      { value: "family", label: "Family" },
    ],
  },
  {
    key: "activity_restrictions",
    title: "Is there anything we should plan around or avoid?",
    prompt: "Optional. Select a tag or tell us in your own words.",
    whyWeAsk: "We’ll rule out options that conflict with your firm needs before matching.",
    kind: "restrictions",
    required: false,
    multiple: true,
    options: restrictionOptions,
  },
  {
    key: "departure",
    title: "Where would you leave from?",
    prompt: "And how far are you open to traveling?",
    whyWeAsk: "Travel time can make or break a trip, especially a short one.",
    kind: "departure",
    options: [
      { value: "nearby", label: "Nearby" },
      { value: "manageable_flight", label: "A manageable flight" },
      { value: "anywhere", label: "Open to anywhere" },
    ],
  },
  {
    key: "travel_timing",
    title: "When can you go, and for how long?",
    prompt: "Choose the timing you know today.",
    whyWeAsk: "Timing helps us check routes, available stays and experiences.",
    kind: "timing",
    options: [
      { value: "exact_dates", label: "I have exact dates" },
      { value: "flexible", label: "My dates are flexible" },
      { value: "month_season", label: "I know the month or season" },
    ],
  },
  {
    key: "budget_per_night",
    title: "What is your maximum lodging budget per night?",
    prompt: "USD per room, per night, for the guests you listed.",
    whyWeAsk: "We check live lodging options for your dates before treating a destination as affordable.",
    kind: "range",
  },
];

export function getQuizQuestions(): QuizQuestion[] {
  return journeyQuestions;
}
