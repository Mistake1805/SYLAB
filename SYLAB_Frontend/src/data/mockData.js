// =========================================================================
// Mock data for the gamified Dashboard. All numbers are illustrative and live
// in-memory — swap for real API responses when the backend is wired up.
// =========================================================================

export const currentUser = {
  name: 'Aarav Mehta',
  handle: '@aarav.codes',
  avatar: 'AM',
  level: 27,
  xp: 18450,
  xpToNext: 25000,
  tier: 'Platinum',
  tierIndex: 3, // see tiers[]
  rank: 142,
  solved: 1284,
  streak: {
    current: 47,
    best: 89,
    nextMilestone: 50,
  },
};

// Rank tiers, lowest -> highest. `tierIndex` in currentUser points here.
export const tiers = [
  { name: 'Bronze',      color: 'var(--tier-bronze)' },
  { name: 'Silver',      color: 'var(--tier-silver)' },
  { name: 'Gold',        color: 'var(--tier-gold)' },
  { name: 'Platinum',    color: 'var(--tier-platinum)' },
  { name: 'Diamond',     color: 'var(--tier-diamond)' },
  { name: 'Master',      color: 'var(--tier-master)' },
  { name: 'Grandmaster', color: 'var(--tier-grandmaster)' },
  { name: 'Legend',      color: 'var(--tier-legend)' },
];

// ~1 year of daily activity counts (0 = no activity that day). Used by the
// contribution calendar. Generated deterministically so the UI is stable.
export const contributionCalendar = (() => {
  const days = 364; // 52 weeks * 7
  const out = [];
  let seed = 7;
  // simple deterministic PRNG so the grid looks consistent across reloads
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < days; i++) {
    const r = rand();
    // Most days have some activity; occasional rest days; occasional bursts.
    let count = 0;
    if (r > 0.18) count = Math.floor(rand() * 3) + 1;
    if (r > 0.92) count = Math.floor(rand() * 6) + 5; // burst day
    out.push(count);
  }
  return out;
})();

export const boosters = [
  { id: 'double-xp', name: 'Double XP',      icon: 'Zap',      active: true,  remaining: '2h 14m', duration: '4h',  description: 'Earn 2× XP on every solve' },
  { id: 'daily',     name: 'Daily Booster',  icon: 'Sunrise',  active: true,  remaining: '5h 03m', duration: '24h', description: '+50% XP until reset' },
  { id: 'contest',   name: 'Contest Booster', icon: 'Trophy',  active: false, remaining: null,     duration: '2h',  description: 'Triple XP during contests' },
  { id: 'consist',   name: 'Consistency',    icon: 'Flame',    active: false, remaining: null,     duration: '7d',  description: 'Streak freeze + bonus XP' },
  { id: 'product',   name: 'Productivity',   icon: 'Rocket',   active: false, remaining: null,     duration: '1h',  description: 'Focus mode + XP multiplier' },
];

export const dailyMissions = [
  { id: 'd1', title: 'Solve 3 Easy problems',   target: 3,   done: 2,  xp: 120 },
  { id: 'd2', title: 'Solve 1 Medium problem',  target: 1,   done: 0,  xp: 180 },
  { id: 'd3', title: 'Maintain your streak',    target: 1,   done: 1,  xp: 80  },
  { id: 'd4', title: 'Review 2 solutions',      target: 2,   done: 1,  xp: 60  },
];

export const weeklyMissions = [
  { id: 'w1', title: 'Participate in 1 contest',  target: 1, done: 0, xp: 600 },
  { id: 'w2', title: 'Solve 15 problems',         target: 15, done: 9, xp: 900 },
  { id: 'w3', title: 'Reach 5,000 XP',            target: 5000, done: 3200, xp: 1200 },
  { id: 'w4', title: 'Hit a 7-day streak',        target: 7, done: 5, xp: 750 },
];

export const leaderboard = {
  global: [
    { rank: 1, name: 'Kenji Sato',     handle: '@kenji.kc',   tier: 'Legend',      xp: 184200, solved: 9821 },
    { rank: 2, name: 'Lena Park',      handle: '@lena.dev',   tier: 'Grandmaster', xp: 171800, solved: 9112 },
    { rank: 3, name: 'Marco Rossi',    handle: '@marco.rs',   tier: 'Grandmaster', xp: 168400, solved: 8990 },
    { rank: 4, name: 'Priya Nair',     handle: '@priya.n',    tier: 'Master',      xp: 152000, solved: 8120 },
    { rank: 5, name: 'Tom Becker',     handle: '@tbecker',    tier: 'Master',      xp: 149300, solved: 7890 },
    { rank: 6, name: 'Yara Haddad',    handle: '@yara.h',     tier: 'Diamond',     xp: 132100, solved: 7204 },
    { rank: 7, name: 'Diego Ramos',    handle: '@diego.r',    tier: 'Diamond',     xp: 128900, solved: 7012 },
    { rank: 8, name: 'Mei Lin',        handle: '@mei.lin',    tier: 'Diamond',     xp: 121400, solved: 6890 },
  ],
  weekly: [
    { rank: 1, name: 'Lena Park',      handle: '@lena.dev',   tier: 'Grandmaster', xp: 8200, solved: 142 },
    { rank: 2, name: 'Kenji Sato',     handle: '@kenji.kc',   tier: 'Legend',      xp: 7900, solved: 138 },
    { rank: 3, name: 'Yara Haddad',    handle: '@yara.h',     tier: 'Diamond',     xp: 7100, solved: 121 },
    { rank: 4, name: 'Marco Rossi',    handle: '@marco.rs',   tier: 'Grandmaster', xp: 6400, solved: 109 },
    { rank: 5, name: 'Diego Ramos',    handle: '@diego.r',    tier: 'Diamond',     xp: 5800, solved: 98  },
    { rank: 6, name: 'Mei Lin',        handle: '@mei.lin',    tier: 'Diamond',     xp: 5200, solved: 91  },
    { rank: 7, name: 'Priya Nair',     handle: '@priya.n',    tier: 'Master',      xp: 4900, solved: 88  },
    { rank: 8, name: 'Tom Becker',     handle: '@tbecker',    tier: 'Master',      xp: 4400, solved: 79  },
  ],
  friends: [
    { rank: 1, name: 'Ishaan Verma',   handle: '@ishaan.v',   tier: 'Diamond',     xp: 9200, solved: 210 },
    { rank: 2, name: 'Sofia Cruz',     handle: '@sofia.c',    tier: 'Platinum',    xp: 7800, solved: 188 },
    { rank: 3, name: 'Aarav Mehta',    handle: '@aarav.codes', tier: 'Platinum',   xp: 7400, solved: 176 }, // you
    { rank: 4, name: 'Noah Kim',       handle: '@noah.k',     tier: 'Gold',        xp: 6100, solved: 154 },
    { rank: 5, name: 'Emma Stone',     handle: '@emma.s',     tier: 'Gold',        xp: 5400, solved: 132 },
  ],
};

export const comparePeers = [
  { name: 'You',            handle: '@aarav.codes', xp: 18450, rank: 142, streak: 47, solved: 1284, you: true },
  { name: 'Ishaan Verma',   handle: '@ishaan.v',    xp: 21900, rank: 98,  streak: 63, solved: 1420 },
  { name: 'Sofia Cruz',     handle: '@sofia.c',     xp: 17600, rank: 188, streak: 31, solved: 1190 },
  { name: 'Global Avg.',    handle: '@avg',         xp: 9800,  rank: 0,   streak: 12, solved: 640,  avg: true },
];
