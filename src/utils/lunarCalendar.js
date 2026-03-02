import { Solar, Lunar } from "lunar-javascript";

export function solarToLunar(dd, mm, yyyy) {
  const lunar    = Solar.fromYmd(yyyy, mm, dd).getLunar();
  const rawMonth = lunar.getMonth();
  return {
    day:   lunar.getDay(),
    month: Math.abs(rawMonth),
    year:  lunar.getYear(),
    leap:  rawMonth < 0,
  };
}

export function lunarToSolar(lunarDay, lunarMonth, lunarYear) {
  try {
    const solar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay).getSolar();
    const check = solarToLunar(solar.getDay(), solar.getMonth(), solar.getYear());
    if (check.day !== lunarDay || check.month !== lunarMonth || check.year !== lunarYear) {
      return null;
    }
    return (
      `${solar.getYear()}-` +
      `${String(solar.getMonth()).padStart(2, "0")}-` +
      `${String(solar.getDay()).padStart(2, "0")}`
    );
  } catch {
    return null;
  }
}

const LUNAR_MONTH_NAMES = [
  "", "Tháng Giêng", "Tháng Hai", "Tháng Ba", "Tháng Tư",
  "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám",
  "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Chạp",
];

export function getLunarDateLabel(dateStr) {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  if (!yyyy || !mm || !dd) return "";
  try {
    const { day, month, leap } = solarToLunar(dd, mm, yyyy);
    const monthName =
      (LUNAR_MONTH_NAMES[month] ?? `Tháng ${month}`) + (leap ? " (Nhuận)" : "");
    const base = `${day} ${monthName}`;
    if (month === 12 && day >= 27) return `${base} (${day} Tết)`;
    if (month === 1  && day >= 1 && day <= 7) return `${base} (Mùng ${day} Tết)`;
    return base;
  } catch {
    return "";
  }
}

export function getOccasionTitleFromLunar({ day, month }) {
  if (month === 12) return `${day} Tết`;
  if (month === 1)  return `Mùng ${day} Tết`;
  return `${day}/${month} Âm lịch`;
}

export function generateDefaultTetOccasions(solarYear) {
  const specs = [
    { lunarDay: 27, lunarMonth: 12, lunarYear: solarYear - 1, color: "#f59e0b" },
    { lunarDay: 28, lunarMonth: 12, lunarYear: solarYear - 1, color: "#e11d48" },
    { lunarDay: 29, lunarMonth: 12, lunarYear: solarYear - 1, color: "#f97316" },
    { lunarDay: 30, lunarMonth: 12, lunarYear: solarYear - 1, color: "#eab308" },
    { lunarDay:  1, lunarMonth:  1, lunarYear: solarYear,     color: "#22c55e" },
    { lunarDay:  2, lunarMonth:  1, lunarYear: solarYear,     color: "#0ea5e9" },
    { lunarDay:  3, lunarMonth:  1, lunarYear: solarYear,     color: "#6366f1" },
  ];

  return specs
    .map(({ lunarDay, lunarMonth, lunarYear, color }) => {
      const date = lunarToSolar(lunarDay, lunarMonth, lunarYear);
      if (!date) return null;
      return {
        id:          `tet-${solarYear}-${lunarMonth}-${lunarDay}`,
        customTitle: null,
        date,
        lunarDate:   { day: lunarDay, month: lunarMonth, year: lunarYear },
        color,
        isDefault:   true,
      };
    })
    .filter(Boolean);
}