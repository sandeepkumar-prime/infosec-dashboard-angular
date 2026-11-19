# Angular Feature Coverage

Inventory of the Angular constructs exercised by this application, where to find them, and the
construct a correct Svelte migration is expected to produce. Use it as a checklist when reviewing
the migrated code.

## 1. Architecture & modules

| Angular construct | Location | Expected Svelte equivalent |
|---|---|---|
| Root `NgModule` + `bootstrap` | `app.module.ts`, `main.ts` | `main.js` mounting `App.svelte` |
| Core module with `@Optional() @SkipSelf()` guard | `core/core.module.ts` | Removed; singletons become module-level stores |
| Shared module exporting declarations | `shared/shared.module.ts` | Removed; direct component imports |
| Lazy-loaded feature modules (`loadChildren`) | `app-routing.module.ts` | Route-level code splitting (e.g. dynamic `import()` / SvelteKit routes) |
| Feature routing modules (`forChild`) | `features/*/*-routing.module.ts` | Route table entries |

## 2. Routing & navigation

| Angular construct | Location | Expected Svelte equivalent |
|---|---|---|
| `redirectTo` / wildcard `**` | `app-routing.module.ts` | Redirect + fallback route |
| `routerLink`, `routerLinkActive` | `sidebar.component.html`, `dashboard.component.html` | Links + active-class logic based on current path |
| Child route with param `:id` + nested `<router-outlet>` | `reports-routing.module.ts`, `reports.component.html` | Nested route / param-driven drawer (`/reports/[id]`) |
| `ActivatedRoute.paramMap` | `finding-detail.component.ts` | Route params (store or `$page.params`) |
| `ActivatedRoute.queryParamMap` | `reports.component.ts` | URL search params |
| `Router.navigate` with `queryParams`, `relativeTo`, `queryParamsHandling: 'preserve'` | `dashboard.component.ts`, `reports.component.ts`, `finding-detail.component.ts` | `goto()` / router navigate preserving `?search` |
| `NavigationEnd` events + route `data.title` + `Title` service | `app.component.ts` | Reactive `document.title` / `<svelte:head><title>` |
| `scrollPositionRestoration` | `app-routing.module.ts` | Scroll-to-top on navigation |

## 3. Dependency injection & services

| Angular construct | Location | Expected Svelte equivalent |
|---|---|---|
| `@Injectable({ providedIn: 'root' })` | all `core/services/*` | Module singletons / Svelte stores |
| `InjectionToken` + `useValue` provider + `@Inject()` | `core/config/app-config.ts`, `core.module.ts` | Exported config constant or `setContext/getContext` |
| Service-to-service injection | `FindingQueryService` → `SecurityDataService` | Direct import |
| Injection into pipes | `relative-time.pipe.ts`, `due-status.pipe.ts` | Plain functions importing config |
| RxJS `BehaviorSubject` state | `security-data.service.ts`, `notification.service.ts` | `writable` stores |
| RxJS `map`, `combineLatest`, `switchMap`, `filter`, `startWith`, `takeUntil` | services, `reports.component.ts`, `finding-detail.component.ts` | `derived` stores / reactive `$:` statements |

## 4. Components & templates

| Angular construct | Location | Expected Svelte equivalent |
|---|---|---|
| `@Input()` | every shared component | `export let prop` |
| `@Output()` + `EventEmitter` | `stat-card`, `risk-distribution`, `recent-alerts`, `findings-filter`, `findings-table`, header | `createEventDispatcher` or callback props |
| Content projection, default + `select="[panel-actions]"` | `panel.component.html` | Default `<slot>` + named `<slot name="actions">` |
| Inline `template` / `styles` vs `templateUrl` / `styleUrls` | `severity-badge`, `progress-bar`, `incident-trend` vs others | Single-file `.svelte` with scoped `<style>` |
| `:host` styling | `panel.component.css` | Wrapper element styling |
| Component getters as computed values | `donut-chart.gradient`, `bar-chart.maxValue`, `incident-trend.netChange`, `status-badge.cssClass` | `$:` reactive declarations |
| Lifecycle `OnInit`, `OnDestroy`, `OnChanges` | `reports`, `finding-detail`, `findings-filter`, `score-color` | `onMount`, `onDestroy`, reactive `$:` on props |
| `@ViewChild` (static) + `ElementRef` | `findings-filter.component.ts` | `bind:this` |
| `@HostListener('document:keydown')`, `('document:keydown.escape')` | `findings-filter`, `finding-detail` | `<svelte:window on:keydown>` / `<svelte:document>` |
| `@HostBinding` (class, attribute) | `severity-highlight.directive.ts` | Attributes/classes set directly on the element or an action |

