// Generates SVG path data for the visits maps from raw geo sources.
// Sources (data/maps-src/):
//   countries-110m.json  — world-atlas TopoJSON (Natural Earth)
//   uzb-adm1.geojson     — geoBoundaries UZB ADM1 (simplified)
// Output (lib/mapdata/): world.json, uzbekistan.json
// Run: node scripts/generate-maps.js

const fs = require("fs");
const path = require("path");
const iso = require("i18n-iso-countries");

const SRC = path.join(__dirname, "..", "data", "maps-src");
const OUT = path.join(__dirname, "..", "lib", "mapdata");

const UZ_REGION_NAMES = {
  "UZ-AN": "Andijon viloyati",
  "UZ-BU": "Buxoro viloyati",
  "UZ-FA": "Farg‘ona viloyati",
  "UZ-JI": "Jizzax viloyati",
  "UZ-NG": "Namangan viloyati",
  "UZ-NW": "Navoiy viloyati",
  "UZ-QA": "Qashqadaryo viloyati",
  "UZ-QR": "Qoraqalpog‘iston Respublikasi",
  "UZ-SA": "Samarqand viloyati",
  "UZ-SI": "Sirdaryo viloyati",
  "UZ-SU": "Surxondaryo viloyati",
  "UZ-TK": "Toshkent shahri",
  "UZ-TO": "Toshkent viloyati",
  "UZ-XO": "Xorazm viloyati",
};

function roundPath(d) {
  return d.replace(/\d+\.\d+/g, (m) => Number(m).toFixed(1));
}

// d3-geo treats polygons as spherical: a ring wound the wrong way selects
// the whole globe minus the shape. Rewind rings that cover > half the sphere.
function rewind(d3, feature) {
  const geom = feature.geometry;
  const polys =
    geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  for (const poly of polys) {
    for (let i = 0; i < poly.length; i++) {
      const ring = { type: "Polygon", coordinates: [poly[i]] };
      const wantsLarge = i > 0; // holes must wind opposite to the exterior
      const isLarge = d3.geoArea(ring) > 2 * Math.PI;
      if (isLarge !== wantsLarge) poly[i].reverse();
    }
  }
  return feature;
}

async function main() {
  const d3 = await import("d3-geo");
  const topojson = await import("topojson-client");
  const uzNames = new Intl.DisplayNames(["uz"], { type: "region" });

  fs.mkdirSync(OUT, { recursive: true });

  // ----- World -----
  const topo = JSON.parse(
    fs.readFileSync(path.join(SRC, "countries-110m.json"), "utf8")
  );
  const world = topojson.feature(topo, topo.objects.countries);
  const features = world.features.filter((f) => f.id !== "010"); // drop Antarctica

  const worldProj = d3.geoNaturalEarth1().fitSize([1000, 520], {
    type: "FeatureCollection",
    features,
  });
  const worldPath = d3.geoPath(worldProj);

  const worldOut = [];
  for (const f of features) {
    const alpha2 = iso.numericToAlpha2(f.id);
    const id = alpha2 || `n${f.id}`;
    let name = "";
    if (alpha2) {
      try {
        name = uzNames.of(alpha2) || "";
      } catch (_) {}
    }
    if (!name || name === alpha2) name = f.properties.name;
    worldOut.push({ id, name, d: roundPath(worldPath(f)) });
  }
  worldOut.sort((a, b) => a.name.localeCompare(b.name, "uz"));
  fs.writeFileSync(
    path.join(OUT, "world.json"),
    JSON.stringify(worldOut)
  );
  console.log(`world.json: ${worldOut.length} countries`);

  // ----- Uzbekistan regions -----
  const uzb = JSON.parse(
    fs.readFileSync(path.join(SRC, "uzb-adm1.geojson"), "utf8")
  );
  uzb.features.forEach((f) => rewind(d3, f));
  const uzbProj = d3.geoMercator().fitSize([1000, 620], uzb);
  const uzbPath = d3.geoPath(uzbProj);

  const uzbOut = uzb.features.map((f) => {
    const code = f.properties.shapeISO;
    return {
      id: code,
      name: UZ_REGION_NAMES[code] || f.properties.shapeName,
      d: roundPath(uzbPath(f)),
    };
  });
  uzbOut.sort((a, b) => a.name.localeCompare(b.name, "uz"));
  fs.writeFileSync(
    path.join(OUT, "uzbekistan.json"),
    JSON.stringify(uzbOut)
  );
  console.log(`uzbekistan.json: ${uzbOut.length} regions`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
