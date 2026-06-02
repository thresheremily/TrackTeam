# TrackTeam — Specification

A team-management PWA for high school / club track-and-field coaches.
Built as a single-file React app (`app.js`) using in-browser JSX
transpilation (esbuild-wasm), with Firebase Auth + Firestore for
multi-coach sync and offline-tolerant local persistence.

## 1. Tech Stack

- **Runtime:** React 18 (function components + hooks).
- **Bundler:** None at deploy time. `app.js` is loaded raw and
  transpiled in the browser with esbuild-wasm so the source can be
  edited and shipped as a static asset.
- **Storage:**
  - Firebase Auth for sign-in.
  - Firestore document `teams/{teamId}/data/main` holds the team's
    full data blob (athletes, events, results, meets, attendance,
    workouts, settings).
  - Local cache + offline persistence via the Firestore client.
- **Hosting:** Static — works on GitHub Pages and any static host.
- **Single source file:** `app.js` (~7,500+ lines). Module-level
  helpers, then page components, then `App` + render.

## 2. Domains and Data Model

All keys live on `data` (one document per team) unless noted as
`team.*` (a separate Firebase team document with members + joinCode).

### 2.1 Team & Identity (team document)
- `team.name`, `team.school`
- `team.joinCode` — share-code so co-coaches can join
- `team.members: { [uid]: { email, name, role } }`
- `team.colors: { primary, secondary }`
- `team.logo` — base64-embedded image (small)
- `team.createdBy`, `team.createdAt`

### 2.2 Roster (`data.athletes`)
Each athlete: `{ id, name | legalFirst+legalLast, preferredName,
gender ('M'|'F'|other), gradYear, group, level, active, gradeOverride,
gradeAtDate?, ... }`

### 2.3 Events (`data.events`)
`{ id, name, gender ('Boy'|'Girl'|'Mixed'), eventType ('Track'|'Field'),
entryType ('Individual'|'Relay'), measurableType ('Time'|'Length'),
trackType ('Indoor'|'Outdoor'|'Both'), qualifyingStandards: [{id,
name, timeMs | ft/inch/qtr}], schoolRecords: [...], lapStructure?: {
firstLap, restLap, customSplits }, defaultOrder? }`

### 2.4 Meets (`data.meets`)
`{ id, name, startDate, endDate?, venue, city, state, trackType,
timingSystem ('FAT'|'Hand'), meetTypeId, eventOrderTemplateId?,
maxEntriesPerEvent, maxEventsPerAthlete, notes, tags: [string],
events: [{ eventId, round, day, entries: [...] }], teamScores?:
{ mode:'split'|'combined', boys:[...], girls:[...], combined:[...]
}, eventOrder: [eventId] }`

Each entry: `{ id, athleteId | relayAthletes:[athleteId], role:
'Relay'|'Alternate', seedTime/Mark, ... }`
Each team-scores row: `{ id, opponentId | 'self', points, place }`

### 2.5 Results (`data.results`)
`{ id, athleteId | relayAthletes, eventId, meetId, date, timeMs |
ft/inch/qtr, place, round, splits?, isRelay, isRelaySplit, isPractice,
verified, ... }`

### 2.6 Standards (`data.qualifyingStandardTypes`)
`{ id, name, abbrev, color, timingType ('FAT'|'Hand'|'Both'),
minQualifiers, subtypes: [string], subtypeTimingTypes:
{[s]:'FAT'|'Hand'|'Both'}, subtypeMinQualifiers: {[s]:n}, notes,
lastUpdated, subtypeUpdates: {[s]:ts} }`

Plus per-event `evt.qualifyingStandards: [{ id, name, timeMs |
ft/inch/qtr }]` for the actual marks.

`data.nearMissPct` — % cutoff for "close to qualifying."

### 2.7 Opponents (Team Scoring)
- `data.opponentDimensions: [{ id, name, order, values: [{id, name}] }]`
  — user-defined independent dimensions (Section, Class, League,
  Division — name them whatever your state uses).
- `data.opponents: [{ id, name, dimensionValues: { [dimId]: valueId
  } }]` — schools you compete against.
- `data.ourTeamDimensionValues: { [dimId]: valueId }` — our team's
  own categorization.

### 2.8 Templates & Settings
- `data.eventOrderTemplates` — named ordered lists (per season /
  per meet type).
- `data.meetTypes: [{ id, name, qualifying }]`
- `data.seasons: [{ id, name, startDate, endDate, isActive,
  defaultMeetOrder, defaultMeetTypeId }]`

### 2.9 Practice & Attendance
- `data.workoutPlans: [{ id, week, entries, restDays,
  athleteOverrides }]` — weekly plans, per-group/level.
- `data.attendance: [{ athleteId, date, status: 'present'|'absent'|
  'excused'|... }]`
- `data.athleteGroups: [{ groupId, level }]`

## 3. Navigation

`App` maintains a `page` string and `pageParams`. Top-level pages:
`dashboard`, `meets`, `meetSub`, `athletes`, `athleteSub`, `events`,
`practice`, `attendance`, `dailyAttendance`, `dailyPractice`, `tools`,
`raceTimer`, `multiSplitTimer`, `fieldEvent`, `relayTimer`,
`seasonResults`, `settings`.

## 4. Pages and Key Features

### 4.1 Dashboard
At-a-glance: today's date, current season, featured/next meet, quick
links, qualifier counts.

### 4.2 Meets List → Meet
- Filter by date, type, track. Per-meet edit modal (`MeetFormModal`)
  with tags input.
