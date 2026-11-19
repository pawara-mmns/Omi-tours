import journey from "./journey.json" with { type: "json" };

export const islandJourneyId = "across-the-island";

export const packages = [
  {
    id: islandJourneyId,
    title: journey.title,
    kind: "Sample itinerary",
    days: journey.days.length,
    route: "Negombo to the south coast via Kandy, Ella and Yala",
    description: "Climb Pidurangala, take the hill-country train and finish by the sea. Choose your final beach stop or add a night along the way.",
    sketch: "sigiriya",
    photos: ["pidurangala", "habarana"],
    inclusions: [
      ["Private transfers", "Airport pickup for Negombo and a driver for the road sections between overnight stops."],
      ["Village & rock", "A Habarana village visit and an evening climb at Pidurangala."],
      ["Hill-country railway", "The train from Nanu Oya to Ella, followed by time to walk to Nine Arch Bridge."],
      ["Wildlife & coast", "Jeep outings in Habarana and Yala, then a drop-off at your choice of southern beach."],
    ],
    quoteNotes: [
      ["Transport & tickets", "Ask OMI to itemize the private vehicle, driver, fuel, expressway tolls, rail seats and park fees."],
      ["Stays & extensions", "Confirm hotel rooms and meals for the nine nights. Beach nights and an onward airport transfer are separate arrangements in the sample."],
    ],
    interests: [],
  },
  {
    id: "temples-and-tea",
    title: "Temples & tea country",
    kind: "Suggested route",
    days: 5,
    route: "Kandy, Nuwara Eliya and Ella",
    description: "Pair Kandy’s temple quarter with tea gardens and a walk to Nine Arch Bridge. Leave an extra morning in the hills if you like.",
    sketch: "nuwara-eliya",
    photos: ["ella", "kandy"],
    inclusions: [
      ["Hill-country transfers", "Request a private air-conditioned car and driver between Kandy, Nuwara Eliya and Ella."],
      ["Kandy on foot", "Explore the streets beside the Temple of the Sacred Tooth Relic. An interior visit can be added."],
      ["Tea country", "Allow time for a tea-garden stop around Nuwara Eliya on the way to Ella."],
      ["Nine Arch Bridge", "Walk to the viaduct in Ella, with the length of the walk tailored to your pace."],
    ],
    quoteNotes: [
      ["On the road", "Confirm the vehicle size, fuel, driver’s expenses and bottled water for your group."],
      ["Visits & stays", "Confirm temple admission, any tea-factory visit, hotel rooms and meals. Ask about train seats if you would like to travel by rail."],
    ],
    interests: ["living-heritage", "hill-country"],
  },
  {
    id: "safari-and-shore",
    title: "Safari to the sea",
    kind: "Suggested route",
    days: 4,
    route: "Yala, Tangalle and Mirissa",
    description: "Start with a jeep safari in Yala, then follow the southern shore. Choose how to divide your time between the park and the beach.",
    sketch: "yala",
    photos: ["yala", "south-coast"],
    inclusions: [
      ["Park-to-coast transfers", "Request a private driver from Yala to Tangalle and onward to Mirissa."],
      ["Yala by jeep", "Plan a park outing and choose how much of the route to devote to wildlife watching."],
      ["Tangalle", "Break the journey along the southern shore with time at the beach."],
      ["Mirissa", "Finish on the coast and choose where to spend your final night."],
    ],
    quoteNotes: [
      ["Safari costs", "Ask for the jeep and park entrance fees to be shown separately from the road transfers."],
      ["Coastal stays", "Confirm beach hotels, meals and your final drop-off. Any extra nights or onward transfer can be quoted separately."],
    ],
    interests: ["wild-island", "southern-shores"],
  },
];
