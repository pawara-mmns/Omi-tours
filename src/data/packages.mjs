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
    interests: ["wild-island", "southern-shores"],
  },
];
