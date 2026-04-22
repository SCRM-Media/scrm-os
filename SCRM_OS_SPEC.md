# SCRM OS — v1 Rebuild Specification

**Owner:** Giuliano Cammarano (Founder, SCRM Media)
**Audience:** Claude Code (primary), Giuliano (reviewer)
**Status:** v1.0 spec, ready for build
**Target timeline:** Start now, re-evaluate end of Week 1

---

## 0. Purpose of this document

This is the single source of truth for rebuilding SCRM OS off Base44 and onto a modern stack owned by the team. SCRM OS is an internal operations app for SCRM Media, an Australian automotive media and marketing company serving 16+ active car dealerships.

The existing Base44 version works but is running into architectural ceilings. This rebuild preserves feature parity while giving the team full code ownership, better performance ceilings, and a foundation that scales.

**Claude Code must read this entire document before writing any code.** Do not skip sections. Do not start with a page and figure out the schema later. Build database-first.

---

## 1. Stack & infrastructure

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **Next.js 14+ (App Router)** | Modern React, built-in routing, works natively with Vercel |
| Language | **TypeScript** | Catches errors early, matches the complexity of this app |
| Styling | **Tailwind CSS** | Fast, matches Base44 visual language |
| UI components | **shadcn/ui** | Base44 already uses these, import patterns transfer cleanly |
| Database + Auth + Storage | **Supabase** (Postgres) | Hosted Postgres with RLS, auth, and file storage built in |
| Auth method | **Google SSO via Supabase** | All employees already have Google accounts through the business |
| Hosting | **Vercel** | Zero-config Next.js hosting with preview URLs per PR |
| Code host | **GitHub** | Version control + Vercel integration |
| Region | **Supabase Sydney** | Users are in Australia |

### Non-goals for v1

- No VPS usage (VPS is deferred; Vercel + Supabase free/pro tiers cover v1)
- No custom backend server (Supabase RPC and Next.js server actions handle everything)
- No mobile app (desktop-first, mobile-responsive nice-to-have)
- No integrations (Meta, Drive, WhatsApp, Metricool, etc. all deferred to v1.1+)
- No Jarvis CRM bridge in v1 (rebuilt separately later)

---

## 2. Core principles for the build

1. **Database schema first.** Tables, relationships, and RLS policies before any UI work. A wrong schema on page 3 means rewriting pages 1 and 2.
2. **One page at a time.** Build, test on a Vercel preview URL, iterate, merge, move on. Do NOT scaffold all pages at once.
3. **Preserve field names from the Base44 export where possible.** Data migration is easier if `filming_cadence`, `carbee_enabled`, etc. stay consistent.
4. **Better than Base44 where obvious, identical where unclear.** Don't redesign the calendar; do fix obvious UX gaps.
5. **Audit log everything mutational.** Who changed what, when. Required from day 1.
6. **Real data migration is a first-class feature.** Not a last-minute script. Build the migration scripts as you go.


---

## 3. Data model

All tables live in Supabase Postgres under the default `public` schema. Every table has: `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz default now()` (auto-updated via trigger).

Primary relationships are via `uuid` foreign keys. Base44 used string references; we're upgrading to real FK constraints with `on delete` behaviour defined per relationship.

### 3.1 `users` (handled by Supabase Auth)

Supabase manages `auth.users`. We extend with a `user_profiles` table:

| Field | Type | Notes |
|---|---|---|
| id | uuid PK | references `auth.users(id)` |
| email | text | synced from auth |
| display_name | text | |
| role | enum | `admin`, `manager`, `content_creator`, `editor`, `viewer` |
| employee_id | uuid FK nullable | links to `employees` table if this user is also a team member |
| is_active | boolean default true | |

**Access rules (see section 6):**
- `admin`: full access
- `manager`: full access except admin-only actions (delete users, delete clients)
- `content_creator`, `editor`: see own schedule, read all social calendars, read own client profiles
- `viewer`: read-only everywhere

### 3.2 `employees`

The team. 18 members across 4 regions. Separate from `user_profiles` because not every employee may have an app login, and not every app user is an employee.

| Field | Type | Notes |
|---|---|---|
| name | text NOT NULL | |
| role | enum | `Social Media Manager`, `Editor`, `Content Creator`, `Marketing Manager`, `Operations Manager`, `Founder` |
| region | enum | `Melbourne`, `Sydney`, `Brisbane`, `Perth`, `Newcastle` |
| phone | text | |
| email | text | |
| address | text | Full home/work address |
| is_active | boolean default true | Soft delete via this flag, don't hard-delete |

### 3.3 `clients`

Dealership accounts. 16 active. This is the most field-rich entity.

