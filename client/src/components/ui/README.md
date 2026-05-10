# 🎨 Smart Library — Design System

A scalable, token-driven UI foundation for the Smart Library Management System.
Built on **React + TailwindCSS + lucide-react**. Zero external component libraries.

Location: [`client/src/components/ui/`](./)

```
client/src/components/ui/
├── Button.jsx          ← primary · secondary · ghost · danger
├── Card.jsx            ← default · glass · elevated (+ Header/Title/Description/Footer)
├── Badge.jsx           ← success · warning · danger · info · neutral
├── Input.jsx           ← label · hint · error · password reveal · icons
├── cn.js               ← className merger utility
├── index.js            ← barrel export
├── tailwind.preset.js  ← design tokens (colors, radii, shadows, type scale)
└── DesignSystemShowcase.jsx  ← live gallery
```

---

## 1. Design tokens

### 1.1 Colors

| Role       | Token           | Hex       | Usage                                 |
| ---------- | --------------- | --------- | ------------------------------------- |
| Primary    | `primary.500`   | `#8B5CF6` | Brand, primary CTA, focus ring, links |
| Secondary  | `secondary.500` | `#22C55E` | Success, confirm, positive metrics    |
| Accent     | `accent.500`    | `#F59E0B` | Warnings, highlights, due-soon        |
| Danger     | `danger.500`    | `#EF4444` | Destructive actions, errors           |
| Background | `background`    | `#F1F5F9` | Page background (light)               |
| Surface    | `surface.200`   | `#FFFFFF` | Card / panel surface (light)          |
| Surface 900 | `surface.900`  | `#0F172A` | Page background (dark)                |

Each brand color ships a full **50 → 900** ramp for states (hover 600, active 700, soft fills 50/100).

### 1.2 Border radius — 16 / 20 / 24 px

| Token   | Value | Use                                   |
| ------- | ----- | ------------------------------------- |
| `xl`    | 16 px | Inputs, compact pills                 |
| `2xl`   | 20 px | Buttons, small cards                  |
| `3xl`   | 24 px | Cards (default), modals               |
| `4xl`   | 32 px | Feature/hero surfaces                 |
| full    | 9999  | Badges, avatars, icon buttons         |

### 1.3 Shadows

| Token           | Purpose                    |
| --------------- | -------------------------- |
| `shadow-card`   | Card default elevation     |
| `shadow-elevated` | Hover lift, `elevated` card |
| `shadow-modal`  | Dialogs, popovers          |
| `shadow-glow-primary` | Primary CTA accent glow (hero only) |
| `shadow-glow-accent`  | Attention highlight         |

### 1.4 Typography

- **Headings:** `Space Grotesk`, bold, tight tracking → class `font-heading`.
- **Body:** `Inter`, 400/500, comfortable leading → default (`font-body`).
- Type scale tokens: `text-display-lg`, `text-display`, `text-h1` → `text-h4`, plus Tailwind's `text-sm`/`text-xs` for UI copy.

```html
<h1 class="font-heading text-display text-gray-900">Smart Library</h1>
<p  class="text-base text-gray-600">Track, borrow, and discover.</p>
```

### 1.5 Spacing

Follows Tailwind's 4-pt scale. Component standards:

- Card padding: `p-6` (md) default, `p-4` compact, `p-8` spacious.
- Section vertical rhythm: `py-16` (page), `py-24` (marketing).
- Form field gap: `space-y-5`.

---

## 2. Component API

### 2.1 `<Button />`

```jsx
import { Button } from "@/components/ui";
import { Plus, ArrowRight } from "lucide-react";

<Button variant="primary" size="md" leftIcon={Plus}>Add Book</Button>
<Button variant="secondary" rightIcon={ArrowRight}>Continue</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger" loading>Deleting</Button>
```

| Prop       | Type                                                | Default     |
| ---------- | --------------------------------------------------- | ----------- |
| `variant`  | `"primary" \| "secondary" \| "ghost" \| "danger"` | `"primary"` |
| `size`     | `"sm" \| "md" \| "lg"`                             | `"md"`      |
| `leftIcon` / `rightIcon` | lucide icon component               | —           |
| `loading`  | `boolean`                                           | `false`     |
| `fullWidth`| `boolean`                                           | `false`     |
| `as`       | Element / Component (e.g. `Link`)                   | `"button"`  |

### 2.2 `<Card />`

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge, Button } from "@/components/ui";
import { BookOpen } from "lucide-react";

