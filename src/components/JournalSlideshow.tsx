"use client";

import { useEffect, useRef, useState } from "react";

const scenes = [
  {
    photo: "",
    description:
      "Journal illustration of a blue train crossing a stone viaduct in the tea hills.",
  },
  {
    photo: "pidurangala",
    description:
      "A traveler looks across the forest toward Sigiriya at sunset.",
  },
  {
    photo: "kandy",
    description:
      "The Temple of the Sacred Tooth Relic beside the water in Kandy.",
  },
  {
    photo: "habarana",
    description: "Elephants in open grassland beside a safari jeep.",
  },
  {
    photo: "south-coast",
    description:
      "Clear turquoise water along a sheltered beach on the south coast.",
  },
] as const;

export function JournalSlideshow() {
  const gallery = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState({ current: 0, previous: -1 });
  const [loaded, setLoaded] = useState<number[]>([0]);

  const [motionAllowed, setMotionAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabActive, setTabActive] = useState(true);

  useEffect(() => {
    // Cached images can finish loading before React attaches its load handlers.
    gallery.current
      ?.querySelectorAll<HTMLImageElement>(".scene-photo")
      .forEach((image, offset) => {
        if (image.complete && image.naturalWidth > 0) markLoaded(offset + 1);
      });
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setMotionAllowed(!preference.matches);
    const syncVisibility = () => setTabActive(!document.hidden);
    syncMotion();
    syncVisibility();
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (gallery.current) observer.observe(gallery.current);
    return () => {
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!motionAllowed || !visible || !tabActive || loaded.length < 2) return;
    const timer = window.setInterval(() => {
      setSlide(({ current }) => ({
        previous: current,
        current: loaded[(loaded.indexOf(current) + 1) % loaded.length],
      }));
    }, 6000);
    return () => window.clearInterval(timer);
  }, [motionAllowed, visible, tabActive, loaded]);

  function markLoaded(index: number) {
    setLoaded((ready) =>
      ready.includes(index) ? ready : [...ready, index].sort((a, b) => a - b),
    );
  }

  return (
    <div
      ref={gallery}
      className="journal-plate journal-slideshow"
      role="img"
      aria-label={scenes[slide.current].description}
    >
      <img
        className="slideshow-mount"
        src="/images/journal/railway-mount.webp"
        alt=""
        width="843"
        height="559"
        fetchPriority="high"
      />
      <div className="slideshow-window" aria-hidden="true">
        {scenes.map((scene, index) => {
          if (!scene.photo) return null;
          let layer = "scene-photo";
          if (index === slide.current) layer += " is-current";
          if (index === slide.previous)
            layer +=
              slide.current === 0 ? " revealing-railway" : " is-previous";
          return (
            <img
              key={scene.photo}
              alt=""
              width="800"
              height="510"
              className={layer}
              src={`/images/${scene.photo}.webp`}
              decoding="async"
              fetchPriority="low"
              onLoad={() => markLoaded(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
