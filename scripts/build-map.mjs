import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
const atlas = JSON.parse(
  readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"),
);
const group = feature(atlas, atlas.objects.countries).features.find(
  (f) => Number(f.id) === 144,
);
const polys =
  group.geometry.type === "MultiPolygon"
    ? group.geometry.coordinates
    : [group.geometry.coordinates];
const project = ([lon, lat]) => [(lon - 79.3) * 100, (10.0 - lat) * 100];
const path = polys
  .map((poly) =>
    poly
      .map(
        (ring) =>
          ring
            .map(
              (pt, i) =>
                (i ? "L" : "M") +
                project(pt)
                  .map((n) => n.toFixed(1))
                  .join(" "),
            )
            .join("") + "Z",
      )
      .join(""),
  )
  .join("");
writeFileSync("src/data/island-outline.json", JSON.stringify(path));
