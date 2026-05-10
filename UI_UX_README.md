# 📘 Smart Library UI Documentation

> A senior UI/UX audit of the **Smart Library Management System** frontend (`/client`).
> Stack: **React 18 + Vite + Redux Toolkit + TailwindCSS + Framer Motion + lucide-react**.

---

## 1. Overview

Smart Library is a role-based library management SPA with three audiences:

- **Public / Guest** – marketing home, catalog browsing, auth flows.
- **Member** – personal dashboard, borrowed books, analytics, profile.
- **Admin** – CRUD over books/users, borrow approvals, reports.

### High-level architecture

| Layer | Implementation |
|---|---|
| Routing | `react-router-dom` with lazy `Suspense` + `PageSkeleton` fallback |
| State | Redux Toolkit slices (`authSlice`, `bookSlice`, `borrowSlice`, `waitlistSlice`, `analyticsSlice`, …) |
| Theming | `ThemeContext` (light/dark, persisted in `localStorage`, default **dark**) with `darkMode: 'class'` in Tailwind |
| Animation | Framer Motion (`motion`, `AnimatePresence`, `useInView`) |
| Icons | `lucide-react` (primary) **and** `react-icons/fi` (secondary) – *two icon libraries coexist* |
| Notifications | `react-hot-toast`, globally configured in [client/src/App.jsx](client/src/App.jsx#L56-L66) |
| Guards | [ProtectedRoute](client/src/components/common/ProtectedRoute.jsx) wraps `admin/*` and `member/*` |

### Global shell

[App.jsx](client/src/App.jsx#L67-L79) renders:

```
<Toaster />
<Navbar />            ← fixed, z-50, 16/20 h spacer beneath
<main><Suspense fallback={<PageSkeleton/>}><Routes/></Suspense></main>
<Footer />
```

---

## 2. Pages & Routes

All routes defined in [App.jsx](client/src/App.jsx#L74-L168).

### Public

| Route | File | Purpose |
|---|---|---|
| `/` | [Home.jsx](client/src/pages/Home.jsx) | Hero, features, stats, trust badges |
| `/login` | [Login.jsx](client/src/pages/Login.jsx) | Email/password sign-in, glass card |
| `/register` | [Register.jsx](client/src/pages/Register.jsx) | Sign-up + role select |
| `/verify-otp` | [VerifyOTP.jsx](client/src/pages/VerifyOTP.jsx) | OTP entry |
| `/forgot-password` | [ForgotPassword.jsx](client/src/pages/ForgotPassword.jsx) | Request reset |
| `/reset-password/:token` | [ResetPassword.jsx](client/src/pages/ResetPassword.jsx) | New password form |
| `/about` | [About.jsx](client/src/pages/About.jsx) | Marketing content |
| `/contact` | [Contact.jsx](client/src/pages/Contact.jsx) | Contact form |
| `/catalog` | [Catalog.jsx](client/src/pages/Catalog.jsx) | Searchable/paginated book grid |
| `/books/:id` | [BookDetail.jsx](client/src/pages/BookDetail.jsx) | Book info + reviews + borrow |
| `*` (404) | inline in `App.jsx` | Gradient 404 with CTA |

### Member (protected, role=`member`)

| Route | File |
|---|---|
| `/member/dashboard` | [MemberDashboard.jsx](client/src/pages/member/MemberDashboard.jsx) |
| `/member/my-books` | [MyBooks.jsx](client/src/pages/member/MyBooks.jsx) |
| `/member/profile` | [Profile.jsx](client/src/pages/member/Profile.jsx) *(also admin-accessible)* |
| `/member/analytics` | [ReadingAnalytics.jsx](client/src/pages/member/ReadingAnalytics.jsx) |

### Admin (protected, role=`admin`)

| Route | File |
|---|---|
| `/admin/dashboard` | [AdminDashboard.jsx](client/src/pages/admin/AdminDashboard.jsx) |
| `/admin/books` | [ManageBooks.jsx](client/src/pages/admin/ManageBooks.jsx) |
| `/admin/users` | [ManageUsers.jsx](client/src/pages/admin/ManageUsers.jsx) |
| `/admin/borrow-records` | [BorrowRecords.jsx](client/src/pages/admin/BorrowRecords.jsx) |
| `/admin/reports` | [Reports.jsx](client/src/pages/admin/Reports.jsx) |

---

## 3. Layout Structure

### 3.1 Navbar — [Navbar.jsx](client/src/components/layout/Navbar.jsx)

- **Fixed, full-width**, z-50, transparent by default, becomes **`bg-white/80 dark:bg-surface-100/80 backdrop-blur-xl`** after 20 px scroll ([Navbar.jsx](client/src/components/layout/Navbar.jsx#L22-L25)).
- Height: `h-16` mobile / `h-20` desktop; spacer div matches in `App.jsx`.
- Left: glowing `BookOpen` logo with blurred violet halo + `Smart` + violet `Library` wordmark.
- Center (desktop ≥ `md`): 4 nav links with a shared **`layoutId="navbar-indicator"`** animated underline (spring transition).
- Right: theme toggle (Sun/Moon), auth-state-dependent CTAs (Login / Get Started / Dashboard / Analytics / QR / Logout), and user name.
- Mobile: hamburger drawer via `AnimatePresence` (height + opacity animation).

### 3.2 Sidebar — [Sidebar.jsx](client/src/components/layout/Sidebar.jsx)

**Admin-only**, used inside admin pages (not globally in the shell).

- Desktop: `w-64`, `hidden lg:block`, sticky full-height, bordered.
- Mobile: **FAB toggle** (`bottom-20 left-4`, gradient violet→indigo, pill) + full-screen overlay + 72 w slide-in drawer with backdrop blur.
- Active `NavLink` style: `bg-gradient-to-r from-violet-600/20 to-indigo-600/20` + violet border ring.
- Items: Dashboard, Manage Books, Manage Users, Borrow Records, Reports; bottom: My Profile.
- **Note:** Member routes do not use a sidebar — navigation is via Navbar links only.

### 3.3 Footer — [Footer.jsx](client/src/components/layout/Footer.jsx)

- 4-column grid (`sm:grid-cols-2 lg:grid-cols-4`): Brand + socials / Quick Links / Product / Newsletter.
- Decorative gradient top border (`via-violet-500/50`).
- Inputs styled consistently with the global form language; newsletter submit uses violet→indigo gradient.
- Bottom bar: copyright + Privacy / Terms / Cookies links (all `href="#"` placeholders).
- Social icons are placeholders (`href="#"`).

### 3.4 Main content areas

Pages follow one of three templates:

1. **Marketing / Landing** (`Home`, `About`) — full-bleed sections with `hero-gradient`, `GlowBlob`, grid overlays, `FadeInSection` wrappers.
2. **Auth cards** (`Login`, `Register`, `VerifyOTP`, `Forgot/Reset`) — centered `glass-card` (max-w-md) over animated violet/cyan blobs.
3. **App pages** (dashboards, catalog, admin) — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`, `pt-8/12 pb-16`, stat-grid + primary content + list/table.

### 3.5 Cards / Tables / Forms / Modals

- **Cards:** [BookCard.jsx](client/src/components/books/BookCard.jsx), [DashboardCard.jsx](client/src/components/common/DashboardCard.jsx), [StatCard.jsx](client/src/components/analytics/StatCard.jsx), `.glass-card`, feature cards on Home.
- **Tables:** [BorrowTable.jsx](client/src/components/borrow/BorrowTable.jsx) renders a desktop `<table>` and a stacked mobile card variant in the same component (dual-render pattern).
- **Forms:** [BookForm.jsx](client/src/components/books/BookForm.jsx), Login/Register/OTP/Reset forms — all share `input-field`-like classes (`rounded-xl`, focus ring violet/50).
- **Modals:** [ConfirmModal.jsx](client/src/components/common/ConfirmModal.jsx), [QRScanner.jsx](client/src/components/books/QRScanner.jsx) — backdrop `bg-black/60 backdrop-blur-sm`, `glass-card` content, spring-in scale animation.

---

## 4. Components Breakdown

### 4.1 Reusable / Common — `client/src/components/common/`

| Component | Role |
|---|---|
| [Breadcrumbs.jsx](client/src/components/common/Breadcrumbs.jsx) | URL-segment breadcrumbs with label map + `Home` icon root |
| [ConfirmModal.jsx](client/src/components/common/ConfirmModal.jsx) | 3 variants (`danger` / `warning` / `info`), Framer motion in/out |
| [DashboardCard.jsx](client/src/components/common/DashboardCard.jsx) | Icon + label + count stat tile |
| [EmptyState.jsx](client/src/components/common/EmptyState.jsx) | Icon + title + description + CTA (Link or button) |
| [Loader.jsx](client/src/components/common/Loader.jsx) | Full-screen violet ring spinner |
| [PageSkeleton.jsx](client/src/components/common/PageSkeleton.jsx) | Variants: `default`, `dashboard`, `table`, `cards` — shimmer placeholders |
| [ProtectedRoute.jsx](client/src/components/common/ProtectedRoute.jsx) | Role-gated route wrapper |

### 4.2 Layout

`Navbar`, `Sidebar`, `Footer` (see §3).

### 4.3 Feature components

- **Books:** [BookCard](client/src/components/books/BookCard.jsx), [BookForm](client/src/components/books/BookForm.jsx), [BookList](client/src/components/books/BookList.jsx), [BookReviews](client/src/components/books/BookReviews.jsx), [QRScanner](client/src/components/books/QRScanner.jsx) (+ `BookQRCode`, `QRScannerFAB`), [RecommendedBooks](client/src/components/books/RecommendedBooks.jsx), [WaitlistButton](client/src/components/books/WaitlistButton.jsx).
- **Borrow:** [BorrowCard](client/src/components/borrow/BorrowCard.jsx), [BorrowTable](client/src/components/borrow/BorrowTable.jsx).
- **Analytics:** [ReadingHeatmap](client/src/components/analytics/ReadingHeatmap.jsx), [StatCard](client/src/components/analytics/StatCard.jsx).

### 4.4 Button / Input / Card primitives (CSS utility classes)

Defined in [App.css](client/src/App.css#L1-L60):

```css
.btn-primary   → gradient violet→indigo, rounded-xl, shadow-glow-sm
.btn-secondary → gray surface, subtle border (dark: white/5)
.card          → white / dark white/5 backdrop-blur-xl, rounded-2xl
.input-field   → rounded-xl, violet focus ring, dark: white/5 + backdrop-blur
.glass-card    → semi-opaque bg, blur(20px), soft shadow, 1.5rem radius
.gradient-text → violet → cyan text clip
```

Plus theme helpers: `.theme-text`, `.theme-text-muted`, `.theme-text-faint`, `.theme-bg-subtle`, `.theme-bg-hover`, `.theme-border`, `.theme-border-light`.

> ⚠️ Adoption of these primitives is **inconsistent** — many components inline the raw Tailwind rather than use `.btn-primary` / `.input-field` / `.card`, leading to drift (see §6).

---

## 5. Design System

### 5.1 Color palette

Defined in [tailwind.config.js](client/tailwind.config.js) and [index.css](client/src/index.css):

| Token | Value | Usage |
|---|---|---|
| `primary` (violet) | `#7C3AED` (DEFAULT), `#5B21B6` dark, `#A78BFA` light | Brand, CTAs, focus rings, nav accents |
| `accent` (cyan) | `#06B6D4`, `#22D3EE`, `#0891B2` | Secondary accent, gradient end, analytics |
| `--color-surface` (light) | `#f8fafc` → `#94a3b8` (100…400) | Page & card backgrounds |
| `--color-surface` (dark) | `#0B0F1A` → `#222D4D` (100…400) | Deep navy app shell |
| `--hero-gradient` light | `#f8fafc → #ede9fe → #f0f9ff` | Landing hero background |
| `--hero-gradient` dark | `#0B0F1A → #1A0B2E → #0B0F1A` | Landing hero background |

**Status colors** (used ad-hoc in cards/badges): `emerald`, `cyan`, `amber/yellow`, `red/rose`, `indigo`, each with a `/10` fill + `/20` border + `/400` text convention in dark mode. In light mode components frequently fall back to the legacy `bg-green-100 text-green-700` style (see [BorrowTable.jsx](client/src/components/borrow/BorrowTable.jsx#L17-L25)).

### 5.2 Theme & UI style

- **Primary theme:** Dark mode by default (`useState(saved === "dark" ? … : true)` in [ThemeContext.jsx](client/src/context/ThemeContext.jsx#L10)).
- **Visual style:** **Glassmorphism + soft glow + gradient accents** — a "modern SaaS dashboard" aesthetic.
  - Frosted panels via `backdrop-blur-xl`, translucent white/5 on dark, white on light.
  - Ambient glowing **blobs** (`animate-blob`, radial gradients) behind hero/auth screens.
  - Gradient CTAs (`from-violet-600 to-indigo-600`) with subtle `shadow-glow-sm` / `shadow-glow-violet`.
  - `gradient-text` for headline words.
- **Shape language:** Heavy use of `rounded-xl` (inputs, buttons) and `rounded-2xl` / `rounded-4xl` (cards, wrappers).
- **Elevation:** `shadow-sm` / `shadow-md` for cards; custom `shadow-glass`, `shadow-glow-violet`, `shadow-glow-cyan`, `shadow-glow-sm` in Tailwind config.

### 5.3 Typography

| Role | Family | Tailwind |
|---|---|---|
| Headings | **Space Grotesk** | `font-heading` |
| Body | **Inter** | `font-body` (default) |

- Scale: hero `text-4xl`→`text-7xl`, section `text-3xl`→`text-5xl`, page `text-2xl`, card titles `text-lg`/`text-xl`, body `text-sm`, micro `text-xs`.
- Tracking: `tracking-tight` on headings, `tracking-wider uppercase` on eyebrows/labels.
- Leading: `leading-[1.1]` on hero headlines; `leading-relaxed` on paragraph body.
- Color: `text-gray-900 dark:text-white` for primary; `text-gray-500 dark:text-gray-400` muted; `text-gray-400 dark:text-gray-500` faint.

### 5.4 Spacing & layout

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (consistent across pages).
- Section vertical padding: `py-24 lg:py-32` (marketing), `py-16` / `pt-8 pb-16` (app pages).
- Card internal padding: `p-6` standard, `p-8` for hero/welcome, `p-4 sm:p-6` mobile-first.
- Grid gaps: `gap-6` / `lg:gap-8` typical; stats use `gap-3 sm:gap-6`.

### 5.5 Motion & interactions

From [tailwind.config.js](client/tailwind.config.js#L51-L72):

- Keyframes: `float`, `glow-pulse`, `blob` (7 s drift).
- Framer Motion patterns: `whileHover={{ scale: 1.03-1.1 }}`, `whileTap={{ scale: 0.9-0.97 }}`, fade-slide-in-on-view via `useInView`, shared-layout nav underline (`layoutId`), modal spring scale, mobile drawer height.
- Page load: `Toaster` top-right, `PageSkeleton` shimmer fallback.

### 5.6 Responsive breakpoints

Custom scale (adds `xs`): `xs: 360`, `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536`.

Mobile-first rules in [index.css](client/src/index.css#L52-L73):

- Min tap target `44 × 44` (WCAG).
- Inputs forced to `font-size: 16px` (prevents iOS zoom).
- `scrollbar-hide` helper.
- `safe-top` / `safe-bottom` for foldables/notched devices.

---

## 6. UI/UX Issues

### 6.1 Consistency & system drift

1. **Two icon libraries used in parallel** — `lucide-react` (most components, Navbar, Sidebar, Home) and `react-icons/fi` ([BookCard](client/src/components/books/BookCard.jsx#L6), [StatCard](client/src/components/analytics/StatCard.jsx#L1)). Causes stroke-weight and visual-rhythm mismatch between sibling components.
2. **Design-system primitives are bypassed.** `.btn-primary`, `.input-field`, `.card`, `.glass-card` exist in [App.css](client/src/App.css), but buttons and inputs are re-declared inline in most pages (Navbar, Home, Login, Catalog, Footer newsletter). A single button style has ≥ 5 near-duplicate implementations.
3. **Button color drift.** Primary CTAs use `from-violet-600 to-indigo-600` (gradient), but [BookCard](client/src/components/books/BookCard.jsx#L92) uses flat `bg-indigo-600`; [BorrowTable](client/src/components/borrow/BorrowTable.jsx) uses flat `bg-green-600` / `bg-red-600`. Dashboard has yet a different set.
4. **Status-badge palette differs across components.** `BookCard`, `BorrowTable`, `AdminDashboard` recent-activity, and `StatCard` each encode "success/warning/error" slightly differently (hex families + border presence). No shared `<Badge variant="success|warning|danger|info" />` component.
5. **Category pill on `BookCard`** uses light-only `bg-indigo-50 text-indigo-700` with no dark-mode override — low contrast in dark theme.
6. **Sidebar is admin-only.** Members navigate via a crowded Navbar (Dashboard + Analytics + QR + Profile). At small desktop sizes this row wraps or hides labels.
7. **`Breadcrumbs` component is defined but never mounted** in any page (no import of `Breadcrumbs` in pages) → dead code and a missed navigation affordance on deep routes (`/admin/borrow-records`, `/books/:id`).
8. **Emoji in UI strings** (`Welcome back, {name}! 👋`, `📊 Analytics`, `📷 QR Scanner`). Renders inconsistently across platforms and clashes with the lucide icon set.

### 6.2 Accessibility

1. **Contrast:** `text-gray-500` on `bg-gray-50`/`#0F1629` borderline meets 4.5:1 at 14 px (footer copy, card subtitles). Faint `text-gray-400 dark:text-gray-500` fails AA on small text.
2. **Focus states:** Global focus outline is suppressed (`focus:outline-none`) and replaced only on inputs (`focus:ring-violet-500/50`). Buttons, nav links, and card links have **no visible keyboard focus ring** in most components.
3. **Modals** ([ConfirmModal](client/src/components/common/ConfirmModal.jsx), `QRScanner`) do not trap focus, do not restore focus on close, and lack `role="dialog"` + `aria-modal="true"` + labelled headings.
4. **Toast config** uses dark gray `#1f2937` regardless of theme — appears as a dark blob in light mode.
5. **Icon-only buttons** (theme toggle variant, mobile QR, social icons) rely on `title` attributes; some lack `aria-label`.
6. **Placeholder social/footer links** are `href="#"` — crawlers follow them and keyboard users land on nothing.
7. Animated blobs are purely decorative but not wrapped with `aria-hidden` / `pointer-events-none` in every occurrence.
8. No `prefers-reduced-motion` handling anywhere despite heavy motion (blobs, floats, scale hovers, page transitions).

### 6.3 Responsiveness / layout

1. **Fixed Navbar height spacer** (`h-16 lg:h-20`) — no `md` tier, so at 768–1023 px the fixed navbar measures `h-16` but the spacer still leaves extra whitespace under certain auth pages that set their own `min-h-screen`.
2. **Admin pages use `<Sidebar/>` inline inside `flex min-h-screen`** ([AdminDashboard.jsx](client/src/pages/admin/AdminDashboard.jsx#L65-L68)). Because the page also sits **below** the fixed navbar, at large zoom levels the sidebar is clipped at top. Sidebar should be part of a shared admin layout, not repeated in every page.
3. **Mobile Sidebar FAB** at `bottom-20 left-4` collides with the **QR Scanner FAB** on the member dashboard (admins don't see it, but comment in code acknowledges the risk). A unified FAB stack is missing.
4. **`BorrowTable`** renders both desktop table and mobile stacked cards in the same component — doubles DOM weight and is hard to keep in sync (two copies of action logic).
5. **Catalog grid** has no skeleton on pagination change (uses `Loader` globally instead of cell-level shimmer), causing layout shift.
6. Home hero uses `py-20 sm:py-32 lg:py-40` — on landscape mobile (< 500 h) content is cut; partial fix exists in CSS (`modal-landscape`) but not applied to hero.

### 6.4 Micro-interactions & feedback

1. **Form validation** is HTML-native only (`required`, `type="email"`). No inline error messages, no password-strength meter, no debounce feedback on search spinner (Catalog debounces 400 ms silently).
2. **Borrow actions** (Approve / Reject / Return) show toast only — no optimistic UI, no row-level loading state on the action buttons.
3. **Theme toggle** has no animated icon crossfade — instant swap.
4. **404 page** has one CTA (Back to Home) but no search or "popular links" recovery.
5. **Footer newsletter** button has no success/error feedback; `email` state is never submitted.
6. Lazy page transitions fall back to a full-page skeleton every navigation → flash effect. A route-level fade transition would feel smoother.

### 6.5 Repetition / code-smell

1. Duplicate gradient button markup (`from-violet-600 to-indigo-600 … rounded-xl … shadow-glow-sm`) appears in **≥ 15 files** — extract a `<Button variant="primary|secondary|ghost|danger" />` component.
2. Duplicate stat-card markup in [DashboardCard](client/src/components/common/DashboardCard.jsx), [StatCard](client/src/components/analytics/StatCard.jsx), and inline in [MemberDashboard](client/src/pages/member/MemberDashboard.jsx#L57-L72) — three near-identical implementations.
3. `GlowBlob` helper is defined locally inside [Home.jsx](client/src/pages/Home.jsx#L46-L48) but blob patterns appear in Login, Register, Catalog, etc. — hoist to `components/common/GlowBlob.jsx`.
4. `FadeInSection` is defined inline in `Home.jsx` only; other pages duplicate `initial/animate/transition` props on every motion element.
5. `Sidebar` is imported separately into every admin page (5 copies) instead of an `AdminLayout` route wrapper.

---

## 7. Improvement Suggestions

### 7.1 Architecture & layout

- **Introduce route-level layouts:**
  `<PublicLayout/>`, `<AuthLayout/>`, `<AdminLayout/>` (Sidebar + Breadcrumbs + Outlet), `<MemberLayout/>` (optional member sidebar). Remove `Sidebar` imports from individual pages.
- **Mount `<Breadcrumbs/>`** inside `AdminLayout`/`MemberLayout` — the component already exists and handles the label map.
- **Unified FAB dock** (bottom-right) that stacks QR Scanner, Sidebar open, and any future action — prevents overlap and respects `safe-bottom`.
- **Member sidebar:** Give members a lightweight left rail (Dashboard, My Books, Analytics, Profile) on `lg+` to declutter the navbar.
- **Collapsible admin sidebar** (icon-only mode) at `lg` breakpoint to free horizontal space on dashboards.

### 7.2 Design-system cleanup

- **Adopt a single icon library** — standardize on `lucide-react` and migrate `react-icons/fi` usages (`BookCard`, `StatCard`, `BookReviews`).
- **Extract primitives into components**, not just CSS:
  - `<Button variant size loading leftIcon rightIcon/>`
  - `<Input label error leftIcon .../>`
  - `<Card variant="default|glass|gradient"/>`
  - `<Badge tone="success|warning|danger|info|neutral"/>`
  - `<Modal/>` built on Radix UI or HeadlessUI (focus trap + a11y for free).
- **Tokenize status colors** in `tailwind.config.js`:
  ```js
  success: { 50,100,400,500,600 }, warning: {...}, danger: {...}, info: {...}
  ```
  Then badges/pills/buttons reference tokens, not raw tailwind families.
- **Standardize shadow scale:** one `shadow-card`, `shadow-card-hover`, `shadow-modal`, drop ad-hoc `shadow-sm`/`shadow-md`.

### 7.3 Modern UI trends worth applying

- **View transitions API** (`document.startViewTransition`) for route changes — smoother than full skeleton flashes on modern browsers.
- **Bento-grid dashboards** — mix stat tiles, mini-charts, and recent-activity cards in an asymmetric bento layout for `AdminDashboard` and `MemberDashboard`.
- **Command palette** (`⌘K`) — global search for books, members, actions. Using `cmdk` pairs well with the glass aesthetic.
- **Segmented control / filter chips** on `Catalog` (Category, Availability, Rating) instead of search-only.
- **Skeleton on every async boundary**, not full-screen only — `BookCard` skeleton during catalog pagination.
- **Empty states with illustration** (or at minimum animated lucide icon) — currently static.
- **Inline toasts in forms** for validation; use a schema lib (zod + react-hook-form) to replace the manual `useState` + HTML validation pattern.

### 7.4 Micro-interactions

- **Theme toggle:** animated Sun ↔ Moon morph (SVG transform) or Framer Motion `AnimatePresence` crossfade.
- **Button press ripple** or subtle `brightness(1.1)` on active — pair with existing `scale: 0.95`.
- **Card hover tilt** (slight rotateX/rotateY via Framer Motion `useMotionValue`) on feature cards and `BookCard`.
- **Count-up numbers** (already in `Home` stats) — reuse on `AdminDashboard`/`MemberDashboard` tiles.
- **`layoutId` for book covers:** animate from grid thumbnail → detail hero using Framer shared layout.
- **Toast theme-aware:** switch Toaster style via `useTheme()` so light mode gets a light surface.
- **Respect reduced motion:** wrap Framer animations with `const shouldReduce = useReducedMotion();` and bypass blob/float animations.

### 7.5 Color & theme polish

- **Light mode needs love.** The system is dark-first; light surfaces (`#f8fafc`) with translucent white cards lose their glass effect. In light mode, replace `backdrop-blur` glass with soft drop shadows + 1 px hairline borders for a cleaner "Notion/Linear" feel.
- **Introduce a true tertiary accent** (e.g., emerald or pink) for data-viz — analytics charts currently rely on violet/cyan only, which is hard to differentiate in multi-series charts.
- **Gradient fatigue:** the violet→indigo gradient appears on buttons, logos, nav underlines, modal variants, 404 text, footer buttons. Reserve gradients for the single most important CTA on a page; use flat `primary.DEFAULT` for secondary gradients.
- **Elevation-based surfaces:** use `surface-100 → surface-400` as documented (modal above card above page), rather than the current mix of `bg-surface-200` + `bg-white/5`.

### 7.6 Accessibility fixes (high ROI, low effort)

- Restore a consistent `focus-visible` ring across buttons/links (`focus-visible:ring-2 focus-visible:ring-violet-500/70 focus-visible:ring-offset-2`).
- Add `role="dialog" aria-modal="true" aria-labelledby` + focus trap on all modals.
- Add `aria-label` to every icon-only button; replace `title`-only buttons.
- Wrap decorative blobs with `aria-hidden="true" pointer-events-none`.
- Add `@media (prefers-reduced-motion: reduce)` overrides that disable `animate-blob`, `animate-float`, `animate-glow-pulse`.
- Remove placeholder `href="#"` links or guard with `onClick={e => e.preventDefault()}`.

### 7.7 Performance / polish

- Extract `FadeInSection`, `GlowBlob`, `CountUp` into `components/common/` to stop duplication and enable tree-shaking.
- Replace dual-render `BorrowTable` with one renderer driven by a `useMediaQuery` hook — halves DOM.
- Add `prefetch` on hover for lazy routes (e.g. `onMouseEnter={() => import('./pages/...' )}`).
- Virtualize long catalog/user lists (`react-window`) once datasets exceed ~100 rows.

---

### Quick-win checklist

- [ ] Consolidate icons to `lucide-react` only.
- [ ] Create `<Button/>`, `<Badge/>`, `<Card/>`, `<Modal/>` primitives; migrate 3 highest-traffic pages.
- [ ] Mount `<Breadcrumbs/>` inside admin/member layouts.
- [ ] Add global `focus-visible` ring + `prefers-reduced-motion` guard.
- [ ] Theme-aware `Toaster` styling.
- [ ] Replace placeholder `href="#"` footer/social links.
- [ ] Extract `GlowBlob` + `FadeInSection` to shared components.
- [ ] Tokenize status colors in `tailwind.config.js`.
- [ ] Add a light-mode override for `BookCard` category pill contrast.
- [ ] Introduce `AdminLayout` route to stop duplicating `<Sidebar/>`.

---

*Generated by UI/UX audit — based on the current state of `/client` source.*
