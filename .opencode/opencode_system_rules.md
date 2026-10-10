# OpenCode Rules: High-Performance & High-Conversion Professional Landing Pages

This rule set governs OpenCode when building, editing, or optimizing landing pages. It builds upon the **ui-ux-pro-max-skill** guidelines to ensure all generated web applications achieve elite UI/UX standards, rapid Core Web Vitals performance, conversion-focused layout hierarchy, micro-interactions, and seamless data persistence via Supabase.

## 1. CORE ARCHITECTURE & TECH STACK

* **Framework:** Next.js (App Router, React 19 / Modern Server Components pattern).
* **Styling:** Tailwind CSS + `clsx` / `tailwind-merge` for class compositions.
* **Component Primitives:** Shadcn/ui & Radix UI primitives.
* **Icons:** Lucide React (vectorial, scalable, minimal bundle size).
* **Animations:** Framer Motion (use GPU-accelerated properties: `opacity`, `transform`).
* **Backend & Database:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
* **Forms & Validation:** React Hook Form + Zod schema validation.
* **Type Safety:** Strict TypeScript (no `any` type casting).

## 2. DESIGN SYSTEM & ESTHETIC RULES (ui-ux-pro-max Integration)

### Anti-Generic AI Aesthetic Protocol

* **NEVER** default to generic indigo-purple gradients on dark backgrounds unless explicitly requested.
* Select an intentional style category based on the product domain:
  * **SaaS / B2B:** Clean Minimalist, Neo-Brutalism (subtle), or Slate Corporate.
  * **Fintech / Security:** High-Contrast Dark, Glassmorphism (subtle), Deep Emerald/Navy tones.
  * **Consumer / E-Commerce:** Vibrant Modern, Warm Organic, or High-Density Tech.

### Typography & Spacing

* Use responsive font sizing with fluid typography scaling (`clamp()` or Tailwind fluid sizes).
* Maintain strict visual hierarchy: `h1` (Hero) > `h2` (Section Titles) > `h3` (Cards/Sub-features) > `p` (Body).
* Follow a consistent 8pt grid system for padding/margins (`p-4`, `p-6`, `p-8`, `p-12`, `p-16`, `p-24`).

### Color Hierarchy

* **Primary Color:** Reserved strictly for primary Call-to-Actions (CTAs) and focal elements.
* **Background & Neutral Shades:** 60-30-10 Rule (60% dominant neutral background, 30% structural/card neutral, 10% accent/CTA).
* **Accessibility:** Ensure all text/background combinations meet WCAG AA standards (minimum contrast ratio 4.5:1).

## 3. SUPABASE PERSISTENCE & DATA PIPELINE RULES

All interactive elements that collect data (waitlists, contact forms, newsletter signups, lead magnets, trial signups) **MUST** save directly to Supabase with full type safety and error handling.

### Client & Server Setup Standard

* Use `@supabase/ssr` to maintain separate Supabase client instances for Server Components/Actions and Client Components.
* Never expose the `SUPABASE_SERVICE_ROLE_KEY` in client-side code. Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client interactions.

### Data Capture Workflow

1. **Zod Validation:** Validate all form fields on both client and server before triggering a Supabase write.
2. **Server Actions First:** Perform database writes via Next.js Server Actions using modern `useActionState` or `startTransition` to prevent layout reflows and handle pending states gracefully.
3. **Database Schema Standard (Leads & Signups):**
   * Tables must use UUIDs as primary keys (`id uuid default gen_random_uuid() primary key`).
   * Include standard audit columns: `created_at timestamptz default now()`, `status text default 'pending'`, `source text`.
   * Enable Row Level Security (RLS) on **all** tables by default (`ALTER TABLE leads ENABLE ROW LEVEL SECURITY;`).
   * For public landing page submissions, create an explicit INSERT policy for the `anon` role:
     ```sql
     CREATE POLICY "Allow public insert to leads" 
     ON public.leads FOR INSERT 
     TO anon WITH CHECK (true);
     ```