- **Meet page** has top tabs **Entries | Results | Team Scores**.
- Entries / Results sub-tabs **By Event | By Athlete**.
- Per-round support (Open / Trial / Prelim / Quarter / Semi / Final)
  via `normalizeRound()` and `ROUND_LABELS`; round badge appears on
  every meet event and result row.
- Multi-day meets: each event card gets a Day picker; sticky Day N
  dividers when no day filter is active.
- **Reorder Events** modal: drag/handle reorder of every event-day-
  round card, with day group dividers and round badges; saves a
  deduped per-event order to `meet.eventOrder`.
- **Team Scores** tab:
  - Per-meet toggle Combined / Split Boys & Girls.
  - Each side is a table: Team | Categories | Points | Place.
  - Team cell is a button opening a picker modal with search,
    per-dimension filters, sort, multi-select in Add mode, select-
    all (filtered minus already-used), and "+ Add new opponent"
    inline.
- "Only with results" filter on Results → By Event.

### 4.3 Athletes List → Athlete
- Filter, search, status. Athlete sub-page shows PRs per event,
  progression charts, per-meet results, qualifying badges,
  attendance, workout overrides.
- Goal source (PR / standard / custom) when entering athletes.

### 4.4 Events
- CRUD list. Per-event qualifying standards, school records, and
  lap structure overrides for non-standard race starts.

### 4.5 Practice & Attendance
- Weekly workout grid (Mon–Sat). Per-group / per-level entries and
  rest days. Per-athlete overrides.
- Daily attendance: present / absent / excused with %-attendance
  rollups.

### 4.6 Tools
- **Race Timer** (track), **Multi-Split Timer**, **Field Event** (mark
  entry with attempts), **Relay Timer** (composite + leg splits).
- All flow back into `data.results`.

### 4.7 Season Results
Cross-meet view; tabs include `events` (rankings by event), `standards`
(who hit each standard), and others.

### 4.8 End-of-Season Report
`ReportBuilderModal` builds a printable HTML report with toggleable
sections:
- Team page (Summary tiles, Top PRs, Team Qualifiers, Ranked
  Performances by Event, Team Scores).
- Per-athlete pages (Summary tiles, Highlights, By-Event table,
  Per-meet Results, Progression charts with trendlines, Feedback).
- Customizer pickers: date range, athlete subset, **Standards to
  include** (every distinct std name from your events, plus type +
  subtype combos, all in one toggleable list), gender mode (all /
  split), Team Scores grouping (by any of your opponent dimensions
  or by meet tag).
- Drafts auto-save.

### 4.9 Settings
Tabs:
- **Seasons** — start/end dates, active flag, default order /
  meet type.
- **Branding** — school name, colors, logo upload.
- **Meet Types** — categories with `qualifying` flag.
- **Opponents** — collapsible cards:
  - **Our Team** dimension values.
  - **Dimensions** — add/rename/reorder/delete dimensions and
    their values (per-dimension collapse, ✏️ edit affordances).
  - **Opponents list** — name + cross-dimension label; search +
    per-dimension filters + name sort + Clear.
  - Collapse all / Expand all in the page header.
- **Event Order** — named templates + system default.
- **Standards** (renamed from Qualifying) — per-type config
  (color, abbrev, timing, min qualifiers, sub-types, notes); each
  type collapses to a one-line header; Collapse all / Expand all.
  Includes BulkStandardEntry for fast per-event mark entry.
- **Records** — read-only school records summary.
- **Team** — join code, member list, account.
- **Data** — sync status, size meter, JSON export/import.

## 5. Round Tagging

`normalizeRound()` accepts variants and snaps to
`['Open','Trial','Prelim','Quarterfinal','Semifinal','Final']`.
`ROUND_COLOR` provides badge colors. Every meet entry and result row
carries a `round`; UI shows the badge when round ≠ Open or when more
than one round exists for the event.

## 6. Qualifying Logic

`getAllQualifyingForResult(data, events, r)` returns the event's
standards that the result meets, with optional FAT/Hand conversion
via `handToFAT()`. `getStdTimingTypeGlobal()` maps a standard name
to its timing type. `resolveStdLabel()` fuzzy-maps a result's
standard name back to the configured type+subtype label. `stdEnabled`
checks the raw event-saved name first (case-insensitive), then falls
back to the resolved canonical label, so the report's Standards-to-
include picker honors every name actually present in your data.

## 7. Firestore Security

`firestore.rules` enforces:
- `/users/{uid}`: read/write only by that user.
- `/teams/{teamId}`: members can read/update; non-member can join
  by adding their own uid to the members map (no other changes).
  Create requires the caller is the createdBy. No deletes from the
  client.
- `/teams/{teamId}/data/{docId}`: members only.

## 8. Print / Report Rendering

Reports open in a new window via `window.open` with embedded CSS
tuned for `@page portrait` print (`-webkit-print-color-adjust:
exact`). Charts are inline SVG (`makeProgressionSVG`). Page-break
classes split team and per-athlete pages.

## 9. Conventions

- Money/no comments in source — code self-documents by name.
- `S.*` style objects for buttons, inputs, cards, table cells.
- `C.*` color palette tokens.
- `uid()` generates ids.
- All Firestore writes go through `save(nextData)`; never write
  `undefined` field values (Firestore rejects them — drop fields by
  destructure instead).

## 10. Branch / Release Workflow

- Development on `claude/fix-relay-results-override-Wuur9`.
- Single PR per feature batch; PRs are squash-friendly because the
  app is one file.
- Commits described as user-facing changes; CLAUDE-co-author footer
  links to the session.
