
# CogSymb — Tenant Screening Platform Prototype

A complete front-end-only SaaS demo built on **React 18 + Vite + React Router + TypeScript + Tailwind + shadcn/ui + lucide-react**. All state is in-memory via React Context with rich seeded mock data.

## Design System
- **Palette**: Dark navy backgrounds (`#0A1628` / `#0F1E36`), vivid cyan primary (`#06B6D4`), teal secondary accents, white/slate text. Configured as HSL tokens in `index.css` + `tailwind.config.ts`.
- **Type**: Inter (Google Fonts), tight tracking on headings.
- **Motion**: Subtle fade-in/scale-in on route transitions, animated SVG circular gauges, hover lifts on cards.
- **Layout language**: Generous whitespace, 1-px hairline borders in cyan-on-navy, glassy card surfaces.

## Routes & Features

### 1. Landing Page (`/`)
- Sticky transparent nav (logo, Features, Pricing, Sign in, **Request Demo**)
- Hero: bold headline ("The Rental Credit Score that actually predicts payment"), gradient cyan glow, animated mini-gauge mockup, CTA buttons
- Stats strip (59M credit-invisible adults, X% default reduction, etc.)
- 3-column value props (Biometric ID, Verified Income, Real Rent History) with lucide icons
- "How it works" 4-step horizontal flow
- Comparison table: Traditional credit report vs CogSymb
- Logo cloud (mock property mgmt firms)
- Testimonials carousel
- Footer

### 2. Auth (`/login`, `/signup`, `/request-demo`)
- Split-screen: left form, right navy panel with rotating value-prop quote
- Any email/password works → 1.2s skeleton loader → toast "Welcome back" → `/dashboard`
- "Request Demo" form captures name/company/units → success state

### 3. App Shell (authenticated)
- Left sidebar: Dashboard, Applicants, Invites, Reports, Settings (collapsible)
- Top bar: global search, notification bell with dropdown of mock alerts (new applicant, score ready, payment verified), user avatar menu (Profile, Billing, Sign out)

### 4. Command Center Dashboard (`/dashboard`)
- 4 KPI cards: Total Screenings, Approval Rate, Pending Invites, Avg. Rental Score (with sparklines & delta vs last month)
- Two charts: Screenings over time (area chart), Score distribution (bar chart) — recharts
- Recent Activity feed (timeline of approvals, invites sent, reports completed)
- "Top risk alerts" mini-list

### 5. Applicants Table (`/applicants`)
- Powerful data table: search, multi-filter (status, score range, property), sortable columns, pagination, row selection, bulk actions
- Columns: Avatar+Name, Property/Unit, Rental Score (mini gauge), Income Verified ✓, Status badge (Approved=cyan, Denied=red, Pending=slate, Credit-Invisible=teal outline), Submitted date, ⋮ actions
- Click row → applicant report
- Top-right: **+ Invite Applicant** button

### 6. Invite & Onboarding Flow (Slide-over)
- 3-step wizard: (1) Applicant info — name, email, phone (2) Property & unit + lease terms (3) Screening package selection + review
- Submit → simulated send (progress bar) → applicant added as "Pending" in global state → toast + new notification + activity log entry

### 7. Detailed Applicant Report (`/applicants/:id`)
- **Left (2/3)**: 
  - Header with name, contact, property
  - Tabs: Overview, Identity, Income, Rental History, Credit, Documents
  - 4 fintech info-boxes (Identity Verification, Verified Income, Rental Payment History, Traditional Credit) each with sub-metrics, status icons, expand-for-detail
  - Rental payment timeline (24 months, on-time/late visualization)
  - Income breakdown (employer, monthly, rent-to-income ratio with progress bar)
  - Document checklist
- **Right sticky (1/3)**:
  - Profile card with avatar
  - Large animated SVG circular Rental Credit Score gauge (0–900) with grade label
  - Quick stats (Monthly income, Rent ratio, Months of history)
  - **Approve / Deny** action buttons → confirmation dialog → state update → success toast → back to dashboard
  - "Request more info" secondary action

### 8. Settings (`/settings`)
- Tabs: **Profile** (avatar, name, email, password), **Billing** (current plan card, usage meter, invoices table, payment method), **Screening Criteria** (toggles: Strict Income Verification, Require Biometric ID, Min Rental Score threshold slider, Auto-deny below threshold), **Team** (mock teammates list), **Notifications** (channel toggles)
- All toggles persist in context for the session

## Mock Data (seeded in context)
- ~18 applicants across edge cases: high-score professionals, **credit-invisible with perfect rental history**, risky low-score, pending biometric, denied-with-reason, foreign nationals, students with co-signers
- 12 notifications, 25 activity log entries, 3 mock teammates, billing invoices, 6 properties

## Global State
- `AppContext` (React Context + useReducer): applicants, notifications, activity, settings, currentUser
- `AuthContext`: mock session (in-memory), `signIn` / `signOut`
- All mutations (invite, approve, deny, toggle setting) flow through reducer actions and trigger toasts + notifications

## Components to build
- `RentalScoreGauge` (animated SVG, configurable size)
- `StatusBadge`, `KpiCard`, `InfoBox`, `Sparkline`
- `ApplicantsTable` with full filter/sort/paginate
- `InviteSlideOver` (3-step wizard)
- `NotificationBell`, `UserMenu`, `Sidebar`, `Topbar`
- `ConfirmDialog`, page-level skeletons

Single pass — full demo delivered ready to click through end-to-end.
