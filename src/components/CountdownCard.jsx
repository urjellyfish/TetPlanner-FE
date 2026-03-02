/**
 * CountdownCard.jsx
 *
 * Large red gradient card showing live countdown to Tết.
 * Countdown logic lives in useCountdown hook.
 */
import { useCountdown } from "../hooks/useCountdown";

/** Formats a number to always show 2 digits */
const pad = (n) => String(n).padStart(2, "0");

const timeUnits = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

const CountdownCard = ({ tetDate }) => {
  const timeLeft = useCountdown(tetDate);

  const tetDateLabel = new Date(tetDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="relative flex flex-col justify-between p-8 rounded-[40px] overflow-hidden shrink-0"
      style={{
        background: "linear-gradient(135deg, #e11d48 0%, #dc2626 50%, #be123c 100%)",
        boxShadow: "0 25px 50px 0 rgba(225,29,72,0.4)",
        minWidth: 340,
        flex: "0 0 auto",
        width: "100%",
        maxWidth: 648,
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-48px] right-[-48px] w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute bottom-[-48px] left-[-48px] w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(217,119,6,0.2)" }} />

      {/* Flower icon + heading */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          {/* Flower SVG (reused from FlowerLogo) */}
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="4" fill="rgba(255,255,255,0.9)" />
            <ellipse cx="14" cy="7" rx="3" ry="5" fill="rgba(255,255,255,0.85)" />
            <ellipse cx="14" cy="21" rx="3" ry="5" fill="rgba(255,255,255,0.85)" />
            <ellipse cx="7" cy="14" rx="5" ry="3" fill="rgba(255,255,255,0.85)" />
            <ellipse cx="21" cy="14" rx="5" ry="3" fill="rgba(255,255,255,0.85)" />
          </svg>
          <span className="text-[12px] font-bold tracking-[2.4px] uppercase text-white/90">
            The Year of Horse
          </span>
        </div>

        <div className="text-[36px] font-extrabold leading-tight text-white mb-2">
          Countdown to{" "}
          <span className="text-[#fcd34d]">Tết</span>
        </div>
        <p className="text-[14px] font-medium text-white/70">{tetDateLabel}</p>
      </div>

      {/* Timer units */}
      <div className="relative z-10 grid grid-cols-4 gap-4 mt-8">
        {timeUnits.map(({ key, label }) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border border-white/20"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <span className="text-[36px] font-extrabold leading-10 text-white tabular-nums">
              {pad(timeLeft[key])}
            </span>
            <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-white/60">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownCard;
