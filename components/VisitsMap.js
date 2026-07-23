"use client";

import { useMemo, useRef, useState } from "react";
import WORLD from "@/lib/mapdata/world.json";
import UZB from "@/lib/mapdata/uzbekistan.json";

const EMPTY_FILL = "#dfe6f6";
const UZ_HOME_FILL = "#3ecf1e";
const LIGHT = [169, 190, 235]; // 1 marta — och ko‘k
const DARK = [45, 74, 158]; // eng ko‘p — to‘q ko‘k
// Hududlar xaritasi tashriflar soniga qarab emas, bir xil ko‘k rangda bo‘yaladi.
const REGION_FILL = "#2d4a9e";

function scaleColor(visits, max) {
  const t = max > 1 ? (visits - 1) / (max - 1) : 1;
  const c = LIGHT.map((l, i) => Math.round(l + (DARK[i] - l) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function MapSvg({ shapes, viewBox, visitMap, maxVisits, homeId, onHover, onLeave, zoom, solidFill }) {
  return (
    <svg
      className="vmap-svg"
      viewBox={viewBox}
      role="img"
      aria-label="Tashriflar xaritasi"
    >
      <g
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "50% 50%",
          transition: "transform .25s ease",
        }}
      >
        {shapes.map((s, si) => {
          const visits = visitMap[s.id];
          const isHome = s.id === homeId;
          const fill = solidFill
            ? solidFill
            : isHome
            ? UZ_HOME_FILL
            : visits
            ? scaleColor(visits, maxVisits)
            : EMPTY_FILL;
          return (
            <path
              key={`${s.id}-${si}`}
              d={s.d}
              fill={fill}
              stroke="#ffffff"
              strokeWidth={zoom > 1 ? 0.8 / zoom : 0.8}
              className={visits && !isHome ? "vmap-shape visited" : "vmap-shape"}
              onMouseMove={(e) => onHover(e, s, visits)}
              onMouseLeave={onLeave}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default function VisitsMap({ visits }) {
  const [tab, setTab] = useState("world");
  const [tip, setTip] = useState(null);
  const [zoom, setZoom] = useState(1);
  const wrapRef = useRef(null);

  const { worldMap, regionMap, worldMax, regionMax } = useMemo(() => {
    const worldMap = {};
    const regionMap = {};
    for (const v of visits || []) {
      if (v.scope === "world") worldMap[v.code] = v.visits;
      else regionMap[v.code] = v.visits;
    }
    return {
      worldMap,
      regionMap,
      worldMax: Math.max(1, ...Object.values(worldMap)),
      regionMax: Math.max(1, ...Object.values(regionMap)),
    };
  }, [visits]);

  function handleHover(e, shape, count) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      name: shape.name,
      count: count || 0,
      home: tab === "world" && shape.id === "UZ",
    });
  }

  function switchTab(next) {
    setTab(next);
    setTip(null);
    setZoom(1);
  }

  const isWorld = tab === "world";

  return (
    <section className="container visits-map">
      <div className="vmap-tabs">
        <button
          className={isWorld ? "vmap-tab active" : "vmap-tab"}
          onClick={() => switchTab("world")}
        >
          Xorijga tashriflar
        </button>
        <button
          className={!isWorld ? "vmap-tab active" : "vmap-tab"}
          onClick={() => switchTab("region")}
        >
          Hududlarga tashriflar
        </button>
      </div>

      <div className="vmap-stage" ref={wrapRef}>
        {isWorld ? (
          <MapSvg
            shapes={WORLD}
            viewBox="0 0 1000 520"
            visitMap={worldMap}
            maxVisits={worldMax}
            homeId="UZ"
            onHover={handleHover}
            onLeave={() => setTip(null)}
            zoom={zoom}
          />
        ) : (
          <MapSvg
            shapes={UZB}
            viewBox="0 0 1000 620"
            visitMap={regionMap}
            maxVisits={regionMax}
            homeId={null}
            onHover={handleHover}
            onLeave={() => setTip(null)}
            zoom={zoom}
            solidFill={REGION_FILL}
          />
        )}

        <div className="vmap-zoom">
          <button
            aria-label="Yaqinlashtirish"
            onClick={() => setZoom((z) => Math.min(4, z * 1.5))}
          >
            +
          </button>
          <button
            aria-label="Uzoqlashtirish"
            onClick={() => setZoom((z) => Math.max(1, z / 1.5))}
          >
            &minus;
          </button>
        </div>

        {tip && (
          <div
            className="vmap-tooltip"
            style={{ left: tip.x + 14, top: tip.y + 14 }}
          >
            <b>{tip.name}</b>
            {tip.home ? (
              <span>Vatanimiz</span>
            ) : tip.count > 0 ? (
              <span>
                {tip.count} marta tashrif buyurgan
              </span>
            ) : (
              <span className="vmap-tip-none">Tashrif buyurilmagan</span>
            )}
          </div>
        )}
      </div>

    </section>
  );
}
