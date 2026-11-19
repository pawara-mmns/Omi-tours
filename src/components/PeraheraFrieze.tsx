"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import "./perahera.css";

const plate = "/images/journal/dalada-perahera.svg";

function Vine({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 45" className={mirrored ? "perahera-vine mirrored" : "perahera-vine"}>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M1 38C31 38 49 34 73 25S120 4 144 15C158 22 167 24 179 19M41 35C32 35 24 29 20 24C29 24 36 28 41 35ZM66 28C54 28 46 22 42 16C55 17 62 21 66 28ZM94 17C83 19 75 15 66 7C79 7 89 10 94 17ZM127 12C119 8 116 5 114 1C123 2 131 6 134 12M73 26C71 33 64 39 56 42C60 33 66 28 73 26ZM111 13C106 21 98 25 89 26C94 19 102 14 111 13Z" />
        <path d="M140 14Q145 3 153 6Q160 10 152 14Q149 15 149 12" />
      </g>
    </svg>
  );
}

export function PeraheraFrieze() {
  const figure = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!figure.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(figure.current);
    return () => observer.disconnect();
  }, []);

  return (
    <figure id="perahera" ref={figure} className="wrap perahera-frieze">
      <div className="perahera-panorama">
        <Vine />
        <svg id="procession-art" className="perahera-print" viewBox="0 0 1490 497" role="img" aria-labelledby="perahera-description" data-moving={inView && !paused}>
          <title id="perahera-description">Torchbearers, standard bearers, a tusker carrying the ceremonial casket, Kandyan dancers and drummers in procession.</title>
          <use href={`${plate}#figures`} />
          <use className="perahera-banner" href={`${plate}#first-banner`} />
          <use className="perahera-banner banner-second" href={`${plate}#second-banner`} />
          <use className="perahera-flame" href={`${plate}#left-flame`} />
          <use className="perahera-flame flame-right" href={`${plate}#right-flame`} />
        </svg>
        <Vine mirrored />
      </div>
      <figcaption>
        <span className="perahera-name">Dalada Perahera</span>
        <span className="perahera-place">Kandy, Sri Lanka</span>
        <button
          type="button"
          className="perahera-motion"
          aria-controls="procession-art"
          aria-label={paused ? "Play procession animation" : "Pause procession animation"}
          title={paused ? "Play animation" : "Pause animation"}
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>
      </figcaption>
    </figure>
  );
}
