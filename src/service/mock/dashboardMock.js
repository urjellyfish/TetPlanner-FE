/**
 * dashboardMock.js
 *
 * Static mock data for the Dashboard screen.
 *
 * ⚠️  Do NOT import this file directly from components.
 *     Only dashboardApi.js should import it (USE_MOCK flag controls the switch).
 *
 * To disable mock and hit the real API:
 *   → Set USE_MOCK = false in src/api/dashboardApi.js
 */

export const mockDashboardData = {
  tasks: {
    total: 16,
    completed: 12,
  },
  shopping: {
    total: 20,
    remaining: 8,
  },
  budget: {
    total: 20_000_000,
    used: 12_500_000,
  },
};

export const mockDailyBreakdown = [
  {
    id: "day-28",
    date: "2026-02-07",
    lunarDay: "28 Tết",
    isBigDay: false,
    tasks: [
      { id: "t1", title: "Gói Bánh Chưng (Wrap Rice Cakes)", completed: false },
      { id: "t2", title: "Clean Ancestor's Altar", completed: true },
    ],
    shoppingLists: [
      {
        id: "s1",
        name: "Last-min Decor",
        itemCount: 4,
        preview: "Flowers, Red envelopes, Kumquat tree...",
      },
    ],
  },
  {
    id: "day-29",
    date: "2026-02-08",
    lunarDay: "29 Tết",
    isBigDay: false,
    tasks: [
      { id: "t3", title: "Prepare Year-end Gift Baskets", completed: false },
    ],
    shoppingLists: [
      {
        id: "s2",
        name: "Food & Feast",
        itemCount: 12,
        preview: "Chicken, Sticky rice, Pork, Fruits...",
      },
    ],
  },
  {
    id: "day-30",
    date: "2026-02-09",
    lunarDay: "30 Tết",
    isBigDay: true,
    tasks: [
      { id: "t4", title: "Tất Niên Dinner (18:00)", completed: false, highlight: true },
      { id: "t5", title: "Cúng Giao Thừa (New Year Offering)", completed: false },
    ],
    shoppingLists: [
      {
        id: "s3",
        name: "Fresh Groceries",
        itemCount: 3,
        preview: "Fresh herbs, Ice, Soft drinks...",
      },
    ],
  },
];
