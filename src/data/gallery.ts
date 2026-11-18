export type GalleryPhoto = {
  image: string;
  place: string;
  caption: string;
  alt: string;
  day: number;
};

export const album: { title: string; photos: GalleryPhoto[] }[] = [
  {
    title: "Hills & rivers",
    photos: [
      {
        image: "ella",
        place: "Ella",
        caption: "A bend in the line",
        alt: "A traveler looks down at Nine Arch Bridge curving through the green hills of Ella.",
        day: 7,
      },
      {
        image: "hill-rail",
        place: "Nanu Oya to Ella",
        caption: "From the train window",
        alt: "A blue passenger train rounds a wooded curve in the hill country.",
        day: 6,
      },
      {
        image: "kitulgala",
        place: "Kitulgala",
        caption: "White water at Kitulgala",
        alt: "Rafters paddle together through white-water rapids.",
        day: 5,
      },
    ],
  },
  {
    title: "Into the wild",
    photos: [
      {
        image: "yala",
        place: "Yala National Park",
        caption: "On a low branch",
        alt: "A leopard on a tree branch with a safari jeep in the background.",
        day: 8,
      },
      {
        image: "habarana",
        place: "Habarana",
        caption: "At the edge of the grassland",
        alt: "Elephants beside a safari jeep in open grassland.",
        day: 2,
      },
      {
        image: "elephant-home",
        place: "Udawalawe",
        caption: "Feeding time",
        alt: "A keeper feeds a calf at the Elephant Transit Home.",
        day: 9,
      },
    ],
  },
  {
    title: "Heritage & coast",
    photos: [
      {
        image: "pidurangala",
        place: "Pidurangala",
        caption: "Sigiriya in the evening light",
        alt: "A traveler on Pidurangala faces Sigiriya across the forest.",
        day: 3,
      },
      {
        image: "kandy",
        place: "Kandy",
        caption: "Beside the temple waters",
        alt: "A waterside view of the Temple of the Sacred Tooth Relic in Kandy.",
        day: 4,
      },
      {
        image: "south-coast",
        place: "South coast",
        caption: "The last stop by the sea",
        alt: "Clear turquoise water curves around a sheltered beach.",
        day: 10,
      },
    ],
  },
];