### User Feedback & UX States

* Form components must handle 4 explicit UI states: **Idle**, **Loading / Submitting**, **Success (With confetti or custom visual feedback)**, and **Error (Toast or inline alert)**.
* Prevent double submissions by disabling buttons during pending transitions.

## 4. CONVERSION-ORIENTED HIERARCHY (CRO ENGINE)

Every landing page created by OpenCode must strictly follow a high-converting section sequence:

1. **Hero Section:**
   * Clear Value Proposition (H1 + Subtitle).
   * High-contrast Primary CTA + Lead Capture Form or Action Button.
   * Trust Signal / Micro-proof immediately below the CTA (e.g., "No credit card required • 14-day trial").
   * Product Preview Graphic / Interactive Mockup / Hero Video.
2. **Social Proof (Logo Cloud / Metrics):**
   * Marquee or grid of trusted company logos or quantifiable metrics (e.g., "10k+ active users").
3. **Core Value Propositions (3-4 Key Benefits):**
   * Feature grid with custom micro-animations and contextual icons.
4. **Interactive Product Demo / Deep Dive:**
   * Tabs, interactive preview, or step-by-step workflow.
5. **Testimonials / Social Proof Wall:**
   * Verified user feedback with avatars, names, roles, and star ratings.
6. **Pricing / Value Tiers:**
   * Clear toggle (Monthly/Yearly with discount badge).
   * Recommended/Popular plan highlighted visually.
7. **FAQ Section (Accordion format):**
   * Address top buying objections directly.
8. **Final Lead Capture / CTA Banner:**
   * High-conversion capture box wired directly to the Supabase leads table.
9. **Footer:**
   * Legal links, navigation, copyright, and subtle branding.

## 5. ANIMATION & MICRO-INTERACTION RULES

* **Performance First:** Only animate `transform` (`scale`, `translate`, `rotate`) and `opacity`. Never animate layout-triggering properties (`width`, `height`, `margin`, `top`).
* **Framer Motion Patterns:**
  * **Scroll Reveal:** Smooth `fade-in` + `slide-up` (y: 20 to y: 0) on viewport entry with `once: true`.
  * **Hover Effects:** Subtle card elevation (`whileHover={{ y: -4 }}`) and CTA glow transitions.
  * **Staggered Children:** Animate feature cards sequentially (`staggerChildren: 0.1`).
  * **Spring Physics:** Use natural spring configurations (`stiffness: 300, damping: 20`).
* **Reduced Motion:** Always support `prefers-reduced-motion` for accessibility compliance.

## 6. HIGH-SPEED PERFORMANCE & CORE WEB VITALS

* **Images:** Always use `next/image` with explicit `width`/`height` or `fill` with appropriate `sizes`. Specify `priority` for the Hero image.
* **Fonts:** Use `next/font` with `display: 'swap'` to eliminate layout shifts (CLS).
* **Code Splitting:** Dynamic imports (`next/dynamic`) for heavy below-the-fold interactive components or heavy libraries.
* **Server Components:** Default to React Server Components (RSC). Isolate Client Components (`'use client'`) to the smallest interactive subtree possible.

## 7. OPENCODE EXECUTION & QUALITY CHECKLIST

Before outputting code, OpenCode must internally verify:

* [ ] Is all persistent form data correctly schema-validated with Zod and routed to Supabase?
* [ ] Are Supabase environment variables defined cleanly in `.env.example`?
* [ ] Is Row Level Security (RLS) configured for database tables?
* [ ] Is the landing page fully responsive across Mobile (<640px), Tablet (<1024px), and Desktop (>1024px)?
* [ ] Does the page load fast without layout shifts (CLS = 0)?
* [ ] Is the CTA hierarchy visually obvious within 3 seconds of viewing?
* [ ] Are form loading, error, and success states completely rendered with micro-interactions?
* [ ] Is the HTML semantic (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)?