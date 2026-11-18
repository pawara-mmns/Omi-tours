import outline from "@/data/island-outline.json";
import journey from "@/data/journey.json";
type Stop = { lon: number; lat: number; day: number };
const mainStops: Stop[] = [
  { lon: 79.884, lat: 7.181, day: 1 },
  { lon: 79.835, lat: 7.209, day: 1 },
  { lon: 80.751, lat: 8.036, day: 2 },
  { lon: 80.762, lat: 7.966, day: 3 },
  { lon: 80.633, lat: 7.291, day: 4 },
  { lon: 80.418, lat: 6.99, day: 5 },
  { lon: 80.77, lat: 6.95, day: 5 },
  { lon: 80.743, lat: 6.943, day: 6 },
  { lon: 81.047, lat: 6.867, day: 6 },
  { lon: 81.063, lat: 6.877, day: 7 },
  { lon: 81.469, lat: 6.287, day: 8 },
  { lon: 80.818, lat: 6.426, day: 9 },
];
const x = (lon: number) => (lon - 79.3) * 100;
const y = (lat: number) => (10 - lat) * 100;
export function RouteMap({ day, coast }: { day: number; coast: string }) {
  const beach = journey.coasts.find((c) => c.name === coast);
  const stops = beach
    ? [...mainStops, { lon: beach.lon, lat: beach.lat, day: 10 }]
    : mainStops;
  const active = stops.filter((s) => s.day === day).at(-1);
  return (
    <figure className="routemap">
      <figcaption>
        <span className="micro">Route map</span>
        <b>Sri Lanka</b>
      </figcaption>
      <svg
        viewBox="-15 -10 330 440"
        role="img"
        aria-label={
          "Sri Lanka route, highlighting day " +
          day +
          ". Final stop: " +
          (beach?.name || "choice of five south coast beaches")
        }
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#c7d2c8"
              strokeWidth=".55"
            />
          </pattern>
        </defs>
        <rect x="-15" y="-10" width="330" height="440" fill="url(#grid)" />
        <path d={outline} fill="#d8dfcc" stroke="#a8b79e" strokeWidth="1.3" />
        <polyline
          points={stops.map((s) => x(s.lon) + "," + y(s.lat)).join(" ")}
          stroke="#80553c"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
        {!beach &&
          journey.coasts.map((c) => (
            <line
              key={c.name}
              x1={x(80.818)}
              y1={y(6.426)}
              x2={x(c.lon)}
              y2={y(c.lat)}
              stroke="#80553c"
              strokeDasharray="3 3"
            />
          ))}
        {stops.map((s, i) => (
          <circle
            key={i}
            cx={x(s.lon)}
            cy={y(s.lat)}
            r="3.3"
            fill="#fff9e9"
            stroke="#35553d"
            strokeWidth="1.4"
          />
        ))}
        {active && (
          <circle
            cx={x(active.lon)}
            cy={y(active.lat)}
            r="7"
            stroke="#fff"
            fill="#a75433"
            strokeWidth="2"
          />
        )}
        <g className="maplabels">
          <text x="138" y="184">
            Habarana
          </text>
          <text x="18" y="300">
            Negombo
          </text>
          <text x="106" y="260">
            Kandy
          </text>
          <text x="190" y="313">
            Ella
          </text>
          <text x="226" y="375">
            Yala
          </text>
          <text x="114" y="424">
            {beach?.name || "South coast"}
          </text>
        </g>
      </svg>
      <small>Route schematic · Lines connect stops</small>
    </figure>
  );
}