| Field | Type | Notes |
|---|---|---|
| name | text NOT NULL | Dealership name |
| package_id | uuid FK | → `packages(id)` |
| status | enum | `Active`, `Onboarding`, `Paused`, `Churned`, default `Onboarding` |
| monthly_value | numeric | AUD |
| filming_cadence | enum | `Weekly`, `Fortnightly` |
| location | text | |
| state | text | |
| address | text | |
| dealer_group | text | For multi-dealership groups like "Ralph D'Silva Motor Group" |
| account_health | enum | `Green`, `Amber`, `Red`, default `Green` |
| content_notes | text | |
| add_ons | text[] | Array of enabled add-ons: `Inventory Photography`, `CarBee Filming`, `Inventory Videos` |
| monthly_google_reviews | integer | |
| brand_pack | text | |
| cycle_start_date | date | Drives the 4-week cycle window |
| service_agreement_date | date | |
| onboarding_progress | jsonb | Structured progress tracking per onboarding phase |
| filming_guide | text | Long-form markdown |
| editing_guide | text | Long-form markdown |

**CarBee fields (prefix `carbee_`):**

| Field | Type |
|---|---|
| carbee_enabled | boolean default false |
| carbee_model | enum: `Recurring Sessions`, `Stock Target` |
| carbee_cars_per_session | integer |
| carbee_session_duration_minutes | integer (auto-calculated) |
| carbee_target_cars | integer |
| carbee_stock_percentage | numeric |
| carbee_total_stock | integer |
| carbee_monthly_turnover | integer |
| carbee_google_sheet_link | text |
| carbee_notes | text |
| carbee_sessions_per_week | integer default 1 |
| carbee_session_schedule | jsonb | Array of `{day_of_week, start_time}` |

**Inventory Photography fields (prefix `inventory_`):**

| Field | Type |
|---|---|
| inventory_enabled | boolean default false |
| inventory_includes_video | boolean default false |
| inventory_video_style | enum: `Style 1 Phone Edited On Spot`, `Style 2 Camera Edited Next Day` |
| inventory_cars_per_hour_photos | numeric |
| inventory_cars_per_hour_video | numeric |
| inventory_cars_per_session | integer |
| inventory_session_duration_minutes | integer (auto-calculated) |
| inventory_upload_destination | text |
| inventory_google_sheet_link | text |
| inventory_notes | text |
| inventory_shot_list | text | Multi-line numbered list |
| inventory_positioning_instructions | text |
| inventory_photos_per_car | integer |
| inventory_specific_angles | text |
| inventory_example_photos | text[] | URLs to Supabase Storage |
| inventory_extra_notes | text |
| inventory_sessions_per_week | integer default 1 |
| inventory_session_schedule | jsonb | Array of `{day_of_week, start_time}` |

### 3.4 `contacts`

Multiple contacts per client. Primary contact shown in client header.

| Field | Type | Notes |
|---|---|---|
| client_id | uuid FK NOT NULL | → `clients(id)` on delete cascade |
| full_name | text NOT NULL | |
| position | text | e.g. "Dealer Principal", "Owner" |
| phone | text | |
| email | text | |
| is_primary | boolean default true | Only one primary per client |

### 3.5 `packages`

Service packages. These are templates of recurring block types.

| Field | Type | Notes |
|---|---|---|
| name | text NOT NULL | e.g. `Minimum`, `Momentum`, `Dominate`, `Partner`, or custom |
| base_price | numeric | AUD per month |
| is_system | boolean default false | System packages cannot be renamed |
| monthly_video_count | integer | Target Reels/month |
| posts_per_week | integer | Target Posts (and Stories)/week |

### 3.6 `package_blocks`

Each package contains multiple block type definitions. This was a JSON array in Base44 — we normalize it into a proper table.

| Field | Type | Notes |
|---|---|---|
| package_id | uuid FK NOT NULL | → `packages(id)` on delete cascade |
| block_type | text NOT NULL | e.g. `Social Media Filming Block`, `Content Planning Block` |
| duration_minutes | integer NOT NULL | |
| repeat_frequency | enum | `Weekly`, `Fortnightly`, `Monthly Week 0`, `Monthly Week 1` |

### 3.7 `inventory_packages`

Reusable inventory photography package tiers (referenced by clients with inventory enabled).

| Field | Type |
|---|---|
| name | text NOT NULL |
| cars_per_hour | numeric |
| cars_per_hour_video | numeric |
| photos_per_car | integer |
| includes_video_default | boolean default false |
| video_style_default | enum (same as client) |
| price_per_car | numeric | AUD ex GST |
| notes | text |

### 3.8 `block_rules`

Rule-based scheduling core. When a client is assigned a package, one `block_rule` is created per `package_block`. The Employee Calendar materializes these rules into visible instances based on the client's cycle window.

