# SYLAB Frontend — Full Audit & Cleanup Plan

## Phase 1: Audit Report

I scanned every file under `src/`, all 1837 lines of CSS, the asset directories, and build config. Here's the complete findings report.

---

### 1. Performance: Unnecessary Re-renders & Unstable References

| File | Issue | Severity |
|------|-------|----------|
| [App.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/App.jsx#L94-L105) | `shellPages` and `publicPages` objects are **recreated on every render** — every page component gets new JSX element references each cycle. `openCelebration` callback (L94) and inline `() => setCelebrationOpen(false)` (L123, L131) are also unstable. | 🔴 High |
| [App.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/App.jsx#L77-L92) | `handleSignIn`, `handleSignUp`, `handleLeetCodeLink` are recreated every render — no `useCallback`. | 🟡 Medium |
| [AppLayout.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/layout/AppLayout.jsx#L17-L28) | `NavButton` accepts `onNavigate` prop and creates an inline `() => onNavigate(route)` arrow on every render. Not memoized. | 🟡 Medium |
| [AppLayout.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/layout/AppLayout.jsx#L66-L80) | `navItems.find()` runs on every render to resolve icons in the `desktopRoutes.map()` — minor but unnecessary work. | 🟢 Low |
| [Leaderboard.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Leaderboard.jsx#L38) | Podium always renders `leaderboardGlobal.slice(0, 3)` regardless of selected tab — should respect the tab selection. | 🟡 Medium (Bug) |
| [Calendar.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Calendar.jsx#L8) | `totalDays` computed with `.flat().reduce()` on every render — should be a module-level constant since `heatmapWeeks` is static. | 🟢 Low |

### 2. State Management Issues

| File | Issue | Severity |
|------|-------|----------|
| [App.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/App.jsx#L52) | `celebrationOpen` state lives in `AppRouter` — perfectly fine since only one modal exists. No misplaced global state found. | ✅ OK |
| [useAuth.js](file:///e:/SYLAB/SYLAB_Frontend/src/hooks/useAuth.js) | Well-structured: uses `useMemo` for actions and context value. `readStoredAuth` uses lazy init. **No issues found.** | ✅ OK |
| [useProjects.js](file:///e:/SYLAB/SYLAB_Frontend/src/hooks/useProjects.js) | **Empty file** — 0 bytes. Dead code. | 🟡 Medium |
| [api.js](file:///e:/SYLAB/SYLAB_Frontend/src/utils/api.js) | **Empty file** — 0 bytes. Dead code. | 🟡 Medium |

### 3. Duplicate/Redundant API Calls

| Finding | Details |
|---------|---------|
| No real API calls anywhere | The entire app uses **static mock data** from [codeRankData.js](file:///e:/SYLAB/SYLAB_Frontend/src/lib/codeRankData.js). There are no `fetch()` or `axios` calls. No LeetCode API integration exists yet — all data is hardcoded. |
| Compare.jsx | Uses static `compareMetrics` — no keystroke-triggered API calls to debounce. |

> [!NOTE]
> The user mentioned "LeetCode stats being fetched multiple times" — but the current codebase has **zero network requests**. All data comes from static exports. This is a future concern when real API integration is added.

### 4. Memory Leaks & Event Listener Cleanup

| File | Issue | Severity |
|------|-------|----------|
| [ScrollIntro.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/ScrollIntro.jsx#L200-L226) | ✅ **Well-written.** Scroll handler is already RAF-gated (L201-206). Resize handler is RAF-gated (L209-214). Cleanup function (L220-225) properly removes listeners and cancels both RAF handles. Frame cache initialization (L133-141) uses `cancelled` flag. | ✅ OK |
| [ScrollIntro.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/ScrollIntro.jsx#L183) | `renderAtCurrent()` calls `container.getBoundingClientRect()` inside the RAF callback — this is fine since it's gated to one call per animation frame. Not layout thrashing. | ✅ OK |
| [ScrollIntro.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/ScrollIntro.jsx#L25-L98) | `FrameCache` stores images in a `Map` that grows then evicts. The `inflight` set stores `Promise` objects (L88) keyed by `Promise` reference — but `inflight.delete(i)` at L80 deletes by frame index `i`, not the promise. **Bug:** `inflight.add(p)` adds a Promise, but `inflight.delete(i)` tries to delete the integer index, which will never match. The `while (this.inflight.size >= this.maxConcurrent)` at L75 may never gate properly. | 🔴 High (Bug) |
| [LevelUpModal.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/LevelUpModal.jsx#L8-L16) | ✅ Properly cleans up `setTimeout` on unmount/close. | ✅ OK |
| [App.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/App.jsx#L28-L37) | ✅ `hashchange` listener properly cleaned up. | ✅ OK |

### 5. Unoptimized Assets

| Asset | Details |
|-------|---------|
| `public/frames/` | **300 JPEG frames**, total **6.27 MB** (avg 21.9 KB each, max 51.3 KB). Individual files are reasonably sized for scroll animation frames. Total payload is manageable since the `FrameCache` class prefetches only 24 frames around center and evicts distant ones. |
| `frames/` (root) | A **duplicate copy** of the same 300 frames (6.27 MB) exists at `SYLAB_Frontend/frames/` outside `public/`. This is dead weight — the code references `/frames/frame_XXXX.jpg` which resolves to `public/frames/`. |
| Font loading | `index.html` loads **Nunito Sans** (L12), but CSS uses **Inter** (L1 of index.css) and references **Bricolage Grotesque** and **IBM Plex Sans** (L200, L1137) without loading them. **Three unused/missing font families.** |

### 6. Styling Inconsistencies

This is the **biggest problem area**. The CSS is a layered mess of at least **4 competing design systems**:

| System | Prefix | Where it's used |
|--------|--------|-----------------|
| "Legacy" CodeRank | `cr-` | Auth pages, splash, modal, sidebar, most actual CSS rules (1400+ lines) |
| "UI/UX Pro Max" | `uxpm-` | CSS variables (L3-L118), layout grid (L475-L812), some utility classes — **but most `uxpm-` utility classes referenced in JSX have no CSS definitions** |
| "u-" utilities | `u-` | Defined in CSS (L326-L437) but **never used in any JSX file** |
| Pulse Interface Core | (target) | Not implemented yet — the spec calls for `#FF6A55` coral / `#8B5CF6` violet / `#09090E` bg |

#### Critical styling bugs:

| Issue | Details |
|-------|---------|
| **Broken utility classes** | Dashboard components use classes like `uxpm-text-primary`, `uxpm-heading-2`, `uxpm-body-sm`, `uxpm-body-lg`, `uxpm-body-xs`, `uxpm-u-body`, `uxpm-heading-3`, `uxpm-heading-4`, `uxpm-eyebrow`, `uxpm-text-secondary`, `uxpm-text-muted`, etc. — **none of these have CSS definitions**. Only `uxpm-text-muted` exists (L690). All text sizing/coloring on dashboard pages is essentially broken/using browser defaults. |
| **Dynamic class names** | [Overview.jsx L103-104](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Overview.jsx#L103-L104), [Friends.jsx L19](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Friends.jsx#L19), [Projects.jsx L26-27](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Projects.jsx#L26-L27) use template-literal class names like `` uxpm-bg-${item.iconTone}/20 `` — these aren't real CSS classes and won't work. |
| **Conflicting color system** | CSS defines `--uxpm-primary: #00F0FF` (cyan) and `--cr-primary` referencing it — but the target Pulse spec says primary should be `#FF6A55` (coral). The current app is rendered in cyan/blue, not the target coral/violet. |
| **Mixed border-radius** | CSS uses `--cr-radius-xl: 40px` for cards, but Pulse spec says `16px` for cards and `13px` for buttons. |
| **Font chaos** | HTML loads Nunito Sans, CSS imports Inter, heading rules reference Bricolage Grotesque and IBM Plex Sans — none of the latter two are loaded. |
| **Heatmap class names** | [Calendar.jsx L5](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Calendar.jsx#L5) references `cr-heatmap-cell--0` through `--4` which exist in CSS, but the JSX also wraps them in `uxpm-heatmap-cell` + `uxpm-w-4 uxpm-h-4` which don't exist. |
| **Tab button classes** | [Leaderboard.jsx L21](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Leaderboard.jsx#L21) uses `uxpm-tab-button` — this class doesn't exist. The actual CSS class is `cr-tab-switcher button`. |
| **Unused `@tailwindcss/vite`** | Listed in `package.json` as dependency but no Tailwind config or directives exist. The `uxpm-` prefixed utility classes in JSX look like Tailwind classes but aren't — they're just dangling classnames with no CSS. |

### 7. Component Props/State & Missing Guards

| File | Issue |
|------|-------|
| [Profile.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Profile.jsx#L5) | Receives `onNavigate` prop but never uses it. |
| [Compare.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Compare.jsx#L13) | Receives `currentUser` prop via App.jsx L102 but ignores it — displays static `compareMetrics` data. |
| [Leaderboard.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Leaderboard.jsx#L6) | Receives `currentUser` prop via App.jsx L101 but ignores it. |
| [Friends.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Friends.jsx#L5) | Receives `currentUser` prop via App.jsx L103 but ignores it. |
| [BadgePill UI](file:///e:/SYLAB/SYLAB_Frontend/src/components/ui/index.jsx#L40) | Accepts `className` prop but doesn't use it — drops it silently. |
| All dashboard pages | **No loading states** — everything renders synchronously from static data so this isn't a bug currently, but will be critical when real APIs are added. |
| All dashboard pages | **No error boundaries** — any render error will crash the entire app. |

---

## Phase 2: Performance Fixes

### [MODIFY] [ScrollIntro.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/ScrollIntro.jsx)
- **Fix `FrameCache.inflight` bug**: Change `inflight` from `Set` of Promises to a `Map<number, Promise>` keyed by frame index, so `inflight.delete(i)` actually works and the concurrency limiter gates correctly.

### [MODIFY] [App.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/App.jsx)
- Wrap `handleSignIn`, `handleSignUp`, `handleLeetCodeLink`, `openCelebration` in `useCallback`.
- Memoize the `closeCelebration` handler (currently inline `() => setCelebrationOpen(false)` on L123 and L131).
- Memoize `shellPages` and `publicPages` objects via `useMemo` (keyed on the relevant callbacks), or hoist page components to avoid unnecessary remounting.

### [MODIFY] [AppLayout.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/layout/AppLayout.jsx)
- Memoize `NavButton` with `React.memo`.
- Stabilize the `onClick` handler inside `NavButton` with `useCallback`.
- Pre-compute the `currentNav` lookup or memoize it.

### [MODIFY] [Calendar.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Calendar.jsx)
- Move `totalDays` computation to module level (it's derived from a static constant).

### [MODIFY] [Leaderboard.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/Leaderboard.jsx)
- Fix podium to respect selected tab (currently always shows global top 3 regardless of `friends` tab selection).

---

## Phase 3: UI Consistency — Apply Pulse Interface Core Design System

> [!IMPORTANT]
> This is a major overhaul. The current CSS has ~1837 lines across 4 competing systems. The plan is to **unify everything under the Pulse spec** while keeping all existing class names working (just remapping their values).

### [MODIFY] [index.css](file:///e:/SYLAB/SYLAB_Frontend/src/styles/index.css)

**Color token remapping** — change `:root` variables to Pulse spec:
```css
--cr-bg: #09090E;           /* ✅ already correct */
--cr-bg-alt: #0A0A10;       /* ✅ already correct */
--cr-primary: #FF6A55;      /* was #00F0FF cyan → coral */
--cr-primary-strong: #8B5CF6; /* was #0A45FF → violet */
--cr-text: #F4F1EA;         /* was #FFFFFF → warm neutral */
--cr-muted: #A9A3B5;        /* was #B3B3B3 → warm muted */
```

**Border radius normalization**:
```css
--cr-radius-xl: 16px;   /* was 40px → 16px for cards */
--cr-radius-lg: 16px;   /* was 12px → 16px */
--cr-radius-md: 13px;   /* was 12px → 13px for buttons */
```

**Add missing `uxpm-` utility class definitions** — map all the `uxpm-text-primary`, `uxpm-heading-*`, `uxpm-body-*`, etc. referenced in JSX to actual CSS rules using Pulse tokens.

**Add `.pulse-glass` class** matching the spec (glass blur, subtle border, layered shadow).

**Add `.pulse-btn-primary` / `.pulse-btn-secondary`** and remap `.cr-btn--primary` to use Pulse coral gradient instead of blue gradient.

**Add `.pulse-text-gradient`** for gradient headings.

**Fix font loading** — remove unused Nunito Sans from `index.html`, add Bricolage Grotesque and IBM Plex Sans (if still needed), or simplify everything to Inter-only per the Pulse spec.

### [MODIFY] [index.html](file:///e:/SYLAB/SYLAB_Frontend/index.html)
- Replace Nunito Sans link with Inter (already imported via CSS, so just remove the HTML link).
- Update `theme-color` to `#09090E`.

### [MODIFY] All dashboard components
- Replace dynamic template-literal classnames (`` uxpm-bg-${tone}/20 ``) with proper mapped CSS classes.
- Ensure Leaderboard tab buttons use `cr-tab-switcher` CSS classes that actually exist.

### Component-specific Pulse alignment

| Component | Changes needed |
|-----------|---------------|
| [LevelUpModal.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/dashboard/LevelUpModal.jsx) | Already uses `cr-` classes — colors will update automatically from token remapping. |
| Auth pages (Login, Register, ForgotPassword) | Already use `cr-` classes — will inherit Pulse colors from token changes. May need gradient updates on `.cr-btn--primary`. |
| [SplashScreen.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/onboarding/SplashScreen.jsx) | Uses `cr-` classes — will inherit. Rain particle color needs updating from blue to coral. |
| [LeetCodeLinking.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/onboarding/LeetCodeLinking.jsx) | Uses `cr-` classes — will inherit. |

---

## Phase 4: Component Hardening

### All dashboard components
- Fix dynamic classnames that embed runtime values into class strings.
- Add null-check guards on `currentUser?.` access patterns (already mostly present — verify completeness).
- Add `key` prop audits (all `.map()` calls appear to have keys — verified).

### [MODIFY] [ui/index.jsx](file:///e:/SYLAB/SYLAB_Frontend/src/components/ui/index.jsx)
- Fix `BadgePill` to forward `className` prop (currently drops it).
- Forward any extra props via spread where missing.
- Add `type="button"` defaults where applicable to prevent unintentional form submissions.

### Cleanup dead files
- Delete or stub out [useProjects.js](file:///e:/SYLAB/SYLAB_Frontend/src/hooks/useProjects.js) (empty file).
- Delete or stub out [api.js](file:///e:/SYLAB/SYLAB_Frontend/src/utils/api.js) (empty file).
- Consider deleting `SYLAB_Frontend/frames/` duplicate directory (6.27 MB of duplicated assets).

---

## Phase 5: Verification Plan

### Build Verification
- Run `npm run build` and confirm zero errors.
- Run `npm run dev` and verify all routes render without console errors.

### Functional Verification
- Verify auth flow: Splash → Login → Dashboard → Sign Out cycle.
- Verify onboarding: Register → LeetCode Linking → Dashboard.
- Verify LevelUpModal confetti fires on celebration trigger.
- Verify scroll intro animation plays smoothly.
- Verify all navigation routes render correct pages.
- Verify tab switching on Leaderboard works correctly (both Global/Friends).

### Visual Verification
- Confirm all cards use Pulse glass treatment.
- Confirm coral/violet accent colors appear throughout.
- Confirm no residual blue/cyan colors remain.
- Confirm text hierarchy uses proper sizes and warm neutral colors.
- Confirm consistent 16px card radii and 13px button radii.

---

## Open Questions

> [!IMPORTANT]
> **Duplicate `frames/` folder**: There's a copy at `SYLAB_Frontend/frames/` (300 files, 6.27 MB) that duplicates `public/frames/`. Should I delete it?

> [!IMPORTANT]
> **Font strategy**: The Pulse spec says Inter-only. The current CSS also references Bricolage Grotesque and IBM Plex Sans for headings and body text. Should I keep these secondary fonts or go pure Inter?

> [!WARNING]
> **`@tailwindcss/vite` dependency**: It's in `package.json` but Tailwind isn't configured or used. The `uxpm-` prefixed utility classes in JSX look like custom Tailwind classes but they're just unstyled classnames. Should I remove the Tailwind dependency entirely, or do you plan to use Tailwind in the future?

> [!IMPORTANT]
> **Empty placeholder files**: `hooks/useProjects.js` and `utils/api.js` are both 0-byte empty files. Should I delete them or add placeholder exports for future use?