<Card variant="default" padding="md">
  <CardHeader>
    <div className="p-2.5 rounded-xl bg-primary-100 text-primary-600">
      <BookOpen className="h-5 w-5" />
    </div>
    <Badge tone="success" size="sm">Available</Badge>
  </CardHeader>
  <CardTitle>Atomic Habits</CardTitle>
  <CardDescription>by James Clear · Self-help</CardDescription>
  <CardFooter>
    <Button fullWidth>Borrow</Button>
  </CardFooter>
</Card>
```

| Variant    | Look                                                         |
| ---------- | ------------------------------------------------------------ |
| `default`  | Solid surface + hairline border + `shadow-card`              |
| `glass`    | Translucent + `backdrop-blur-xl` (overlay on gradients/hero) |
| `elevated` | Raised `shadow-elevated`, borderless                         |

Set `interactive` to add hover lift + cursor affordance.

### 2.3 `<Badge />`

```jsx
<Badge tone="success">Available</Badge>
<Badge tone="warning" dot>Due soon</Badge>
<Badge tone="danger">Overdue</Badge>
<Badge tone="info" size="sm">New</Badge>
```

Tones: `success` · `warning` · `danger` · `info` · `neutral`. Default icon comes from lucide (`CheckCircle2`, `AlertTriangle`, `XCircle`, `Info`). Pass `dot` to replace the icon with a colored dot, or `icon={false}` for text-only.

### 2.4 `<Input />`

```jsx
import { Input } from "@/components/ui";
import { Mail, Search } from "lucide-react";

<Input label="Email" type="email" leftIcon={Mail} placeholder="you@library.com" />

<Input label="Password" type="password" hint="Min. 8 characters" />

<Input
  label="Search"
  leftIcon={Search}
  error="No books match that query"
/>
```

- Auto-generates `id` and links `<label>` + `aria-describedby`.
- `type="password"` renders an accessible reveal toggle.
- Error state flips the border to `danger.500`, adds `AlertCircle` + `role="alert"`.

---

## 3. Tailwind config

Two integration paths:

### Option A — Drop-in (recommended for new projects)

```js
// tailwind.config.js
import { designSystemExtend } from "./src/components/ui/tailwind.preset";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: { extend: designSystemExtend },
  plugins: [],
};
```

### Option B — Merge into existing config

In [client/tailwind.config.js](../../../tailwind.config.js), add the key pieces:

```js
import { designSystemExtend } from "./src/components/ui/tailwind.preset";

export default {
  // ...existing config
  theme: {
    // ...existing screens
    extend: {
      ...designSystemExtend,
      // keep any project-specific extensions after the spread
    },
  },
};
```

Then load the two fonts in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

And set the defaults in `index.css`:

```css
body {
  @apply font-body bg-background text-gray-800;
}
.dark body {
  @apply bg-surface-900 text-gray-100;
}
```

---

## 4. Example UI usage — Book card composition

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge, Button } from "@/components/ui";
import { BookOpen, Bookmark } from "lucide-react";

export function BookTile({ book, onBorrow }) {
  const isAvailable = book.availableCopies > 0;
  return (
    <Card variant="default" interactive>
      <CardHeader>
        <div className="p-2.5 rounded-xl bg-primary-100 text-primary-600">
          <BookOpen className="h-5 w-5" />
        </div>
        {isAvailable
          ? <Badge tone="success" size="sm">Available</Badge>
          : <Badge tone="danger"  size="sm">Borrowed</Badge>}
      </CardHeader>

      <CardTitle>{book.title}</CardTitle>
      <CardDescription>by {book.author} · {book.category}</CardDescription>

      <CardFooter>
        <Button
          variant={isAvailable ? "primary" : "ghost"}
          disabled={!isAvailable}
          onClick={onBorrow}
          leftIcon={Bookmark}
          fullWidth
        >
          {isAvailable ? "Borrow" : "Join waitlist"}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 5. Live showcase

Mount the gallery at a dev-only route to visually verify tokens + primitives:

```jsx
// App.jsx (dev only)
import DesignSystemShowcase from "./components/ui/DesignSystemShowcase";
// <Route path="/_ds" element={<DesignSystemShowcase />} />
```

---

## 6. Principles

1. **Tokens over ad-hoc classes.** Components never hardcode hex values; they reach through the Tailwind token ramp.
2. **One icon library** — `lucide-react` only.
3. **Accessible by default** — visible focus rings, `aria-invalid`/`aria-describedby` on inputs, icon-only buttons require `aria-label`, respects `motion-safe` / `motion-reduce`.
4. **Composable** — primitives stay small; compose via `Card` sub-parts rather than monolithic props.
5. **Theme-aware** — every component handles light and dark through `dark:` variants on the token ramp.