| Field | Type | Notes |
|---|---|---|
| client_id | uuid FK NOT NULL | |
| block_type | text NOT NULL | |
| role | text | Required employee role for this block type |
| employee_id | uuid FK nullable | → `employees(id)`, null = unassigned |
| duration_minutes | integer NOT NULL | |
| day_of_week | enum NOT NULL | `Monday`–`Sunday` |
| start_time | text NOT NULL | `HH:MM` 24hr |
| repeat_frequency | enum NOT NULL | `Weekly`, `Fortnightly`, `Monthly Week 0`, `Monthly Week 1` |
| rule_start_date | date NOT NULL | Always the client's `cycle_start_date` |
| rule_end_date | date nullable | Set when rule is superseded |

**`Monthly Week 0` means "first full week of the month"; `Monthly Week 1` means "second full week". This convention comes from Base44 and must be preserved for data migration.**

### 3.9 `block_exceptions`

Overrides for individual instances of a block rule — moved, reassigned, or cancelled.

| Field | Type | Notes |
|---|---|---|
| client_id | uuid FK NOT NULL | |
| block_rule_id | uuid FK NOT NULL | → `block_rules(id)` on delete cascade |
| block_type | text | Denormalized for easier queries |
| original_date | date NOT NULL | The date this instance was originally scheduled |
| new_date | date | If moved |
| new_start_time | text | If moved |
| new_employee_id | uuid FK | If reassigned |
| is_cancelled | boolean default false | |
| note | text | |

**Unique constraint: `(block_rule_id, original_date)` — one exception per instance.**

### 3.10 `calendar_blocks` (legacy, may not be needed)

Base44 had a separate `CalendarBlock` entity for ad-hoc one-off blocks. In the rebuild, consider whether these can be modeled as `block_rules` with `repeat_frequency = None`. Decide during build; if one-offs are rare, drop this table.

### 3.11 `client_block_assignments`

Permanent employee assignments per client per block type. When a block rule is generated, it auto-assigns the permanent employee if one exists.

| Field | Type |
|---|---|
| client_id | uuid FK NOT NULL |
| block_type | text NOT NULL |
| employee_id | uuid FK NOT NULL |

**Unique constraint: `(client_id, block_type)` — one permanent assignment per combination.**

### 3.12 `content_items`

Social media content pipeline items.

| Field | Type | Notes |
|---|---|---|
| title | text NOT NULL | |
| client_id | uuid FK NOT NULL | |
| planning_meeting_id | uuid FK nullable | |
| content_type | enum NOT NULL | See enum list below |
| format | enum | `Reel`, `Post`, `Story`, `Ad` — derived from content_type |
| template_tag | text | |
| status | enum NOT NULL default `Planned` | `Planned`, `Shoot Booked`, `Filmed`, `Editing`, `QC`, `Ready for Scheduling`, `Published` |
| scheduled_date | date | |
| drive_folder_link | text | |
| caption | text | |
| brief | text | Shoot brief |
| editing_notes | text | For the editor |
| platform_override | text | e.g. "TikTok only" |
| video_example_url | text | |
| video_example_title | text | |
| video_example_notes | text | |
| repeat_enabled | boolean default false | |
| repeat_frequency | enum | `1w`, `2w`, `3w`, `4w` |
| is_recurring_instance | boolean default false | |
| hook_1, hook_2, hook_3 | text | |
| ad_script | text | For Ad content_type |
| ad_audience | text | |
| ad_budget | numeric | |
| ad_start_date, ad_end_date | date | |
| lead_type | enum | `Lead Form`, `Landing Page` |
| form_questions | text | |

**`content_type` enum:** `Car of the Week`, `Car Highlight`, `Culture Reel`, `Trendy TikTok Reel`, `Informative Reel`, `Reel Support Post`, `Delivery Post`, `Reel Support Story`, `Testimonial Story`, `Ad`.

### 3.13 `content_item_comments`

Internal comments thread on content items.

| Field | Type |
|---|---|
| content_item_id | uuid FK NOT NULL |
| author_id | uuid FK → `user_profiles(id)` |
| text | text NOT NULL |
| created_at | timestamptz default now() |

### 3.14 `content_type_examples`

Reference video library per content type (used in content item detail view).

| Field | Type |
|---|---|
| content_type | enum (same as content_items) NOT NULL |
| title | text NOT NULL |
| video_url | text |
| notes | text |

**Note:** Video Examples as a standalone page is v1.1. Keep the table for data, just don't build the management UI in v1.

### 3.15 `planning_meetings`

Monthly content planning meeting per client.

| Field | Type | Notes |
|---|---|---|
| client_id | uuid FK NOT NULL | |
| month | text NOT NULL | Format `YYYY-MM` |
| meeting_date | date | |
| status | enum default `Scheduled` | `Scheduled`, `Completed`, `Cancelled` |
| notes | text | |

**Unique constraint: `(client_id, month)` — one planning meeting per client per month.**

### 3.16 `inventory_sessions`

Log of completed inventory photography sessions (for reporting/revenue tracking).

