# SecureScope 360 – Angular 15 InfoSec Dashboard (Migration Baseline)

A small, enterprise-style Information Security dashboard built with **Angular 15** and a classic
**NgModule-based architecture**. It is the *source application* for evaluating automated
**Angular → Svelte** migration with the Software Factory tool, and the *baseline* the migrated app is
validated against.

> Visual design is inspired by enterprise InfoSec consoles (such as Genpact InfoSec360). The
> product name, organization and all data are fictional.

## Pages

| Route | Page | Contents |
|---|---|---|
| `/dashboard` | Security Dashboard | Posture score, KPI cards (assets, critical/high/medium/low risks, open incidents, resolved issues), overdue banner, risk distribution donut, findings trend bar chart, security domain overview, recent alerts (acknowledge), asset coverage, active incidents |
| `/reports` | Security Reports | Findings table with search, severity/status/overdue filters, column sorting, result count, CSV export |
| `/reports/:id` | Security Reports + detail drawer | Finding details, status update form (reactive, validated), status history |

`/` and unknown URLs redirect to `/dashboard`. Dashboard KPIs drill down into Reports via query params
(`?severity=Critical`, `?status=Resolved`, `?overdue=true`).

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | **18.x** (see `.nvmrc`; Angular 15 supports ^14.20, ^16.13 and ^18.10) |
| npm | 8+ |
| Chrome | for unit tests (Karma) |

Verified: build, `ng serve` and the 24 unit tests on Node 16.14 and 18.16. `ng serve` and the build
also work on Node 24, which Angular 15 does not officially support.

`.npmrc` sets `legacy-peer-deps=true`, which the step-by-step `ng update` needed and plain installs
still use.

### Upgrade history

The app was written for Angular 10 and upgraded one major at a time with `ng update` (10 → 11 → 12
→ 13 → 14 → 15) on branch `upgrade/angular-15`, building and running all tests after each step. The
only source changes the migrations made: `relativeLinkResolution` added in v11 and removed in v15
(`app-routing.module.ts`), test bootstrap updates (`test.ts`, `polyfills.ts`), and the reactive
status-update form opted out of typed forms in v14 (`UntypedFormBuilder`, `UntypedFormGroup` in
`finding-detail.component.ts`). The TypeScript target is ES2022 with `useDefineForClassFields: false`,
as Angular 15 expects. The Angular 10 version stays on `main`.

## Run

```bash
npm install
npm start          # http://localhost:4200   (npm start -- --port 4300 to change the port)
npm run build:prod # output in dist/securescope-360
npm run test:ci    # 24 Jasmine/Karma unit tests, headless Chrome
```

## Project structure

```
src/app
├── app.module.ts / app-routing.module.ts   Root module, lazy routes
├── app.component.*                         Shell: header, sidebar, router-outlet, toasts
├── core/                                   Singleton layer (import once)
│   ├── core.module.ts                      Shell components + APP_CONFIG provider
│   ├── config/app-config.ts                InjectionToken + fixed reference date
│   ├── models/security.models.ts           Types, enums-as-unions, constants
│   ├── data/mock-security-data.ts          ALL mock data (single source of truth)
│   ├── services/                           SecurityDataService, FindingQueryService,
│   │                                       CsvExportService, NotificationService
│   └── layout/                             header, sidebar, toast
├── shared/                                 Reusable presentation layer
│   ├── shared.module.ts
│   ├── components/                         panel, stat-card, severity-badge, status-badge,
│   │                                       progress-bar, donut-chart, bar-chart
│   ├── directives/                         appSeverityHighlight, appScoreColor
│   └── pipes/                              relativeTime, truncate, dueStatus
└── features/
    ├── dashboard/                          DashboardModule (lazy) + 5 child components
    └── reports/                            ReportsModule (lazy) + filter, table, detail
```

## Design decisions that matter for migration

* **Deterministic output.** "Now" is fixed at `2026-11-18T09:00:00Z` (`APP_CONFIG.referenceDate`), so
  relative times, overdue flags and "Due in N days" text are identical on every run and in the migrated
  app. Only the CSV filename and timestamps of new status-history entries use the real clock.
* **In-memory state.** Findings and alerts live in `BehaviorSubject`s in `SecurityDataService`. Status
  updates and alert acknowledgements are reflected on the dashboard immediately and reset on page reload.
* **No external UI or chart libraries.** Charts are pure CSS (`conic-gradient` donut, flexbox bars).
* **Business logic is isolated** in services/pure functions (`FindingQueryService`, `scoreLevel`,
  `CsvExportService`) so it can be compared one-to-one after migration.

## Migration documentation

* [`docs/MIGRATION_VALIDATION.md`](docs/MIGRATION_VALIDATION.md) – test scenarios with exact expected results.
* [`docs/ANGULAR_FEATURE_COVERAGE.md`](docs/ANGULAR_FEATURE_COVERAGE.md) – every Angular construct used, where, and its expected Svelte equivalent.
