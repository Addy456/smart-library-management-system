import { useState } from "react";
import {
  BookOpen,
  Search,
  Mail,
  User,
  Plus,
  Trash2,
  ArrowRight,
  Download,
} from "lucide-react";
import {
  Button,
  Badge,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./index";

/**
 * DesignSystemShowcase
 *
 * Live gallery of every primitive in the Smart Library design system.
 * Mount at a dev-only route (e.g. /_ds) to review tokens visually.
 *
 *   <Route path="/_ds" element={<DesignSystemShowcase />} />
 */
export default function DesignSystemShowcase() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bad, setBad] = useState("not-an-email");

  return (
    <div className="min-h-screen bg-background dark:bg-surface-900 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Smart Library
          </p>
          <h1 className="font-heading text-h1 text-gray-900 dark:text-white mt-2">
            Design System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-prose">
            Reusable primitives — Button, Card, Badge, Input — built on a shared
            token set (colors, radii, shadows, typography).
          </p>
        </header>

        {/* ─── BUTTONS ─── */}
        <Section title="Buttons" subtitle="variants · sizes · states">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" leftIcon={Plus}>New Book</Button>
            <Button variant="secondary" leftIcon={Download}>Export</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger" leftIcon={Trash2}>Delete</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg" rightIcon={ArrowRight}>Large</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <Button fullWidth variant="primary" rightIcon={ArrowRight}>
              Full width
            </Button>
          </div>
        </Section>

        {/* ─── BADGES ─── */}
        <Section title="Badges" subtitle="tones · dot · sizes">
          <div className="flex flex-wrap gap-2">
            <Badge tone="success">Available</Badge>
            <Badge tone="warning">Due soon</Badge>
            <Badge tone="danger">Overdue</Badge>
            <Badge tone="info">New</Badge>
            <Badge tone="neutral">Archived</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge tone="success" dot>Returned</Badge>
            <Badge tone="warning" dot>Pending</Badge>
            <Badge tone="danger" dot>Rejected</Badge>
            <Badge tone="info" dot size="sm">Beta</Badge>
          </div>
        </Section>

        {/* ─── INPUTS ─── */}
        <Section title="Inputs" subtitle="label · hint · error · icons · password">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Search catalog"
              placeholder="Title, author, ISBN…"
              leftIcon={Search}
              hint="Press / to focus from anywhere"
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@library.com"
              leftIcon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="Min. 8 characters"
            />
            <Input
              label="Member email"
              leftIcon={User}
              value={bad}
              onChange={(e) => setBad(e.target.value)}
              error="Please enter a valid email address"
            />
          </div>
        </Section>

        {/* ─── CARDS ─── */}
        <Section title="Cards" subtitle="default · glass · elevated · interactive">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <div className="p-2.5 rounded-xl bg-primary-100 text-primary-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Badge tone="success" size="sm">Available</Badge>
              </CardHeader>
              <CardTitle>Atomic Habits</CardTitle>
              <CardDescription>by James Clear · Self-help</CardDescription>
              <CardFooter>
                <Button size="sm" variant="primary" fullWidth>
                  Borrow
                </Button>
              </CardFooter>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <div className="p-2.5 rounded-xl bg-accent-100 text-accent-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Badge tone="warning" size="sm">Due soon</Badge>
              </CardHeader>
              <CardTitle>Deep Work</CardTitle>
              <CardDescription>by Cal Newport · Productivity</CardDescription>
              <CardFooter>
                <Button size="sm" variant="secondary" fullWidth>
                  Return
                </Button>
              </CardFooter>
            </Card>

            <Card variant="elevated" interactive>
              <CardHeader>
                <div className="p-2.5 rounded-xl bg-secondary-100 text-secondary-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Badge tone="info" size="sm">New</Badge>
              </CardHeader>
              <CardTitle>The Pragmatic Programmer</CardTitle>
              <CardDescription>by Hunt & Thomas · Engineering</CardDescription>
              <CardFooter>
                <Button size="sm" variant="ghost" rightIcon={ArrowRight}>
                  Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* ─── COLOR TOKENS ─── */}
        <Section title="Color tokens">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Swatch name="Primary 500" cls="bg-primary-500" hex="#8B5CF6" />
            <Swatch name="Secondary 500" cls="bg-secondary-500" hex="#22C55E" />
            <Swatch name="Accent 500" cls="bg-accent-500" hex="#F59E0B" />
            <Swatch name="Background" cls="bg-background border" hex="#F1F5F9" />
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ─── helpers ─── */

function Section({ title, subtitle, children }) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="font-heading text-h3 text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, cls, hex }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
      <div className={`h-16 ${cls}`} />
      <div className="px-3 py-2 bg-white dark:bg-surface-200">
        <p className="text-xs font-semibold text-gray-900 dark:text-white">{name}</p>
        <p className="text-[11px] text-gray-500 font-mono">{hex}</p>
      </div>
    </div>
  );
}
