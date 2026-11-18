export const experiences = [
  {
    slug: "hill-country",
    title: "Hill country by rail",
    region: "Nanu Oya & Ella",
    theme: "Rail & highlands",
    image: "hill-rail",
    alt: "Blue passenger train curves through green hill country",
    story:
      "The journey changes rhythm at Nanu Oya. A window seat trades the road for steep green slopes, then Ella offers two mornings to explore on foot.",
    suggestion:
      "Leave room for dinner in Ella town and a walk to Nine Arch Bridge.",
    day: 6,
  },
  {
    slug: "wild-island",
    title: "Into the wild",
    region: "Habarana & Yala",
    theme: "Wildlife & nature",
    image: "habarana",
    alt: "A safari jeep pauses near elephants in open grassland",
    story:
      "An evening jeep ride at Habarana begins the wildlife chapter. Further south, Yala brings a second safari landscape, with time in Udawalawe for the Elephant Transit Home.",
    suggestion:
      "Ask to adjust the number of safari outings or add a quieter afternoon.",
    day: 2,
  },
  {
    slug: "southern-shores",
    title: "The southern shores",
    region: "Sri Lanka’s south coast",
    theme: "Coast & leisure",
    image: "south-coast",
    alt: "Turquoise water meets a sheltered Sri Lankan beach",
    story:
      "The last road south opens onto the Indian Ocean. Choose Tangalle for a quiet finish, Weligama for surfing, or another of the five drop-offs in the sample.",
    suggestion:
      "Beach accommodation beyond the drop-off can be discussed separately.",
    day: 10,
  },
  {
    slug: "living-heritage",
    title: "Living heritage",
    region: "Pidurangala & Kandy",
    theme: "Culture & heritage",
    image: "kandy",
    alt: "The Temple of the Sacred Tooth Relic beside the water in Kandy",
    story:
      "Pair the view from Pidurangala with Kandy’s gardens, gem craft and dance. The Temple of the Sacred Tooth Relic is an optional stop in the sample.",
    suggestion:
      "Ask for more time in Kandy or a gentler alternative to the climb.",
    day: 4,
  },
] as const;
export type Experience = (typeof experiences)[number];