| Field | Type |
|---|---|
| client_id | uuid FK NOT NULL |
| session_date | date NOT NULL |
| cars_photographed | integer |
| duration_minutes | integer |
| photographer_id | uuid FK → `employees(id)` |
| notes | text |

### 3.17 `audit_log`

Tracks every mutation. Required from v1.

| Field | Type |
|---|---|
| actor_id | uuid FK → `user_profiles(id)` |
| action | enum: `create`, `update`, `delete` |
| entity_type | text, e.g. `client`, `employee`, `content_item` |
| entity_id | uuid |
| diff | jsonb | `{before: {...}, after: {...}}` for updates |
| created_at | timestamptz default now() |

Implement via Postgres trigger on mutating tables — every INSERT/UPDATE/DELETE writes to `audit_log` automatically. Don't rely on application code to log; triggers are reliable.


---

## 4. Pages & features (v1 scope)

v1 must include: Clients, Employees, Packages (view-only), Social Calendar, Employee Calendar, Onboarding wizard, Inventory Photography config, CarBee config. Dashboard and Video Examples are deferred to v1.1.

Build order (recommended):
1. Auth + `user_profiles` + role gates
2. Employees page (simplest, unblocks assignment logic)
3. Packages page (view-only — unblocks client creation)
4. Clients list + Client detail (Details + Profile tabs)
5. Client Schedule tab + Inventory Photography tab + CarBee config
6. Onboarding wizard (multi-phase)
7. Social Calendar (content pipeline — complex)
8. Employee Calendar (rule materialization — most complex, save for last)
9. Data migration + dual-run

### 4.1 Layout

Left sidebar (dark), matches existing:
- Logo area (SCRM OS / SCRM Media)
- Nav: Dashboard (v1.1), Social Calendar, Employee Calendar, Clients, Onboarding, Employees, Packages, Video Examples (v1.1)
- Footer: version tag (e.g. `v1.0`)

Main content area: white/light, full-height, scrollable.

Top bar is not present in Base44; keep that convention.

### 4.2 Employees page

**Goal:** view and manage the 18-person team.

- Header: "Team" + count "18 team members" + **Add Employee** button (top right)
- Search bar + two filters: region (`All`), role (`All Roles`)
- Grouped by region with count, e.g. "MELBOURNE (14)"
- Each employee card: initials avatar (2 letters, color-coded by role), name, role, email, phone, address
- Click card → edit modal: Full Name, Role dropdown, Region dropdown, Email, Phone, Full Address, Save/Cancel
- Add Employee uses the same modal with empty fields

**Access:** admin/manager can edit; others read-only.

### 4.3 Packages page

**v1 scope: view-only.** Edit is admin-only.

- Header: "Packages" + "Define block types, durations, and add-on configurations"
- Two tabs: **Social Packages** | **Add-Ons**
- Social Packages tab: expandable cards per package showing block types with duration + frequency
  - System packages (`Momentum`, `Dominate`, `Partner`, `Minimum`) labeled as such with active client count
  - Custom packages (`TCB Bespoke`, `Westside Auto`, `Ralph D'Silva Motor Group SOCIALS`, etc.) shown with block counts
  - Each block row: block type name | duration (e.g. `90 min`) | frequency (e.g. `Weekly`)
- Add-Ons tab:
  - **CarBee Filming** card: Rate Per Car ($ ex GST), Production Rate (cars/hour), Block Duration Formula explanation
  - **Inventory Photography Packages** card: list of tiers, each with cars/hr, video rate, photos per car, edit/delete

**Edit/create is admin-only and can be minimal in v1 — editing package blocks can be deferred to v1.1 if it saves time.**

### 4.4 Clients page

**Goal:** manage all 16 dealership accounts.

**List view:**
- Header: "Clients" + count "16 active dealerships" + **Add Client** button
- Search + status filter (`All`)
- Table headers: Dealership Name | Monthly Value | Status
- Each row: name + package badge + location (muted), $ value, status dot (green/amber/red)
- Row expands (chevron) to reveal client detail inline

**Client detail (expanded row):**
- Four tabs: **Details** | **Profile** | **Schedule** | **Inventory Photography**
- Each tab is a panel within the expanded row (not a new page)

**Details tab:**
- Primary contact card: name + "Primary" badge, position, phone, email
- Filming Cadence + Cycle Start Date (read-only)
- Add-ons badges (Inventory Photography, CarBee, etc.)
- Edit button opens a modal with all client fields

**Profile tab** (has sub-tabs):
- **About:** read-only grid of Dealership, Package, Location, State, Filming Cadence, Primary Contact, Contact Phone, Inventory Photography status
- **Filming Guide:** textarea, "Filming instructions for content creators", Save
- **Editing Guide:** textarea, "Editing instructions for editors", Save
- **Inventory Photography:** see 4.5 below

