# Migration Validation – Test Scenarios & Expected Results

These scenarios define the **expected behaviour of the Angular baseline**. Run each one against the
original app and the migrated Svelte app. The migrated app passes when every expected result matches.

All values come from `src/app/core/data/mock-security-data.ts` with the fixed reference date
**18 Nov 2026, 09:00 UTC**. Always **start each scenario from a fresh page load**. State is in memory,
so a reload undoes earlier status updates and acknowledgements.

Severity: **C** = critical (a blocking regression), **M** = major, **m** = minor.

---

## A. Build, run & shell

| # | Sev | Steps | Expected result |
|---|---|---|---|
| A1 | C | Install dependencies and build the app | The build finishes without errors |
| A2 | C | Start the app and open `/` | Redirects to `/dashboard` |
| A3 | M | Open `/does-not-exist` | Redirects to `/dashboard` |
| A4 | M | Look at the header | Shows "SecureScope 360", "Northwind Global Services", "Data as of 18 Nov 2026, 09:00 UTC", avatar "SA", "Security Analyst" |
| A5 | M | Look at the sidebar | Two links: "Security Dashboard" (Posture overview) and "Security Reports" (Findings register). The link for the current page is highlighted |
| A6 | m | Click ☰ in the header | Sidebar collapses to icons only. Click again to expand it |
| A7 | m | Check the browser tab title on each page | "Security Dashboard \| SecureScope 360" / "Security Reports \| SecureScope 360" |
| A8 | C | Click each sidebar link | Navigates without a full page reload |

## B. Security Dashboard (`/dashboard`)

| # | Sev | Check | Expected result |
|---|---|---|---|
| B1 | M | Security Posture Score | **75**/100, shown in amber |
| B2 | C | Total Assets Monitored card | **3,309**, caption "96.6% of 3,427 assets" |
| B3 | C | Critical / High / Medium / Low Risks cards | **4 / 6 / 7 / 4** (open = status Open or In Progress) |
| B4 | C | Open Incidents card | **5** |
| B5 | C | Resolved Issues card | **6** |
| B6 | M | Overdue banner | "**4** open findings are past their remediation due date." |
| B7 | M | Risk Distribution | Donut center shows **21** "OPEN RISKS". Legend: Critical 4 / 19%, High 6 / 29%, Medium 7 / 33%, Low 4 / 19%. Segment colours: red, orange, yellow, green |
| B8 | M | Findings Trend | 6 month groups Jun–Nov, two bars each. Jun 42/35, Jul 38/40, Aug 51/39, Sep 46/44, Oct 33/41, Nov 29/24. "Net change over period: **+16 findings**" in red |
| B9 | M | Security Domain Overview | 6 cards: Network Security 82 ▲ 40/48 · 5 open findings; Identity & Access 68 ▼ 25/36 · 5; Application Security 61 ▬ 26/42 · 5; Data Protection 77 ▲ 23/30 · 3; Endpoint Security 88 ▲ 25/28 · 2; Cloud Security 72 ▼ 29/40 · **1 open finding** (singular) |
| B10 | m | Score colours | ≥80 green (82, 88), 65–79 amber (68, 72, 77), <65 red (61). The progress bars use the same colours |
| B11 | M | Recent Security Alerts | 6 alerts, newest first: ALT-9921 (18 min ago), ALT-9919 (1 h ago), ALT-9914 (5 h ago), ALT-9908 (11 h ago, already "✔ Acknowledged"), ALT-9902 (18 h ago), ALT-9897 (1 d ago). Header shows "5 awaiting acknowledgement" |
| B12 | M | Asset Coverage | 6 categories. Applications 81 / 87 **93.1%** is orange (below the 95% target). All others are teal/green. Databases 64 / 64 100.0% |
| B13 | M | Active Security Incidents | 5 rows: INC-2041 Critical Investigating, INC-2038 High Contained, INC-2036 High Open, INC-2033 Medium Open, INC-2024 Medium Investigating. Subtitle "5 incidents not closed" |

## C. Dashboard interactions

