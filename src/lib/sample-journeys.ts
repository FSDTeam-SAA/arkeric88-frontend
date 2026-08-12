export type SampleActivity = {
  name: string;
  description: string;
  location: string;
  address: string;
  time: string;
  estimatedCost: number;
  distanceFromPreviousKm?: number;
};

export type SampleJourney = {
  slug: string;
  city: string;
  country: string;
  heroImage: string;
  seeker: string;
  travelStyle: string;
  themes: string[];
  stay: { name: string; rating: number };
  days: { day: number; title: string; activities: SampleActivity[] }[];
  packingTips: string;
  travelTips: string;
  estimatedTotal: number;
};

export const sampleJourneys: Record<string, SampleJourney> = {
  japan: {
    slug: "japan",
    city: "Kyoto",
    country: "Japan",
    heroImage: "/images/place-1.jpg",
    seeker: "Calm Seeker",
    travelStyle: "Mindful slow travel",
    themes: ["Quiet Temples", "Mindful Rituals", "Slow Luxury"],
    stay: { name: "Kyoto Riverside Ryokan", rating: 4.8 },
    days: [
      {
        day: 1,
        title: "Arrive gently and settle into Kyoto's rhythm.",
        activities: [
          { name: "Morning Walk at Fushimi Inari", description: "Begin before the crowds with a quiet walk beneath the vermilion torii gates and pause at the forest shrines.", location: "Fushimi Inari Taisha", address: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto", time: "07:30 AM – 10:00 AM", estimatedCost: 0 },
          { name: "Seasonal Lunch in Gion", description: "Enjoy a measured, seasonal lunch built around Kyoto vegetables and delicate local flavors.", location: "Gion District", address: "Gionmachi, Higashiyama Ward, Kyoto", time: "12:00 PM – 01:30 PM", estimatedCost: 42, distanceFromPreviousKm: 5.2 },
          { name: "Private Tea Ceremony", description: "Slow down through the gestures, aromas, and silence of a traditional matcha ceremony.", location: "Historic Gion Machiya", address: "Hanamikoji Street, Higashiyama Ward, Kyoto", time: "03:00 PM – 04:30 PM", estimatedCost: 55, distanceFromPreviousKm: 0.8 },
        ],
      },
      {
        day: 2,
        title: "A restorative day of gardens, bamboo, and riverside calm.",
        activities: [
          { name: "Arashiyama Bamboo Grove", description: "Walk through the bamboo early, when the pathways are quieter and the morning light is soft.", location: "Arashiyama Bamboo Grove", address: "Sagaogurayama, Ukyo Ward, Kyoto", time: "07:30 AM – 09:00 AM", estimatedCost: 0 },
          { name: "Tenryu-ji Garden Visit", description: "Take an unhurried visit through the temple's landscape garden, framed by the Arashiyama mountains.", location: "Tenryu-ji", address: "68 Sagatenryuji Susukinobabacho, Ukyo Ward, Kyoto", time: "09:30 AM – 11:00 AM", estimatedCost: 8, distanceFromPreviousKm: 0.5 },
          { name: "Hozu River Reflection Walk", description: "Spend the late afternoon beside the river with space for tea, journaling, and quiet observation.", location: "Katsura River Promenade", address: "Arashiyama, Ukyo Ward, Kyoto", time: "04:00 PM – 06:00 PM", estimatedCost: 12, distanceFromPreviousKm: 0.9 },
        ],
      },
      {
        day: 3,
        title: "Close with contemplative paths and Kyoto's everyday culture.",
        activities: [
          { name: "Philosopher's Path", description: "Follow the canal-side path at an easy pace, stopping at small temples and neighborhood cafés.", location: "Philosopher's Path", address: "Sakyo Ward, Kyoto", time: "08:00 AM – 10:30 AM", estimatedCost: 0 },
          { name: "Nishiki Market Tasting", description: "Sample a few regional specialties with time to meet local makers and browse without rushing.", location: "Nishiki Market", address: "Nakagyo Ward, Kyoto", time: "12:00 PM – 02:00 PM", estimatedCost: 35, distanceFromPreviousKm: 4.1 },
          { name: "Evening at Kamo River", description: "End the sample journey with a gentle riverside stroll as the city settles into evening.", location: "Kamo River", address: "Shijo Ohashi, Kyoto", time: "05:30 PM – 07:00 PM", estimatedCost: 0, distanceFromPreviousKm: 1.1 },
        ],
      },
    ],
    packingTips: "Bring easy-to-remove shoes for temple visits, breathable layers, a compact umbrella, and a light day bag. Keep one modest outfit for traditional spaces.",
    travelTips: "Start popular sights early, leave room between neighborhoods, and use trains for longer transfers. Quiet voices and unhurried movement suit Kyoto's reflective spaces.",
    estimatedTotal: 152,
  },
  greece: {
    slug: "greece",
    city: "Santorini",
    country: "Greece",
    heroImage: "/images/place-2.jpg",
    seeker: "Connection Seeker",
    travelStyle: "Romantic coastal escape",
    themes: ["Coastal Calm", "Ancient Culture", "Sunset Rituals"],
    stay: { name: "Caldera View Cave Suites", rating: 4.7 },
    days: [
      {
        day: 1,
        title: "Ease into island life through whitewashed lanes and sea views.",
        activities: [
          { name: "Slow Morning in Oia", description: "Explore the quieter lanes, small galleries, and blue-domed viewpoints before the midday bustle.", location: "Oia Village", address: "Oia 847 02, Santorini", time: "08:00 AM – 10:30 AM", estimatedCost: 0 },
          { name: "Clifftop Mediterranean Lunch", description: "Share a seasonal lunch featuring island tomatoes, fava, herbs, and views across the caldera.", location: "Oia Caldera", address: "Oia 847 02, Santorini", time: "12:30 PM – 02:00 PM", estimatedCost: 65, distanceFromPreviousKm: 0.7 },
          { name: "Sunset from Imerovigli", description: "Watch the light soften over the Aegean from a peaceful clifftop path away from the busiest terraces.", location: "Imerovigli", address: "Imerovigli 847 00, Santorini", time: "06:00 PM – 08:00 PM", estimatedCost: 15, distanceFromPreviousKm: 9.8 },
        ],
      },
      {
        day: 2,
        title: "Connect with Santorini's history, landscape, and local flavors.",
        activities: [
          { name: "Ancient Akrotiri", description: "Discover the preserved Bronze Age settlement with a guide who brings its homes and everyday life into focus.", location: "Archaeological Site of Akrotiri", address: "Akrotiri 847 00, Santorini", time: "09:00 AM – 11:00 AM", estimatedCost: 28 },
          { name: "Family Winery Tasting", description: "Taste volcanic-soil wines alongside local bites during a relaxed, small-group visit.", location: "Megalochori Wine Country", address: "Megalochori 847 00, Santorini", time: "02:30 PM – 04:30 PM", estimatedCost: 58, distanceFromPreviousKm: 7.4 },
          { name: "Megalochori Evening Walk", description: "Wander through bell towers, hidden courtyards, and village lanes as the afternoon cools.", location: "Megalochori Village", address: "Megalochori 847 00, Santorini", time: "05:00 PM – 06:30 PM", estimatedCost: 0, distanceFromPreviousKm: 0.6 },
        ],
      },
      {
        day: 3,
        title: "Finish on the water with space to breathe and reconnect.",
        activities: [
          { name: "Caldera Sailing Experience", description: "Sail past volcanic cliffs with swimming stops, an onboard lunch, and long stretches of open-water calm.", location: "Vlychada Marina", address: "Vlychada 847 00, Santorini", time: "10:00 AM – 03:00 PM", estimatedCost: 145 },
          { name: "Thermal Springs Swim", description: "Pause near the volcanic islets for a gentle swim in naturally warmer waters.", location: "Palea Kameni", address: "Santorini Caldera", time: "12:00 PM – 12:45 PM", estimatedCost: 0, distanceFromPreviousKm: 7.5 },
          { name: "Farewell Dinner in Fira", description: "Close with a relaxed dinner overlooking the caldera and a menu of modern Cycladic dishes.", location: "Fira", address: "Fira 847 00, Santorini", time: "07:30 PM – 09:30 PM", estimatedCost: 85, distanceFromPreviousKm: 12.3 },
        ],
      },
    ],
    packingTips: "Pack sun protection, a light wind layer, secure walking sandals, swimwear, and something polished but relaxed for dinner. Cobblestones favor stable footwear.",
    travelTips: "Build in extra transfer time on narrow island roads and reserve sunset dining ahead. Early mornings offer the calmest village experience.",
    estimatedTotal: 396,
  },
  mexico: {
    slug: "mexico",
    city: "Tulum",
    country: "Mexico",
    heroImage: "/images/place-3.jpg",
    seeker: "Restoration Seeker",
    travelStyle: "Nature-led wellness",
    themes: ["Wellness Reset", "Sacred Nature", "Barefoot Luxury"],
    stay: { name: "Tulum Jungle Retreat", rating: 4.6 },
    days: [
      {
        day: 1,
        title: "Land softly with coastal history and restorative rituals.",
        activities: [
          { name: "Tulum Ruins at Opening", description: "Explore the cliffside Maya site in the cooler morning air before taking in the Caribbean views.", location: "Tulum Archaeological Zone", address: "Carretera Federal, Tulum, Quintana Roo", time: "08:00 AM – 10:00 AM", estimatedCost: 15 },
          { name: "Beachside Seasonal Lunch", description: "Refuel with local produce, fresh seafood, and cooling aguas frescas beside the sea.", location: "Tulum Beach", address: "Zona Costera, Tulum, Quintana Roo", time: "12:00 PM – 01:30 PM", estimatedCost: 38, distanceFromPreviousKm: 4.2 },
          { name: "Sunset Breathwork Session", description: "Release travel tension with guided breathing and gentle movement as the temperature drops.", location: "South Tulum Beach", address: "Zona Hotelera, Tulum, Quintana Roo", time: "05:30 PM – 06:45 PM", estimatedCost: 45, distanceFromPreviousKm: 5.8 },
        ],
      },
      {
        day: 2,
        title: "Cool water, jungle stillness, and a slower nervous system.",
        activities: [
          { name: "Early Cenote Swim", description: "Float in clear freshwater surrounded by limestone and jungle while the cenote is still quiet.", location: "Cenote near Tulum", address: "Tulum Municipality, Quintana Roo", time: "08:30 AM – 10:30 AM", estimatedCost: 32 },
          { name: "Jungle Table Lunch", description: "Enjoy a produce-forward lunch inspired by Yucatán flavors in a shaded garden setting.", location: "Tulum Pueblo", address: "Centro, Tulum, Quintana Roo", time: "12:30 PM – 02:00 PM", estimatedCost: 34, distanceFromPreviousKm: 11.5 },
          { name: "Sound Healing at Dusk", description: "Settle into a guided sound bath designed to create space for rest and emotional integration.", location: "Aldea Zama", address: "Aldea Zama, Tulum, Quintana Roo", time: "06:00 PM – 07:30 PM", estimatedCost: 60, distanceFromPreviousKm: 3.1 },
        ],
      },
      {
        day: 3,
        title: "Reconnect with wild landscapes before an easy final evening.",
        activities: [
          { name: "Sian Ka'an Nature Excursion", description: "Take a small-boat journey through lagoons and mangroves with time for wildlife observation and a quiet swim.", location: "Sian Ka'an Biosphere Reserve", address: "Felipe Carrillo Puerto, Quintana Roo", time: "08:00 AM – 01:00 PM", estimatedCost: 125 },
          { name: "Restorative Spa Ritual", description: "Return for a cooling botanical treatment and an hour deliberately left without plans.", location: "Tulum Beach Road", address: "Zona Hotelera, Tulum, Quintana Roo", time: "03:30 PM – 05:00 PM", estimatedCost: 110, distanceFromPreviousKm: 34.0 },
          { name: "Garden Farewell Dinner", description: "Finish with a candlelit dinner centered on regional ingredients and wood-fired cooking.", location: "La Veleta", address: "La Veleta, Tulum, Quintana Roo", time: "07:30 PM – 09:00 PM", estimatedCost: 68, distanceFromPreviousKm: 7.2 },
        ],
      },
    ],
    packingTips: "Choose breathable clothing, reef-conscious sun protection, insect repellent, water shoes, and a refillable bottle. Bring a light layer for air-conditioned transfers.",
    travelTips: "Plan outdoor activities early, use reputable pre-arranged transport, and protect open time for rest. Humidity and traffic make a slower schedule feel better.",
    estimatedTotal: 527,
  },
  egypt: {
    slug: "egypt",
    city: "Luxor",
    country: "Egypt",
    heroImage: "/images/place-4.jpg",
    seeker: "Curiosity Seeker",
    travelStyle: "Immersive cultural discovery",
    themes: ["Ancient Wonder", "Living History", "Nile Stillness"],
    stay: { name: "Nile Garden Heritage Hotel", rating: 4.7 },
    days: [
      {
        day: 1,
        title: "Enter Luxor through monumental stories and golden-hour light.",
        activities: [
          { name: "Karnak Temple with Egyptologist", description: "Walk through the Great Hypostyle Hall with context that connects its carvings, rituals, and centuries of building.", location: "Karnak Temple Complex", address: "Karnak, Luxor", time: "08:00 AM – 11:00 AM", estimatedCost: 48 },
          { name: "Nile Garden Lunch", description: "Pause for a shaded lunch of Egyptian mezze, grilled vegetables, and fresh bread beside the river.", location: "East Bank", address: "Corniche El Nile, Luxor", time: "12:30 PM – 02:00 PM", estimatedCost: 28, distanceFromPreviousKm: 3.4 },
          { name: "Luxor Temple at Dusk", description: "Visit as the sandstone shifts color and the illuminated colonnades create a calmer evening atmosphere.", location: "Luxor Temple", address: "Luxor City, Luxor", time: "05:00 PM – 07:00 PM", estimatedCost: 22, distanceFromPreviousKm: 2.1 },
        ],
      },
      {
        day: 2,
        title: "Cross to the West Bank for a deeper encounter with ancient Thebes.",
        activities: [
          { name: "Valley of the Kings", description: "Explore a considered selection of decorated royal tombs before the heat and larger groups arrive.", location: "Valley of the Kings", address: "West Bank, Luxor", time: "07:00 AM – 10:30 AM", estimatedCost: 52 },
          { name: "Temple of Hatshepsut", description: "Take in the temple's dramatic terraces and the story of one of ancient Egypt's most influential rulers.", location: "Deir el-Bahari", address: "West Bank, Luxor", time: "11:00 AM – 12:30 PM", estimatedCost: 18, distanceFromPreviousKm: 2.8 },
          { name: "West Bank Village Lunch", description: "Share a home-style meal in a garden setting and leave the hottest part of the day unhurried.", location: "Al Qurna", address: "West Bank, Luxor", time: "01:00 PM – 03:00 PM", estimatedCost: 26, distanceFromPreviousKm: 4.6 },
        ],
      },
      {
        day: 3,
        title: "Balance discovery with stillness on and beside the Nile.",
        activities: [
          { name: "Luxor Museum", description: "Spend a focused morning with beautifully presented objects that add context without overwhelming the senses.", location: "Luxor Museum", address: "Corniche El Nile, Luxor", time: "09:00 AM – 11:00 AM", estimatedCost: 20 },
          { name: "Free Afternoon by the Pool", description: "Keep the afternoon open for rest, reading, and processing the scale of the journey so far.", location: "Nile Garden Heritage Hotel", address: "East Bank, Luxor", time: "01:00 PM – 04:30 PM", estimatedCost: 0, distanceFromPreviousKm: 2.0 },
          { name: "Sunset Felucca Sail", description: "Close the sample journey under sail, watching palms and farmland pass in the warm evening light.", location: "Nile River", address: "Luxor Corniche", time: "05:00 PM – 07:00 PM", estimatedCost: 40, distanceFromPreviousKm: 1.3 },
        ],
      },
    ],
    packingTips: "Pack sun protection, breathable modest layers, comfortable closed shoes, a scarf, and a reusable water bottle. Desert evenings can feel cooler than expected.",
    travelTips: "Begin archaeological visits early, carry small cash for incidental expenses, and use a licensed local guide and arranged transport for a smoother pace.",
    estimatedTotal: 254,
  },
};

export function getSampleJourney(slug: string) {
  return sampleJourneys[slug];
}
