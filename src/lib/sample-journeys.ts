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
  stayArea: string;
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
    seeker: "Reflection",
    travelStyle: "Reflective cultural journey",
    stayArea: "central Kyoto",
    themes: ["Culture", "Gardens", "Quiet Time"],
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
    seeker: "Connection",
    travelStyle: "Connected coastal exploration",
    stayArea: "Oia or Imerovigli",
    themes: ["Shared Meals", "Coast", "Exploration"],
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
    city: "Mexico City",
    country: "Mexico",
    heroImage: "/images/place-3.jpg",
    seeker: "Inspiration",
    travelStyle: "Creative city discovery",
    stayArea: "Roma Norte or Condesa",
    themes: ["Art", "Food", "Creative Streets"],
    stay: { name: "Roma Norte Design Hotel", rating: 4.7 },
    days: [
      {
        day: 1,
        title: "Meet the city through murals, architecture, and neighborhood flavors.",
        activities: [
          { name: "Historic Center Art Walk", description: "Walk from grand civic spaces to landmark murals while a local guide connects art with the city's layered history.", location: "Centro Histórico", address: "Plaza de la Constitución, Centro, Mexico City", time: "09:00 AM – 11:30 AM", estimatedCost: 28 },
          { name: "Market-to-Table Lunch", description: "Taste seasonal dishes inspired by market produce, regional recipes, and contemporary Mexican cooking.", location: "Centro Histórico", address: "República de Uruguay, Centro, Mexico City", time: "12:30 PM – 02:00 PM", estimatedCost: 42, distanceFromPreviousKm: 1.2 },
          { name: "Roma Norte Creative Streets", description: "Browse independent studios, bookstores, galleries, and tree-lined streets at an unhurried pace.", location: "Roma Norte", address: "Avenida Álvaro Obregón, Roma Norte, Mexico City", time: "04:00 PM – 06:30 PM", estimatedCost: 0, distanceFromPreviousKm: 4.8 },
        ],
      },
      {
        day: 2,
        title: "Follow bold ideas from modern masters to living neighborhood culture.",
        activities: [
          { name: "Frida Kahlo Museum", description: "Explore the artist's home, personal objects, and vivid body of work with time to reflect in the garden.", location: "Museo Frida Kahlo", address: "Londres 247, Del Carmen, Coyoacán, Mexico City", time: "09:00 AM – 11:00 AM", estimatedCost: 32 },
          { name: "Coyoacán Market Tasting", description: "Try tostadas, fruit, and traditional sweets while learning how neighborhood food traditions continue to evolve.", location: "Mercado de Coyoacán", address: "Ignacio Allende, Coyoacán, Mexico City", time: "11:30 AM – 01:00 PM", estimatedCost: 24, distanceFromPreviousKm: 0.7 },
          { name: "UNAM Mosaic and Sculpture Route", description: "See monumental mosaics and open-air sculpture where modern design, public space, and volcanic landscape meet.", location: "Ciudad Universitaria", address: "Coyoacán, Mexico City", time: "03:00 PM – 06:00 PM", estimatedCost: 18, distanceFromPreviousKm: 5.6 },
        ],
      },
      {
        day: 3,
        title: "Find fresh inspiration in design, local kitchens, and evening street life.",
        activities: [
          { name: "Contemporary Art Morning", description: "Visit a focused contemporary collection and leave room to discuss the ideas that stay with you.", location: "Museo Jumex", address: "Miguel de Cervantes Saavedra 303, Granada, Mexico City", time: "10:00 AM – 12:00 PM", estimatedCost: 12 },
          { name: "Condesa Design and Coffee Walk", description: "Move between small design shops, shaded parks, and an independent café in one of the city's most walkable areas.", location: "Condesa", address: "Avenida Amsterdam, Hipódromo, Mexico City", time: "02:00 PM – 05:00 PM", estimatedCost: 30, distanceFromPreviousKm: 6.9 },
          { name: "Evening Street Food Tour", description: "Close the journey with tacos, antojitos, and stories from cooks shaping the city's late-night food culture.", location: "Roma and Juárez", address: "Colonia Roma Norte, Mexico City", time: "07:00 PM – 09:30 PM", estimatedCost: 58, distanceFromPreviousKm: 2.4 },
        ],
      },
    ],
    packingTips: "Bring comfortable walking shoes, light layers, a compact rain jacket, sun protection, and a secure day bag for markets, museums, and busy streets.",
    travelTips: "Reserve popular museums in advance, use arranged transport after dark, and group each day by neighborhood. Leave space for galleries, cafés, and discoveries between planned stops.",
    estimatedTotal: 244,
  },
  egypt: {
    slug: "egypt",
    city: "Luxor",
    country: "Egypt",
    heroImage: "/images/place-4.jpg",
    seeker: "Discovery",
    travelStyle: "Story-led cultural discovery",
    stayArea: "Luxor's East Bank",
    themes: ["History", "Local Stories", "New Perspectives"],
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
