import type { CSSProperties } from "react";

const charms = [
  { image: "cobra-mask", name: "Cobra mask", width: 241, angle: -4, cord: 14, size: 1, period: 2350 },
  { image: "kandyan-drum", name: "Kandyan drum", width: 240, angle: 6, cord: 23, size: .82, period: 2510 },
  { image: "bird-mask", name: "Bird mask", width: 308, angle: -3, cord: 10, size: 1.04, period: 2280 },
  { image: "brass-lamp", name: "Brass oil lamp", width: 133, angle: 3, cord: 19, size: .94, period: 2450 },
];

function swing(button: HTMLButtonElement, angle: number, duration: number, direction: number) {
  const drop = button.querySelector<HTMLElement>(".charm-drop");
  if (!drop || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const current = getComputedStyle(drop).transform;
  drop.getAnimations().forEach(animation => animation.cancel());
  const turns = [19, -13, 8, -4.5, 2.2, -.8, 0];
  drop.animate([
    { transform: current, offset: 0, easing: "ease-out" },
    ...turns.map((turn, i) => ({
      transform: `rotate(${angle + direction * turn}deg)`,
      offset: (2 * i + 1) / 13, easing: "ease-in-out",
    })),
  ], { duration });
}

export function HangingCharms() {
  return (
    <div className="charm-rail wrap" role="group" aria-label="Sri Lankan craft charms">
      {charms.map(({ image, name, width, angle, cord, size, period }) => (
        <button key={image} className="charm-hook" type="button" aria-label={`Swing the ${name.toLowerCase()} charm`}
          style={{ "--rest": `${angle}deg`, "--cord": `${cord}px`, "--size": size } as CSSProperties}
          onPointerEnter={event => {
            if (event.pointerType === "touch") return;
            const bounds = event.currentTarget.getBoundingClientRect();
            swing(event.currentTarget, angle, period, event.clientX < bounds.left + bounds.width / 2 ? 1 : -1);
          }}
          onClick={event => swing(event.currentTarget, angle, period, Math.sign(angle))}>
          <span className="charm-drop" aria-hidden="true">
            <span className="charm-cord" />
            <img src={`/images/charms/${image}.webp`} alt="" width={width} height={300} loading="lazy" />
          </span>
        </button>
      ))}
    </div>
  );
}
