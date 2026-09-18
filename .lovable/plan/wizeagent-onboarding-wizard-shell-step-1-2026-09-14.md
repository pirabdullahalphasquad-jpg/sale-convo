# WizeAgent — Onboarding Wizard Shell + Step 1

Build the desktop onboarding wizard from the Figma export: fixed top bar, 7-step progress stepper, a fully working Step 1 form, placeholder screens for steps 2-7, and a live summary panel on the right that updates as you type.

## What you'll see

- A light gray canvas with a white top bar: WizeAgent logo tile, "AI EMPLOYEE" tag, "WhatsApp Sales & Support" subtitle, breadcrumb "Onboarding / Step 1 of 7", and right-side buttons (Product Story, Setup Wizard, Need help?).
- A progress card listing all seven steps — Business, WhatsApp, Knowledge, Products, Configure, Test, Activate — with a green accent bar under the current step, checkmarks on completed steps, and a "% completed" readout.
- Step 1 "Let's set up your business": business name (pre-filled "Urban Wear"), business category dropdown, description textarea, an inspiration strip with an "Auto-fill Urban Wear" action, and a green "Continue" button that advances to Step 2.
- Steps 2-7 render a clean titled placeholder card with Back/Continue so navigation is testable end to end.
- Right-hand "AI Employee Summary" panel: 80% Ready pill, Urban Wear Assistant tile, key-value rows (business, WhatsApp channel, FAQs, catalog, tone, languages, handoff, never-guess policy) that reflect the live form values, plus the green-tinted Meta Official Cloud API note.

## Technical notes

- Add `zustand`. Files as specified: `src/types/wizard.ts`, `src/store/useWizardStore.ts`, `src/components/common/{TopNavbar,StepProgressStepper,AIEmployeeSummary}.tsx`, `src/components/wizard/Step1Business.tsx` … `Step7Activate.tsx`.
- This project routes with TanStack Router (no `src/pages`). The master layout lives in `src/routes/index.tsx`, which composes navbar + stepper + a 12-column grid (8 cols content / 4 cols summary) inside `max-w-7xl`, and switches the step component off `currentStep`. Route `head()` gets a WizeAgent-specific title/description/og/twitter.
- Store: `currentStep`, `businessName` ("Urban Wear"), `businessCategory` ("Fashion & Apparel"), `businessDescription`, `isWhatsappConnected` (false), `toneOfVoice` ("Friendly"), `languages` (English, Urdu, Roman Urdu), `humanHandoffConditions` (4), `neverGuessPolicy` ("Active (Strict Safe)"), plus `knowledgeArticles` and `catalogProducts` counts for the summary rows; actions `setCurrentStep`, `updateWizardData`.
- Design tokens go into `src/styles.css` as semantic variables (brand green `#059669`, canvas `#F9FAFB`, white card surfaces, `border-slate-200`, `rounded-xl`, Inter via a `<link>` in `__root.tsx`). Components use token utilities, no hardcoded hex in JSX.
- Icons come from `lucide-react` (Bot, Building2, Phone, BookOpen, Package, SlidersHorizontal, MessageSquare, Rocket, ShieldCheck, Sparkles, ArrowRight, Check) rather than the exported PNG icon files, which are flat raster stand-ins for these same glyphs.
- Fully typed with TypeScript; the Figma export file itself is used as visual reference, not copied in.