**Schedule tab:**
- Table: Block Type | Freq | Day | Time | Employee (with permanent assignment chip)
- **Update Schedule** button (top right): opens a modal to regenerate rules from the client's package
- Each row is editable inline (change employee, time, day)

**Inventory Photography tab** (within client detail, not Profile): see 4.5.

**Add Client** (top right) → launches Onboarding wizard (see 4.7).

### 4.5 Inventory Photography config (per-client)

Shows when `inventory_enabled = true` on the client.

**Configuration section:**
- Toggle: Includes Inventory Video (drives video style dropdown visibility)
- Video Style dropdown (when video enabled)
- Cars/Hour — Photos Only (input)
- Cars/Hour — Photos + Video (input, lower rate when filming simultaneously)
- Cars Per Session (input)
- **Session Duration (calculated)** — readonly, formula: `cars_per_session ÷ cars_per_hour × 60 min`, show formula text below e.g. `3 ÷ 2/hr = 90min`

**Session Schedule section:**
- List of sessions (Session 1, 2, 3...) with day dropdown + time input + remove button
- **Add session** button (top right)
- Helper text: "Add multiple sessions for clients with 2–3 visits per week. Each creates a recurring unassigned block."

**Upload Destination** text input (e.g. "Google Drive > Client > Inventory Photos")
**Google Sheet Link** text input
**Notes** textarea
**Save** button

**Photographer Cheat Sheet section** (below, collapsible):
- **Print Cheat Sheet** button (top right, generates print-friendly view)
- **Shot List** textarea — numbered list of required shots in order
- **Positioning Instructions** textarea
- **Number of Photos Per Car** input
- **Upload Destination** (pre-filled from config, syncs back on change)
- **Specific Angles Required** textarea
- **Extra Notes** textarea
- **Example Gallery** — upload multiple reference photos (to Supabase Storage), show thumbnails with delete

**Session Log section** (below):
- **Log Session** button
- List of logged sessions with date, cars photographed, photographer, notes
- Empty state: "No sessions logged yet."

### 4.6 CarBee config (per-client)

Similar structure to Inventory Photography. Shows when `carbee_enabled = true`. Fields map to `carbee_*` columns in the `clients` table.

- Model dropdown: `Recurring Sessions` vs `Stock Target` (drives which sub-fields show)
- Cars per session
- Session duration (auto-calculated from cars_per_session and production rate from package CarBee config)
- Target cars / Stock %
- Sessions per week
- Session schedule (day + time array)
- Google Sheet link
- Notes

### 4.7 Onboarding wizard

**Goal:** structured multi-phase new client setup.

**Structure:**
- Four phases, progress bar at top showing current phase and step
- Each phase assigned to a role (e.g. "Phase 1 — Step 1 of 4 · Operations Manager")
- Phase gating: a phase can't be advanced unless required fields are filled

