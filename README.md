# SecureScope 360 – Angular 10 InfoSec Dashboard (Migration Baseline)

A small, enterprise-style Information Security dashboard built with **Angular 10** and a classic
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
| Node.js | **14.x or 16.x** (see `.nvmrc`; verified with 16.14.2) |
| npm | 6+ |
| Chrome | for unit tests (Karma) |

The npm scripts work on **any Node version** (verified on 16 and 24). Angular 10's tooling
(webpack 4, webpack-dev-server 3) predates Node 17, so the scripts in `scripts/` adapt:

* `ng build` / `ng test` get `--openssl-legacy-provider` automatically on Node 17+.
* `npm start` uses `ng serve` (live reload) on Node ≤ 16. On Node 17+, `ng serve` crashes
  (`No such module: http_parser`), so it runs `ng build --watch` plus a small static server instead.
  After a code change, refresh the browser.

## Run

```bash
npm install --legacy-peer-deps
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