## 5. Template syntax & built-in directives

| Angular construct | Location | Expected Svelte equivalent |
|---|---|---|
| Interpolation `{{ }}` | everywhere | `{ }` |
| Property binding `[prop]`, `[attr.x]`, `[class.x]`, `[style.x.px]`, `[style.width.%]` | stat-card, charts, table | `prop={}`, `class:x`, `style:width="{v}%"` |
| Event binding `(click)`, `(change)`, `(keydown.enter)`, `(ngSubmit)` | stat-card, recent-alerts, filter | `on:click`, `on:change`, key check, `on:submit|preventDefault` |
| `*ngFor` with `index`, `odd`, `trackBy` | bar-chart, findings-table, alerts | `{#each items as item, i (item.id)}` |
| `*ngIf` / `*ngIf … else` / `*ngIf="obs$ | async as x"` | dashboard, recent-alerts, finding-detail | `{#if}{:else}` + store auto-subscription `$store` |
| `[ngSwitch]` / `*ngSwitchCase` / `*ngSwitchDefault` | domain-overview, dashboard incidents | `{#if}{:else if}{:else}` |
| `[ngClass]` | stat-card, badges, toast | `class={...}` / `class:` |
| `<ng-container>`, `<ng-template #ref>` | dashboard, finding-detail, recent-alerts | `{#if}` blocks (no wrapper element) |

## 6. Forms

| Angular construct | Location | Expected Svelte equivalent |
|---|---|---|
| Template-driven form: `FormsModule`, `ngForm`, `[(ngModel)]` + `(ngModelChange)` on text, select, checkbox | `findings-filter.component.html` | `bind:value`, `bind:checked` + change handler |
| Reactive form: `FormBuilder`, `FormGroup`, `formControlName`, `[ngValue]` | `finding-detail.component.ts/.html` | Local state variables + `bind:value` |
| Built-in validators `required`, `minLength`, `maxLength` | `finding-detail.component.ts` | Hand-written validation logic |
| Custom group validator (`statusChangedValidator`) | `finding-detail.component.ts` | Hand-written validation logic |
| `dirty` / `touched` / `markAllAsTouched` / `reset` / `ng-invalid` CSS | `finding-detail`, `styles.css` | Touched/dirty flags tracked manually |
| `[disabled]` bound to form validity | `finding-detail.component.html` | `disabled={!isValid}` |

## 7. Pipes

| Pipe | Kind | Location | Expected Svelte equivalent |
|---|---|---|---|
| `relativeTime` | custom, DI | `shared/pipes/relative-time.pipe.ts` | Formatter function |
| `truncate` (with args) | custom | `shared/pipes/truncate.pipe.ts` | Formatter function |
| `dueStatus` | custom, DI | `shared/pipes/due-status.pipe.ts` | Formatter function |
| `date` (with format + timezone `'UTC'`) | built-in | header, tables, detail | `Intl.DateTimeFormat` helper producing identical text |
| `number` (`'1.1-1'`, default grouping) | built-in | tables, KPI | `toFixed` / `toLocaleString('en-US')` |
| `percent` (`'1.0-0'`, `'1.1-1'`) | built-in | risk distribution, asset coverage | Percent formatter |
| `lowercase` | built-in | severity-badge | `.toLowerCase()` |
| `async` | built-in | dashboard, reports, toast | `$store` auto-subscription |

## 8. Custom directives

| Directive | Technique | Expected Svelte equivalent |
|---|---|---|
| `[appSeverityHighlight]` | `@Input` alias + `@HostBinding` class/attrs | Svelte action (`use:`) or inline attributes |
| `[appScoreColor]` | `ElementRef` + `Renderer2` + `OnChanges` | Svelte action with `update()` or inline `style:color` |

## 9. Testing

Jasmine/Karma specs (`*.spec.ts`, 24 tests): services, pipes, `StatCardComponent`, `AppComponent`.
Expected: equivalent tests (e.g. Vitest + @testing-library/svelte) asserting the same values.
