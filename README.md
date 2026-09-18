# WizeAgent Wizard

@asset:da_01m2fakb2jf3h8fyhscwanfeam:"AI Employee Onboarding Wizard" 

Initialize a pixel-perfect, scalable production setup for 'WizeAgent' (WhatsApp Sales & Support AI Onboarding Wizard) using React (TypeScript), Tailwind CSS, Lucide React icons, and Zustand for state management. 

Target Viewport: Desktop-focused layout (optimized for min-width 1280px screen sizes with a clean max-w-7xl centered container). 

### 1. FILE & COMPONENT ARCHITECTURE

Strictly create and adhere to the following file layout to isolate step components and prevent Git merge conflicts:

src/

├── types/

│   └── wizard.ts                 // Shared Data Types across all 7 steps

├── store/

│   └── useWizardStore.ts         // Zustand state for step data & navigation

├── components/

│   ├── common/

│   │   ├── TopNavbar.tsx         // Fixed Header with WizeAgent branding & nav buttons

│   │   ├── StepProgressStepper.tsx // Horizontal 7-step progress bar (0% - 100%)

│   │   └── AIEmployeeSummary.tsx  // Persistent Right-side Summary panel (reads live Zustand store)

│   └── wizard/

│       ├── Step1Business.tsx     // Fully implemented Step 1 form (Business Name, Category, Description)

│       ├── Step2WhatsApp.tsx     // Placeholder component for Step 2

│       ├── Step3Knowledge.tsx    // Placeholder component for Step 3

│       ├── Step4Products.tsx     // Placeholder component for Step 4

│       ├── Step5Configure.tsx    // Placeholder component for Step 5

│       ├── Step6Test.tsx         // Placeholder component for Step 6

│       └── Step7Activate.tsx     // Placeholder component for Step 7

└── pages/

    └── Index.tsx                 // Master OnboardingLayout binding Header, Stepper, Content, & Sidebar

### 2. ZUSTAND SHARED STATE (`src/store/useWizardStore.ts`)

Create a central store that manages step transitions and persistent data:

- `currentStep`: number (defaults to 1, range 1-7)

- `businessName`: string (default: "Urban Wear")

- `businessCategory`: string (default: "Fashion & Apparel")

- `businessDescription`: string

- `isWhatsappConnected`: boolean (default: false)

- `toneOfVoice`: string (default: "Friendly")

- `languages`: string[] (default: ["English", "Urdu", "Roman Urdu"])

- `humanHandoffConditions`: number (default: 4)

- `neverGuessPolicy`: string (default: "Active (Strict Safe)")

- Actions: `setCurrentStep(step)`, `updateWizardData(partialData)`

### 3. EXACT PIXEL-PERFECT VISUAL DESIGN TOKENS

Match the provided Figma design export with absolute precision:

- Primary Brand Green: `#059669` (Tailwind `emerald-600` / `#00A86B` for primary buttons, active badges, and active progress line).

- Background Canvas: `#F9FAFB` (Tailwind `gray-50`).

- Card Surfaces: Pure White `#FFFFFF` with soft borders (`border border-gray-200`) and rounded corners (`rounded-xl` / `16px`).

- Top Stepper Progress Bar: 

  - Displays all 7 tabs: 1. Business, 2. WhatsApp, 3. Knowledge, 4. Products, 5. Configure, 6. Test, 7. Activate.

  - Active step shows green bottom accent bar and green step badge. Completed steps display a green checkmark icon.

- Right Sidebar ('AI Employee Summary'):

  - Fixed-width panel (4 columns in a 12-column grid setup).

  - Shows '80% Ready' green pill badge, Urban Wear icon box, and dynamic key-value rows reading directly from `useWizardStore`.

  - Bottom card highlights 'Meta Official Cloud API: Secure, verified connection' with light green background tint (`bg-emerald-50/50`).

### 4. STEP 1 CONTENT IMPLEMENTATION (`Step1Business.tsx`)

Render the exact form inputs shown in the Step 1 design:

- Header: 'STEP 1 OF 7 • Business Foundation' with main title "Let's set up your business".

- Input 1: BUSINESS NAME * (Input field pre-filled with state `businessName`).

- Input 2: BUSINESS CATEGORY * (Select dropdown pre-filled with state `businessCategory`).

- Input 3: BUSINESS DESCRIPTION (Textarea with placeholder 'Tell us what your business sells or what services you provide.').

- Inspiration Box: Gray box featuring 'Auto-fill Urban Wear' clickable action.

- Footer Action: Green primary button "Continue ->" that triggers `setCurrentStep(2)`.

Build the layout shell, Zustand store, and complete Step 1 UI cleanly using modular components.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d6a5305a-34d1-4fc7-94c5-7afc77f1076f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
