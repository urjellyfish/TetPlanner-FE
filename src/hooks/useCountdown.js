/**
 * useCountdown.js
 *
 * Returns live countdown { days, hours, minutes, seconds } to a target date.
 * Updates every second via setInterval.
 * Returns all zeros when the target date has passed.
 */
import { useState, useEffect } from "react";

function calcTimeLeft(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * @param {Date | string} targetDate — the date to count down to
 * @returns {{ days: number, hours: number, minutes: number, seconds: number }}
 */
export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}