| # | Sev | Steps | Expected result |
|---|---|---|---|
| C1 | C | Click the "Critical Risks" card | Navigates to `/reports?severity=Critical`. The Severity filter shows "Critical" and the page reads "Showing 5 of 30 findings" |
| C2 | M | Click the "Resolved Issues" card | `/reports?status=Resolved`, showing 6 findings |
| C3 | M | Click "Review overdue findings →" | `/reports?overdue=true`. "Overdue only" is checked and 4 findings are shown (F-1001, F-1006, F-1013, F-1020) |
| C4 | M | Click the "High" row in the Risk Distribution legend | `/reports?severity=High`, showing 9 findings |
| C5 | M | Click "Acknowledge" on ALT-9921 | The button becomes "✔ Acknowledged" and the row is dimmed. The header shows "4 awaiting acknowledgement". Toast: "Alert ALT-9921 acknowledged" (blue), which disappears after about 4 s |
| C6 | m | Tick "Unacknowledged only" | ALT-9908 is hidden, leaving 5 alerts. Untick it and all 6 come back |
| C7 | m | Acknowledge all 5 pending alerts, then tick "Unacknowledged only" | Empty state: "No unacknowledged alerts. 🎉" |
| C8 | m | Click "All findings →" | Navigates to `/reports` |
| C9 | m | Hover over a clickable KPI card | The card lifts slightly. Non-clickable cards (Total Assets, Open Incidents) do not react |

## D. Security Reports – table, search, filters, sorting

| # | Sev | Steps | Expected result |
|---|---|---|---|
| D1 | C | Open `/reports` | "Showing 30 of 30 findings". Default sort is Severity ▼ (critical first, ties by ID): first row F-1001, last row F-1030 |
| D2 | M | Check a row | Columns: ID, Finding (title + "asset · owner"), Severity badge, Status, Domain, CVSS (1 decimal), Discovered and Due Date (`dd MMM yyyy`). The left border is coloured by severity |
| D3 | M | Check overdue rows | F-1001, F-1006, F-1013 and F-1020 show a red due date and an "Overdue" tag. F-1017 (due 18 Nov 2026) is **not** overdue |
| D4 | C | Type `sql` in Search | 1 result: F-1005 |
| D5 | M | Search `PRIYA` | 6 results (search ignores case) |
| D6 | M | Search `web-app` | 4 results: F-1001, F-1011, F-1016, F-1029 |
| D7 | M | Search `cloud` | 5 results (matches on domain) |
| D8 | m | Click × in the search box | The search is cleared, 30 results show, and the search box keeps focus |
| D9 | m | Press `/` outside an input | The search box gets focus |
| D10 | C | Severity = Critical | 5 results |
| D11 | C | Status = Open / In Progress / Resolved / Accepted Risk | 15 / 6 / 6 / 3 results |
| D12 | M | Severity = Critical **and** Status = Open | 2 results: F-1001, F-1003 |
| D13 | M | Severity = High **and** Status = Open | 5 results: F-1006, F-1008, F-1009, F-1011, F-1013 |
| D14 | M | Overdue only + Severity = High | 2 results: F-1006, F-1013 |
| D15 | M | Search `zzz` | "Showing 0 of 30 findings" and "No findings match the current filters." |
| D16 | M | Set any filter, then click "Reset filters" | All filters cleared and 30 results. The button is disabled when no filter is active. Any query params are removed from the URL |
| D17 | C | Click the "CVSS" header | Ascending: first rows F-1028 (2.4) and F-1030 (2.7). The header shows ▲ |
| D18 | C | Click the "CVSS" header again | Descending: F-1001 (9.8), F-1005 (9.4), F-1002 (9.1). The header shows ▼ |
| D19 | M | Click "Finding" (title) | Ascending: first F-1029 "Cookie missing Secure flag", then F-1011. Last F-1008 "Weak TLS…" |
| D20 | M | Click "Due Date" | Ascending: F-1014, F-1018, F-1004 |
| D21 | m | Click "ID" twice | Descending: first row F-1030 |
| D22 | M | Sort plus filter together | Sorting applies to the filtered rows, and filtering keeps the current sort |

## E. Finding details & status update

