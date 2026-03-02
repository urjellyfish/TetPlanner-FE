/**
 * ProgressCard.jsx
 *
 * Reusable card — label, subtitle, percentage, and a progress bar with a
 * running horse icon (🐎) that tracks progress%, plus a finish flag (🏁).
 *
 * Props:
 *   title       {string}  — e.g. "Tasks Done"
 *   subtitle    {string}  — e.g. "12 of 16 completed"
 *   percent     {number}  — 0–100
 *   color       {string}  — fill color for bar + percentage text
 *   trackColor  {string}  — background color for bar track
 */

/**
 * Clamp horse position so the icon never overflows either edge of the bar.
 * Icon is ~20px wide on a container that is typically 500–900px wide,
 * so a 2 % / 97 % guard is sufficient.
 */
function clampPos(pct) {
  return Math.min(Math.max(pct, 2), 97);
}

const ProgressCard = ({ title, subtitle, percent, color, trackColor }) => {
  const pos = clampPos(percent);

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-[32px] border border-[#f1f5f9] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] w-full">
      {/* Top row — title + percentage */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[16px] font-bold leading-6 text-[#1e293b]">{title}</span>
          <span className="text-[12px] font-normal leading-4 text-[#64748b]">{subtitle}</span>
        </div>
        <span
          className="text-[40px] font-extrabold leading-8 tabular-nums"
          style={{ color }}
        >
          {percent}%
        </span>
      </div>

      {/*
        Progress bar area
        ─ outer wrapper: relative + padding-top creates room for icons above the bar
        ─ MUST NOT have overflow:hidden (would clip the horse/flag icons)
        ─ the inner track div keeps overflow:hidden for the fill bar only
      */}
      <div className="relative" style={{ paddingTop: "28px" }}>
        {/* Running horse — moves left→right with progress */}
        <div
          className="absolute top-0 select-none pointer-events-none"
          style={{
            left: `${pos}%`,
            transform: "translateX(-50%)",
            transition: "left 0.4s ease",
          }}
          aria-hidden
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/625/625386.png"
            alt=""
            width={28}
            height={28}
            style={{ display: "block" }}
          />
        </div>

        {/* Finish flag — always at the right end */}
        <div
          className="absolute top-0 right-0 text-lg leading-none select-none pointer-events-none"
          aria-hidden
        >
          🏁
        </div>

        {/* Bar track — overflow:hidden applied here only, not on the outer wrapper */}
        <div
          className="h-2 w-full rounded-full overflow-hidden"
          style={{ background: trackColor || "#e2e8f0" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${percent}%`,
              background: color,
              transition: "width 0.7s ease-out",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;