**Phase 1 — Client Info & Pricing (Operations Manager):**
- Dealership Name
- State dropdown + Address
- Primary Contact: Full Name, Position, Phone, Email
- Package selection (chip grid of available packages: Minimum, Momentum, Dominate, Partner, TCB Bespoke, Westside Auto, Ralph D'Silva Motor Group SOCIALS, Werribee Automotive Group SOCIALS)
- Add-Ons (toggle chips: Inventory Photography, CarBee Filming, Inventory Videos)
- If add-on enabled: show Cars/month + Price/car (ex GST) inputs for that add-on

**Phase 2 — Profile (Operations Manager or Content Lead):**
- Filming Guide (textarea)
- Editing Guide (textarea)
- Content notes

**Phase 3 — Schedule Setup (Operations Manager):**
- Based on package, generate proposed block rules
- UI to assign permanent employees per block type
- Set start times and days of week

**Phase 4 — Review & Activate:**
- Summary of all entries
- Activate button → sets `status = Active`, creates block_rules, sends welcome webhook (deferred, v1.1)

**Navigation:** Back / Next buttons at bottom. Progress is saved per phase so users can resume.

### 4.8 Social Calendar

**Goal:** per-client content pipeline management. This is where 80% of the daily team work happens.

**Entry view (no client selected):**
- "Social Calendar" + "Select a client to manage their content"
- City filter dropdown (`All Cities`) + alphabetical sort toggle
- Grid of client cards: name + package badge + filming cadence + location, status dot
- Click card → loads client's social calendar

**Client-selected view:**
- Back arrow + Client name + package badge + filming cadence (top)
- Client profile summary (About/Filming Guide/Editing Guide/Inventory Photography tabs — same structure as Clients page Profile tab, read-only context)
- **Monthly Planning Meeting section:** current month display, if no meeting scheduled show "No planning meeting set for [Month]" + Schedule Meeting button. If scheduled, show date + status + meeting notes with inline edit.
- **Weekly Content Shoot Checklist:** shows current week's Posts / Reels / Storys with live counts and quick-add buttons. Empty state: "Nothing to film this week."
- **Content Calendar:** month/week toggle, prev/next nav, Today button, drag-to-add chips (Reel, Post, Story, Ad), monthly grid with content item dots per day.
- **Content Tracker:** Board/List toggle, status columns with content items, status pipeline: `Planned` → `Shoot Booked` → `Filmed` → `Editing` → `QC` → `Ready for Scheduling` → `Published`. Counts per column. Click item opens detail modal.

**Add Content flow:**
- Button opens **content type picker modal**: grouped by format (Reels, Posts, Stories, Ads) with template cards. Plus a "+ Custom (blank form)" option.
- Picking a template pre-fills content_type + title + template_tag + example video URL.
- Second modal: full add-content form with Title, Content Type, Status (default Planned), Scheduled Date, Repeat toggle + frequency (if on), Platform Override (optional), Shoot Brief, For the Editor, Drive Folder Link, Video Example (shows reference if set in `content_type_examples`).
- If adding a Reel, prompt: "Add matching Post and Story?" (Add Both / Dismiss).

**Edit Content (click existing item):**
- Same form as add, plus Internal Comments thread (post, list with author + timestamp), auto-save indicator.

**V1 explicitly excludes** the yellow/blue suggestion cards ("This client typically needs a Testimonial Story..."). These were rule-based prompts in Base44; deferred to v1.1.

### 4.9 Employee Calendar

**Goal:** the operational backbone — team scheduling across all clients via rule-based block generation.

**Header:**
- "Employee Calendar" + "All employees — rule-based scheduling"
- Alert banner: "N unassigned block rules across all clients" (clickable → filtered view)

**View toggles:** Week | Month | Cycle (4-week rolling window)

**Legend:** color-coded block categories
- Filming (orange): Social Media Filming, Ad Filming
- CarBee (yellow)
- Editing (purple): Social Media Editing, Ad Editing
- Planning / Strategy (blue): Content Planning, Strategy
- Ads (pink): Ad Scripting, Meta Ad Setup, Ads Check and Optimise
- Delivery (green): Video Send-off, Scheduling
- Unassigned (striped/gray)

**Filters:** All Employees, All Clients, All Block Types, All Status, Today button, DST toggle (-1h).

**Week view:** vertical time grid (8am–8pm), columns for each day, blocks rendered as colored rectangles with client name + block type.

**Month view:** day cells with stacked block summaries, "+N more" overflow.

**Cycle view:** 4-week horizontal layout showing which clients have cycle starts in the window; helps spot scheduling gaps. Each day cell shows clients that start their cycle that day.

**Click a block → Block detail modal:**
- Header: Block type + Client name + Date
- Employee assignment (current permanent shown as "Permanent: [Name]", with Remove button)
- Employee dropdown: Unassigned / Current / Other employees (filtered by required role for that block type)
- Date, Start Time, Duration (minutes) inputs
- Notes textarea
- Rule summary: "Rule: Weekly · Thursday · 09:00"
- Actions:
  - **Save this instance** → writes a `block_exception` with override fields
  - **Save permanently** → updates the `block_rule` itself (future instances all change)
  - **Cancel this instance** → writes `block_exception` with `is_cancelled = true`
  - **Delete all future** → sets `rule_end_date` on the `block_rule`

**Drag-and-drop:**
- Drag a block to a different day/time slot → prompt modal: "Move Content Planning to 2026-04-20 at 07:45" with options: "Move just this instance" vs "Move all future instances of this block" vs "Cancel".
- Same logic: "just this" writes exception, "all future" updates rule.

**Rule materialization logic (critical):**

The Employee Calendar never stores every block instance as a row. It stores rules (`block_rules`) + exceptions (`block_exceptions`). When a view is rendered for a date range:

```
for each block_rule where rule_start_date <= range_end AND (rule_end_date IS NULL OR rule_end_date >= range_start):
    for each occurrence date in range based on repeat_frequency + day_of_week + rule_start_date:
        check for exception matching (block_rule_id, original_date = occurrence_date)
        if exception.is_cancelled: skip
        if exception exists: render with overrides (new_date, new_start_time, new_employee_id)
        else: render as rule defaults
```

This must be implemented as a single server-side query or RPC that returns the materialized blocks for a date range. Do not do this client-side — performance dies.

**Unassigned alert logic:**
- Count block_rules where employee_id IS NULL → alert banner count.


---

## 5. Auth, roles, and access control

**Auth:** Supabase Auth with Google SSO. Restrict to `@scrmmedia.com.au` domain in Supabase settings (plus a Giuliano override for personal email if needed).

**Session:** JWT via Supabase; Next.js middleware checks auth on every route except `/login`.

**Roles** (on `user_profiles.role`):

| Role | Clients | Employees | Social Calendar | Employee Calendar | Onboarding | Packages | Admin actions |
|---|---|---|---|---|---|---|---|
| `admin` | R/W | R/W | R/W | R/W | R/W | R/W | Yes |
| `manager` | R/W | R/W | R/W | R/W | R/W | R | No |
| `content_creator` | R (own clients) | R (self) | R (all) / W (assigned) | R (own schedule) | — | R | No |
| `editor` | R | R (self) | R (all) / W (editing status) | R (own schedule) | — | R | No |
| `viewer` | R | R | R | R | — | R | No |

**Row Level Security (RLS):** enabled on all tables. Policies enforce role-based access server-side — never trust client-side role checks alone.

Example RLS policy for `clients`:
```sql
create policy "admins and managers can do everything on clients"
  on clients for all
  using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'manager')
    )
  );

create policy "everyone authenticated can read clients"
  on clients for select
  using (auth.uid() is not null);
```

Admin-only actions (delete user, delete client, edit system packages) must also be gated at the UI level to avoid showing unusable buttons.

---

## 6. Data migration plan

**Source:** Base44 export files in `/base44-export/`:
- CSVs per table: `Client_export.csv`, `Employee_export.csv`, `Package_export.csv`, `Contact_export.csv`, `ContentItem_export.csv`, `InventoryPackage_export.csv`, `ClientBlockAssignment_export.csv`, `BlockException_export.csv`
- Frontend code in `scrm-media-flow.zip` (reference only, not migrated)
- Entity schemas in `base44/entities/*.jsonc` (reference for field mapping)

**Target:** Supabase Postgres (scrm-os project, Sydney region).

**Approach:**
1. Write a `migrate.ts` script in a `/scripts/migration/` folder
2. Run order matters (FKs):
   1. `employees`
   2. `packages` + `package_blocks`
   3. `inventory_packages`
   4. `clients`
   5. `contacts`
   6. `block_rules`
   7. `client_block_assignments`
   8. `block_exceptions`
   9. `planning_meetings`
   10. `content_items`
   11. `content_item_comments`
3. Each migration step: read CSV, transform fields (e.g. Base44 string IDs → Supabase UUIDs via a mapping table), upsert to Supabase.
4. Keep a `migration_log.json` that maps old Base44 IDs to new Supabase UUIDs — you'll need this to resolve FKs across steps.
5. Run migrations against a staging Supabase project first. Verify counts, spot-check records, then run on production.

**Dual-run period:**
- Week 4 (or whenever launch-ready): both Base44 and SCRM OS running simultaneously
- Team does all daily work in SCRM OS; Base44 is read-only reference
- At end of dual-run week: re-run migration to pull any Base44 edits that slipped through
- Final cutover: archive Base44 export, disable Base44 access

**Empty tables in current export:** `ContentTypeExample`, `InventoryEditTask`, `InventorySession`, `PlanningMeeting`. No data to migrate for these; schema is still built per spec.

---

## 7. Audit log implementation

Every INSERT/UPDATE/DELETE on business-critical tables (`clients`, `employees`, `packages`, `package_blocks`, `contacts`, `block_rules`, `block_exceptions`, `client_block_assignments`, `content_items`, `planning_meetings`, `inventory_packages`, `user_profiles`) writes to `audit_log` via Postgres trigger.

Trigger example:
```sql
create or replace function log_audit() returns trigger as $$
begin
  insert into audit_log (actor_id, action, entity_type, entity_id, diff)
  values (
    auth.uid(),
    lower(TG_OP),
    TG_TABLE_NAME,
    coalesce(NEW.id, OLD.id),
    jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW))
  );
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;
```

Audit log is viewable only by admins. Deferred UI: a simple `/admin/audit` page (v1.1) showing recent entries with filters. For v1, the data just needs to be captured reliably.

---

## 8. Folder structure (Next.js App Router)

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── callback/route.ts         # Supabase OAuth callback
│   ├── (app)/
│   │   ├── layout.tsx                 # Sidebar + main content
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── employees/page.tsx
│   │   ├── packages/page.tsx
│   │   ├── onboarding/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx          # Resume in-progress onboarding
│   │   ├── social-calendar/
│   │   │   ├── page.tsx
│   │   │   └── [clientId]/page.tsx
│   │   └── employee-calendar/page.tsx
│   └── layout.tsx                     # Root
├── components/
│   ├── ui/                            # shadcn components
│   ├── sidebar.tsx
│   ├── client/                        # client-related components
│   ├── calendar/                      # calendar components
│   ├── content/                       # content item components
│   └── onboarding/                    # wizard steps
├── lib/
│   ├── supabase/                      # client + server helpers
│   ├── queries/                       # typed DB queries
│   ├── rules/                         # block rule materialization
│   └── utils.ts
├── types/
│   └── database.ts                    # generated from Supabase
├── scripts/
│   └── migration/                     # Base44 → Supabase
└── supabase/
    ├── migrations/                    # SQL migrations
    └── functions/                     # Edge functions if needed
```

---

## 9. Conventions

- **Naming:** `snake_case` in database, `camelCase` in TypeScript. Use Supabase type generation to get correct types automatically.
- **Server-first:** prefer Next.js Server Components + Server Actions. Client components only where interactivity requires it (modals, drag-drop, calendar navigation).
- **Queries:** centralize in `lib/queries/`. No ad-hoc Supabase calls in components.
- **Forms:** use `react-hook-form` + `zod` for validation. Every form's zod schema is derived from the Supabase types where possible.
- **Dates/times:** store dates as `date` (UTC-free), times as `text` `HH:MM`. Always render in Melbourne timezone for the UI.
- **Icons:** `lucide-react`.
- **Loading states:** every data fetch has a skeleton loader. Never leave a user staring at a blank screen.
- **Error handling:** toast notifications via `sonner` for user-facing errors. Server-side errors log to Sentry (optional v1.1).

---

## 10. Build sequence (suggested, not enforced)

**Week 1 — Foundation**
- Day 1-2: Next.js + Supabase + Vercel + GitHub setup. Auth working with Google SSO. Domain restriction in place.
- Day 3-4: `user_profiles`, `employees` table + page. Role gating working.
- Day 5-7: `packages` + `package_blocks` + `inventory_packages` tables and view-only page. `clients` table + list + Details tab working.

**Week 2 — Client depth + Onboarding**
- Day 8-9: Client Profile tab (About, Filming Guide, Editing Guide).
- Day 10-11: Client Inventory Photography + CarBee config tabs.
- Day 12-14: Onboarding wizard (Phase 1-4).

**Week 3 — Calendars**
- Day 15-17: Social Calendar (client selector, content tracker, content items CRUD, planning meetings).
- Day 18-21: Employee Calendar (rule materialization engine, week/month/cycle views, block modal, drag-drop, exceptions).

**Week 4 — Migration + polish**
- Day 22-24: Data migration scripts. Dual-run setup.
- Day 25-27: Testing against production data. Bug fixes.
- Day 28: Cutover.

**Check-in at end of Week 1:** assess actual velocity. If Week 1 took 1.5 weeks, extend the whole timeline proportionally. Better to ship a solid app in 6 weeks than a broken one in 4.

---

## 11. What's NOT in v1 (explicit deferrals)

To prevent scope creep, these are explicitly out of v1:

- Dashboard page (home landing)
- Video Examples management page (data model exists; no UI)
- Social Calendar suggestion cards (yellow/blue "This client typically needs..." prompts)
- Any integrations: Meta Ads, WhatsApp, Metricool, Google Drive sync, Google Calendar sync
- Jarvis CRM bridge (separate rebuild)
- Mobile native app
- Audit log viewer UI (data is captured; no admin page yet)
- Daily Notes AI system (this lives in Jarvis, not SCRM OS)
- Print Cheat Sheet PDF generation (save for v1.1; for v1, window.print is acceptable)
- Automated content performance reporting
- Client-facing portal

---

## 12. Acceptance criteria for v1 launch

SCRM OS v1 is ready to replace Base44 when:

1. All 17 active team members can log in with their Google accounts.
2. All 16 active clients appear correctly with full profile data, packages, schedules, and contacts.
3. Employee Calendar renders all active block rules correctly for current and next 4-week cycle windows.
4. A team member can add, edit, and status-change a content item without errors.
5. A new client can be onboarded end-to-end through the wizard and appears correctly in all views.
6. Inventory Photography and CarBee configurations are editable and auto-calculations work.
7. Block drag-drop and "just this instance" vs "all future" behaviours match Base44 semantics.
8. Audit log is being written to for every mutation.
9. Data migration from Base44 is re-runnable and idempotent.
10. Zero data loss during dual-run verification.

---

## 13. Open questions / TBD

Things Giuliano and Claude Code should decide during the build:

- Should one-off `CalendarBlock` entries (non-recurring) be kept as a separate table, or modeled as `block_rule` with `repeat_frequency = 'None'`? Lean toward the latter for simplicity.
- Exact start times per block type — use Base44's current defaults unless the team wants changes during migration.
- Whether to let content_creators edit content_items they're assigned to, or only admins/managers. Default: creators can edit their own; deferred if unclear.
- Inventory Session logging — is this a manual log, or does it auto-generate from completed blocks? Likely manual for v1.

---

## 14. Reference: Base44 exports

All source-of-truth data for the migration lives in:
- `/base44-export/*.csv` — data per table
- `/base44-export/scrm-code/base44/entities/*.jsonc` — original schemas (field names + types)
- `/base44-export/scrm-code/src/` — original frontend code for UI reference
- `/base44-export/scrm-code/base44/functions/` — three backend functions: `clearAllBlocks`, `receiveClientFromCRM`, `sendClientToSCRM`. The CRM bridge functions are Jarvis integration — defer to v1.1+.

**End of spec.**