| # | Sev | Steps | Expected result |
|---|---|---|---|
| E1 | C | Click row F-1001 | URL becomes `/reports/F-1001` (existing query params are kept). A drawer slides in from the right over a dimmed backdrop and the row is highlighted |
| E2 | M | Check the drawer content | ID, title, Critical badge, "Open" status, "**Overdue by 7 days**". Domain Application Security, Asset web-app-07, Owner Priya Sharma, CVSS 9.8, Discovered 28 Oct 2026, Due 11 Nov 2026. Description, remediation, and 1 history entry ("Open", 28 Oct 2026, 10:00, by Automated Scanner) |
| E3 | m | Open F-1003 / F-1017 / F-1002 | Due text reads "Due in 1 day" / "Due today" / "Due in 2 days" |
| E4 | C | Open `/reports/F-1001` directly | The page loads with the table and the open drawer |
| E5 | M | Open `/reports/F-9999` | Drawer shows "Finding not found" and "No finding exists with ID F-9999." |
| E6 | M | Close the drawer with ×, the backdrop, or the Esc key | URL returns to `/reports` and keeps the query params. The filters are unchanged |
| E7 | C | Open F-1001 without changing anything | "Update status" is disabled. The status select shows the current status "Open" |
| E8 | M | Pick "Resolved" and type `fix` | The button stays disabled. Error: "Comment must be at least 10 characters." Counter shows 3/300 |
| E9 | M | Type a comment, then clear it | Error: "Comment is required." |
| E10 | M | Keep the status as "Open" and type a valid comment | Error: "Select a status different from the current status." The button is disabled |
| E11 | C | Pick "Resolved", type `Patched Struts to 2.5.33`, and submit | Toast: `Finding F-1001 updated to "Resolved"` (green). The status badge changes to Resolved and the overdue styling disappears. History gains a new top entry ("Resolved", the comment, by Security Analyst). The form resets and the button is disabled. The table row now shows Resolved |
| E12 | C | After E11, go to the Dashboard | Critical **3**, Resolved Issues **7**, overdue banner **3**, donut **20**, Application Security **4** open findings |
| E13 | M | After E11, reload the page | All data returns to its original values (no persistence) |

## F. CSV export

| # | Sev | Steps | Expected result |
|---|---|---|---|
| F1 | C | Click "Export CSV" with no filters | Downloads `security-findings-<today>.csv` with a header row and 30 data rows, in the current sort order. Toast: "Exported 30 findings to security-findings-<today>.csv" |
| F2 | C | Check the CSV header | `ID,Title,Severity,Status,Domain,Asset,Owner,CVSS,Discovered On,Due Date` |
| F3 | M | Check the F-1001 row | `F-1001,Remote code execution in Apache Struts,Critical,Open,Application Security,web-app-07,Priya Sharma,9.8,2026-10-28,2026-11-11` |
| F4 | M | Filter Severity = Critical, then export | 5 data rows only |
| F5 | m | Search `zzz`, then export | No download. Red toast: "No findings to export" |
| F6 | m | Values that contain commas or quotes | Quoted per RFC 4180 (see the unit test) |

## G. Automated unit tests

`npm run test:ci` must report **24 of 24 passing**:

| Spec | What it covers |
|---|---|
| `security-data.service.spec.ts` (7) | KPIs, distribution, overdue logic, status update, alerts |
| `finding-query.service.spec.ts` (7) | search, filters, sorting, sort toggling |
| `csv-export.service.spec.ts` (3) | header and rows, escaping, file name |
| `pipes.spec.ts` (3) | relativeTime, truncate, dueStatus |
| `stat-card.component.spec.ts` (2) | rendering, conditional `cardClick` output |
| `app.component.spec.ts` (2) | shell navigation and sidebar toggle |

The migrated app should port these tests and get the same results.

## H. Acceptance summary

| Criterion | Verified by |
|---|---|
| Builds and runs | A1–A2 |
| Both pages retained | A5, B*, D1 |
| UI and navigation preserved | A*, C1–C4, E1, E6 (compare screenshots at 1440 px wide) |
| Same mock data and business logic | B1–B13, D3, E3, G |
| Search, filter, sort and other interactions preserved | C5–C7, D4–D22, E7–E11, F* |
| Equivalent Svelte constructs | `ANGULAR_FEATURE_COVERAGE.md` checklist |
| No critical regressions | All **C** scenarios pass |
