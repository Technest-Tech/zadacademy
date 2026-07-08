# File Structure — Management System

The system **adds** files to the existing monorepo. It does not move anything that already exists. Every system file lives behind one of three markers so it cannot collide with public-site code:

| Marker | Where |
|---|---|
| `(system)` route group | Next.js — `frontend/src/app/(system)/…` |
| `system/` subfolder | Next.js — `frontend/src/components/system/…`, `frontend/src/lib/system/…` |
| `System\` namespace + `system/` subfolder | Laravel — `app/Http/Controllers/System/`, `app/Models/System/`, `app/Services/System/` |
| `sys_` table prefix | MySQL — every system-owned table |

If a file lacks all four markers it's a **shared primitive** and must be safe for both surfaces to use.

---

## Top-level (unchanged)

```
site/
├── frontend/                  # Next.js 15 — adds (system) route group
├── backend/                   # Laravel 11 — adds System/ namespace + sys_ tables
├── docs/
│   ├── README.md              # Site doc index (existing)
│   ├── …existing site docs…
│   └── system/                # ← THIS folder
│       ├── README.md
│       ├── ARCHITECTURE.md
│       ├── FILE-STRUCTURE.md  ← this file
│       ├── TECH-STACK.md
│       ├── DESIGN-SYSTEM.md
│       ├── DATABASE.md
│       └── sprints/
│           ├── README.md
│           ├── sys-01-foundation.md
│           ├── sys-02-auth-rbac-dashboard.md
│           └── …sys-03 → sys-08…
├── system-requirments.md      # 21-module spec (existing source of truth)
├── README.md
└── TODO.md
```

---

## Frontend additions (`site/frontend/`)

```
frontend/src/
├── app/
│   ├── (marketing)/           # ← existing — DO NOT modify for system work
│   │   └── …site pages…
│   │
│   ├── (system)/              # ← NEW — every system page lives here
│   │   ├── layout.tsx         # System shell: sidebar + topbar + auth guard
│   │   ├── page.tsx           # Redirects to /dashboard for any logged-in user
│   │   │
│   │   ├── login/page.tsx     # Public route inside the system shell (no auth)
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/[token]/page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── leads/             # Module 2 — CRM
│   │   │   ├── page.tsx       # Pipeline view + table
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx  # Lead detail + follow-ups + convert to student
│   │   │
│   │   ├── students/          # Module 3
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx              # Profile
│   │   │       ├── timeline/page.tsx
│   │   │       ├── invoices/page.tsx
│   │   │       ├── sessions/page.tsx
│   │   │       └── reports/page.tsx
│   │   │
│   │   ├── teachers/          # Module 4
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   ├── leave/page.tsx            # Leave-management calendar
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── courses/           # Module 5 (system view of shared catalog)
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── schedule/          # Module 7
│   │   │   ├── page.tsx                  # Calendar (day / week / teacher / room)
│   │   │   └── conflicts/page.tsx
│   │   │
│   │   ├── attendance/        # Module 8
│   │   │   └── page.tsx
│   │   │
│   │   ├── session-reports/   # Module 9
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── quality/           # Module 10
│   │   │   └── page.tsx
│   │   │
│   │   ├── billing/           # Module 11
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx          # Manual / advance invoice
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   └── overdue/page.tsx
│   │   │
│   │   ├── payroll/           # Modules 12, 13
│   │   │   ├── page.tsx                  # Monthly summary
│   │   │   ├── [month]/page.tsx          # YYYY-MM detail
│   │   │   └── teacher/[id]/page.tsx
│   │   │
│   │   ├── accounting/        # Module 14
│   │   │   ├── revenue/page.tsx
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── profit-loss/page.tsx
│   │   │   ├── collection/page.tsx
│   │   │   ├── cancellations/page.tsx
│   │   │   ├── trials/page.tsx
│   │   │   └── monthly-report/page.tsx
│   │   │
│   │   ├── notifications/     # Module 15
│   │   │   ├── page.tsx                  # Internal alerts inbox
│   │   │   ├── delivery-log/page.tsx
│   │   │   └── templates/page.tsx
│   │   │
│   │   ├── whatsapp-groups/   # Module 16
│   │   │   └── page.tsx
│   │   │
│   │   ├── certificates/      # Module 17
│   │   │   ├── page.tsx
│   │   │   └── new/page.tsx
│   │   │
│   │   ├── teacher/           # Module 19 — teacher-only routes (role middleware)
│   │   │   ├── today/page.tsx
│   │   │   ├── upcoming/page.tsx
│   │   │   ├── students/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   ├── salary/page.tsx
│   │   │   └── leave/page.tsx
│   │   │
│   │   ├── settings/          # Module 20
│   │   │   ├── pricing/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── integrations/page.tsx     # Paymob / Zoom / wassender / Resend
│   │   │   ├── academy/page.tsx          # Branding, contact, timezone
│   │   │   ├── expense-categories/page.tsx
│   │   │   └── users/page.tsx            # Admin/Supervisor account management
│   │   │
│   │   └── audit-log/         # Module 21
│   │       └── page.tsx
│   │
│   ├── api/                   # ← existing site BFF routes (unchanged)
│   ├── layout.tsx             # ← existing root layout
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── ui/                    # ← shared shadcn primitives (DO NOT duplicate)
│   ├── layout/                # ← site-only layout (Navbar, Footer, WhatsApp)
│   ├── home/, course/, …      # ← site-only (unchanged)
│   ├── forms/                 # ← shared TrialBookingForm + system-specific forms allowed
│   │
│   └── system/                # ← NEW — system-only components
│       ├── shell/
│       │   ├── Sidebar.tsx
│       │   ├── Topbar.tsx
│       │   ├── CommandPalette.tsx        # ⌘K quick nav (Module 18 nice-to-have)
│       │   ├── NotificationBell.tsx
│       │   ├── UserMenu.tsx
│       │   └── Breadcrumbs.tsx
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   ├── ForgotPasswordForm.tsx
│       │   └── RoleGuard.tsx
│       ├── dashboard/
│       │   ├── KpiCard.tsx
│       │   ├── AlertsPanel.tsx
│       │   ├── RevenueChart.tsx
│       │   ├── StudentGrowthChart.tsx
│       │   ├── ConversionFunnel.tsx
│       │   └── QuickActions.tsx
│       ├── leads/
│       │   ├── LeadKanban.tsx            # Drag pipeline
│       │   ├── LeadTable.tsx
│       │   ├── LeadFollowUps.tsx
│       │   └── LeadConvertDialog.tsx
│       ├── students/
│       │   ├── StudentTable.tsx
│       │   ├── StudentForm.tsx
│       │   ├── StudentTimeline.tsx
│       │   ├── StudentStatusBadge.tsx
│       │   ├── FamilyLinkPicker.tsx
│       │   └── WalletPanel.tsx
│       ├── teachers/
│       │   ├── TeacherTable.tsx
│       │   ├── TeacherForm.tsx
│       │   ├── AvailabilityPicker.tsx
│       │   ├── TeacherLeaveCalendar.tsx
│       │   └── PerMinuteRateInput.tsx
│       ├── schedule/
│       │   ├── CalendarView.tsx          # FullCalendar wrapper
│       │   ├── SessionDrawer.tsx
│       │   ├── ConflictBanner.tsx
│       │   └── RecurringPatternBuilder.tsx
│       ├── attendance/
│       │   ├── AttendanceMarker.tsx
│       │   └── MakeupSessionPicker.tsx
│       ├── session-reports/
│       │   ├── ReportForm.tsx
│       │   └── ReportTimeline.tsx
│       ├── billing/
│       │   ├── InvoiceTable.tsx
│       │   ├── InvoiceForm.tsx
│       │   ├── ProRataCalculator.tsx
│       │   ├── PaymentDialog.tsx
│       │   └── WalletAdjustmentDialog.tsx
│       ├── payroll/
│       │   ├── PayrollTable.tsx
│       │   ├── BonusDeductionForm.tsx
│       │   └── SalaryStatement.tsx       # Reused on teacher dashboard
│       ├── accounting/
│       │   ├── RevenueChart.tsx
│       │   ├── ExpenseForm.tsx
│       │   ├── ProfitLossReport.tsx
│       │   └── ExportButton.tsx          # PDF / Excel
│       ├── notifications/
│       │   ├── NotificationList.tsx
│       │   ├── TemplateEditor.tsx        # Variable picker UX
│       │   └── DeliveryLogTable.tsx
│       ├── certificates/
│       │   ├── CertificateForm.tsx
│       │   └── CertificatePreview.tsx
│       ├── settings/
│       │   ├── SettingsLayout.tsx        # Tab-style nav for settings pages
│       │   ├── IntegrationCard.tsx
│       │   └── ExpenseCategoryEditor.tsx
│       └── primitives/                   # System-only patterns missing in shadcn
│           ├── DataTable.tsx             # TanStack Table wrapper, used everywhere
│           ├── PageHeader.tsx
│           ├── EmptyState.tsx
│           ├── ConfirmDialog.tsx
│           ├── DateRangePicker.tsx
│           ├── MoneyInput.tsx            # Currency-aware
│           ├── PhoneInput.tsx            # E.164 international
│           ├── CountrySelect.tsx
│           ├── TimezoneSelect.tsx
│           └── FilterBar.tsx
│
├── content/                   # ← site static content (unchanged)
│
├── lib/
│   ├── utils.ts               # ← shared helpers
│   ├── cn.ts
│   │
│   └── system/                # ← NEW
│       ├── api.ts             # Typed fetch wrapper for /api/system/*
│       ├── auth.ts            # useUser hook, server-side auth helpers
│       ├── permissions.ts     # can('students.edit', user) helper
│       ├── query-client.ts    # TanStack Query factory
│       ├── currency.ts        # USD/EUR/EGP… formatters per student
│       ├── timezone.ts        # convert + display in user's TZ
│       ├── proRata.ts         # Pure function, unit-tested
│       ├── nav.ts             # Sidebar config
│       └── routes.ts          # Type-safe link helpers
│
├── hooks/
│   └── system/
│       ├── useStudents.ts
│       ├── useTeachers.ts
│       ├── useInvoices.ts
│       ├── useSchedule.ts
│       ├── usePermissions.ts
│       └── useNotifications.ts
│
├── types/
│   └── system/
│       ├── index.ts                      # Barrel export
│       ├── student.ts
│       ├── teacher.ts
│       ├── lead.ts
│       ├── session.ts
│       ├── invoice.ts
│       ├── payroll.ts
│       ├── expense.ts
│       └── settings.ts
│
├── styles/
│   ├── globals.css            # ← shared (existing)
│   └── system.css             # ← NEW — system-only utilities (sidebar widths, etc.)
│
└── middleware.ts              # ← UPDATED — adds host-based rewrites for app.*
```

### Key conventions

1. **`(system)` is a Next.js route group** — the parentheses mean the URL doesn't include `/system`, but the layout, error boundary, and not-found are all isolated.
2. **`middleware.ts` rewrites** `host = app.zadacademiq.com` to `/(system)/...` and rewrites everything else to `/(marketing)/...`. A request for `app.*/students` becomes `app/(system)/students/page.tsx`.
3. **Shared = small primitives only.** A heuristic: if the component renders chrome, copy, or branding for one surface, it goes in that surface's folder. If it's a Button, Card, Input, Dialog, etc., it's `components/ui` and shared.
4. **No barrel `index.ts` from `(system)` root.** Direct imports keep the bundler from accidentally pulling system code into marketing pages.

---

## Backend additions (`site/backend/`)

```
backend/
├── app/
│   ├── Console/
│   │   ├── Kernel.php                              # ← UPDATED with system schedules
│   │   └── Commands/
│   │       ├── …existing site commands…
│   │       └── System/
│   │           ├── GenerateMonthlyInvoices.php     # Module 11
│   │           ├── CalculatePayroll.php            # Module 12
│   │           ├── DispatchSessionReminders.php    # Module 15
│   │           ├── CheckMissingReports.php         # Module 9
│   │           ├── AutoSuspendNonPayers.php        # Module 11
│   │           ├── GenerateMonthlyReport.php       # Module 14
│   │           └── BackfillTrialBookingsAsLeads.php
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/                                # ← existing site controllers
│   │   │   └── System/                             # ← NEW
│   │   │       ├── AuthController.php
│   │   │       ├── DashboardController.php
│   │   │       ├── LeadController.php
│   │   │       ├── StudentController.php
│   │   │       ├── TeacherController.php
│   │   │       ├── TeacherLeaveController.php
│   │   │       ├── CourseController.php
│   │   │       ├── ScheduleController.php
│   │   │       ├── SessionController.php
│   │   │       ├── AttendanceController.php
│   │   │       ├── SessionReportController.php
│   │   │       ├── QualityController.php
│   │   │       ├── InvoiceController.php
│   │   │       ├── PaymentController.php
│   │   │       ├── WalletController.php
│   │   │       ├── PayrollController.php
│   │   │       ├── ExpenseController.php
│   │   │       ├── AccountingController.php
│   │   │       ├── NotificationController.php
│   │   │       ├── MessageTemplateController.php
│   │   │       ├── WhatsAppGroupController.php
│   │   │       ├── CertificateController.php
│   │   │       ├── SettingsController.php
│   │   │       ├── UserController.php
│   │   │       ├── AuditLogController.php
│   │   │       └── ExportController.php
│   │   │
│   │   ├── Middleware/
│   │   │   ├── …existing site middleware…
│   │   │   └── System/
│   │   │       ├── EnsureSystemAuth.php            # Sanctum + role check
│   │   │       ├── EnsurePermission.php            # Spatie wrapper with audit log
│   │   │       └── LogSystemAction.php
│   │   │
│   │   ├── Requests/
│   │   │   └── System/                             # FormRequests per controller
│   │   │       ├── Auth/LoginRequest.php
│   │   │       ├── Student/StoreStudentRequest.php
│   │   │       └── …one folder per resource…
│   │   │
│   │   └── Resources/
│   │       └── System/                             # API Resources
│   │           ├── StudentResource.php
│   │           ├── StudentDetailResource.php
│   │           └── …one per response shape…
│   │
│   ├── Models/
│   │   ├── User.php                                # ← shared
│   │   ├── Course.php                              # ← shared
│   │   ├── BlogPost.php                            # ← shared (site CMS)
│   │   ├── TrialBooking.php                        # ← shared (site form)
│   │   ├── ContactMessage.php                      # ← shared
│   │   │
│   │   └── System/                                 # ← NEW
│   │       ├── Lead.php
│   │       ├── LeadFollowUp.php
│   │       ├── Student.php
│   │       ├── StudentTimelineEntry.php
│   │       ├── StudentFamilyLink.php
│   │       ├── Teacher.php
│   │       ├── TeacherAvailability.php
│   │       ├── TeacherLeave.php
│   │       ├── Session.php
│   │       ├── SessionReport.php
│   │       ├── Attendance.php
│   │       ├── MakeupSession.php
│   │       ├── Invoice.php
│   │       ├── InvoiceLine.php
│   │       ├── Payment.php
│   │       ├── WalletTransaction.php
│   │       ├── Payroll.php
│   │       ├── PayrollAdjustment.php               # Bonuses + deductions
│   │       ├── Expense.php
│   │       ├── ExpenseCategory.php
│   │       ├── QualityReview.php
│   │       ├── Notification.php
│   │       ├── MessageTemplate.php
│   │       ├── WhatsAppGroup.php
│   │       ├── WassenderLog.php
│   │       ├── Certificate.php
│   │       ├── Setting.php
│   │       └── AuditLog.php
│   │
│   ├── Policies/
│   │   └── System/                                 # ← NEW
│   │       ├── StudentPolicy.php
│   │       ├── TeacherPolicy.php
│   │       └── …one per resource where teachers/supervisors are scoped…
│   │
│   ├── Services/
│   │   ├── …existing…
│   │   ├── Integrations/
│   │   │   ├── Paymob/
│   │   │   │   ├── PaymobClient.php
│   │   │   │   ├── PaymobWebhookHandler.php
│   │   │   │   └── Dto/
│   │   │   ├── Zoom/
│   │   │   │   ├── ZoomClient.php
│   │   │   │   └── MeetingFactory.php
│   │   │   └── Wassender/
│   │   │       ├── WassenderClient.php
│   │   │       └── TemplateRenderer.php
│   │   │
│   │   └── System/
│   │       ├── ProRataCalculator.php
│   │       ├── PriceCalculator.php
│   │       ├── PayrollCalculator.php
│   │       ├── InvoiceGenerator.php
│   │       ├── WalletService.php
│   │       ├── StudentLifecycle.php                # Trial→Active→Paused state machine
│   │       ├── ScheduleConflictDetector.php
│   │       └── CertificateRenderer.php
│   │
│   ├── Jobs/
│   │   └── System/
│   │       ├── ConvertTrialBookingToLead.php
│   │       ├── GenerateInvoicePdf.php
│   │       ├── SendInvoiceWhatsApp.php
│   │       ├── SendSessionReminder.php
│   │       ├── SendPaymentReminder.php
│   │       ├── SendReportReminder.php
│   │       ├── SuspendNonPayer.php
│   │       └── BuildMonthlyReport.php
│   │
│   ├── Listeners/
│   │   └── System/
│   │       ├── LogStudentChange.php                # Writes timeline
│   │       ├── NotifyTeacherOnStudentStatus.php
│   │       └── NotifyAdminOnLeadCreated.php
│   │
│   ├── Events/
│   │   └── System/
│   │       ├── StudentStatusChanged.php
│   │       ├── InvoiceCreated.php
│   │       ├── InvoicePaid.php
│   │       ├── PaymentReceived.php
│   │       ├── TeacherLeaveApproved.php
│   │       └── LeadCreated.php
│   │
│   ├── Notifications/
│   │   └── System/
│   │       ├── InvoiceCreatedNotification.php
│   │       ├── PaymentReminderNotification.php
│   │       └── …one per WhatsApp/email template…
│   │
│   └── Support/
│       └── System/
│           ├── Currency/
│           │   ├── CurrencyConverter.php
│           │   └── SupportedCurrencies.php
│           ├── Permissions/
│           │   ├── PermissionRegistry.php          # Single source of permission strings
│           │   └── DefaultRoles.php
│           └── Timezones.php
│
├── routes/
│   ├── api.php                                     # ← existing public site API
│   ├── web.php                                     # ← existing
│   ├── console.php                                 # ← existing
│   ├── channels.php                                # ← existing
│   └── system.php                                  # ← NEW — all /api/system/* routes
│
├── config/
│   ├── …existing…
│   ├── auth.php                                    # ← UPDATED — adds 'system' guard
│   ├── sanctum.php                                 # ← UPDATED — adds app.* domain
│   ├── permission.php                              # ← NEW (Spatie)
│   ├── system.php                                  # ← NEW — system runtime config
│   └── integrations.php                            # ← NEW — Paymob/Zoom/wassender keys
│
├── database/
│   ├── migrations/
│   │   ├── …existing site migrations…
│   │   ├── 2026_06_01_000001_create_permission_tables.php
│   │   ├── 2026_06_01_000002_create_sys_leads_table.php
│   │   ├── 2026_06_01_000003_create_sys_students_table.php
│   │   ├── …one migration per sys_ table, see DATABASE.md…
│   │   └── 2026_06_01_999999_seed_system_baseline.php
│   │
│   ├── factories/
│   │   └── System/
│   │       └── …one factory per Model…
│   │
│   └── seeders/
│       ├── …existing…
│       └── System/
│           ├── SystemSeeder.php                    # Master seeder
│           ├── RolePermissionSeeder.php
│           ├── ExpenseCategorySeeder.php
│           ├── MessageTemplateSeeder.php
│           └── DemoDataSeeder.php                  # Local-dev only
│
├── tests/
│   ├── Feature/
│   │   ├── …existing site tests…
│   │   └── System/
│   │       ├── Auth/LoginTest.php
│   │       ├── Students/CreateStudentTest.php
│   │       ├── Billing/GenerateInvoiceTest.php
│   │       ├── Payroll/CalculatePayrollTest.php
│   │       ├── Schedule/ConflictDetectionTest.php
│   │       └── …one Feature test folder per module…
│   │
│   └── Unit/
│       └── System/
│           ├── ProRataCalculatorTest.php
│           ├── PriceCalculatorTest.php
│           └── PayrollCalculatorTest.php
│
└── storage/
    └── app/
        └── system/
            ├── invoices/                           # Generated PDFs
            ├── certificates/
            ├── exports/                            # CSV/Excel exports
            └── monthly-reports/
```

### Key conventions

1. **`routes/system.php` is loaded by `RouteServiceProvider`** with the `/api/system` prefix and `system` middleware group (`api`, `auth:sanctum`, `system.role`).
2. **`App\Http\Controllers\System\*` controllers extend a `BaseSystemController`** which handles common things like resolving `auth()->user()` permissions and writing audit-log entries.
3. **Models in `App\Models\System\*` set `$table = 'sys_…'` explicitly** so model name and table name don't have to match.
4. **Permission strings live in `App\Support\System\Permissions\PermissionRegistry`** — one constant per permission, never hardcoded as raw strings in middleware/policies.
5. **All Filament resources live in `app/Filament/System/Resources/`** if Filament gets used at all — but the v1 plan is shadcn/Next.js for everything, with Filament reserved for emergency tooling.
6. **Tests mirror the controller folder**: `tests/Feature/System/Students/...` for `Controllers/System/StudentController`.

---

## Conflict-prevention checklist

Before merging any system PR, verify:

- [ ] No file outside the markers above was renamed or moved.
- [ ] No site-only file (anything in `(marketing)`, `Api\Controllers`, root model namespace) imports anything from `(system)` or `System\`.
- [ ] No new top-level shared component was added without explicit review (the bar for shared is high).
- [ ] Every new DB table is prefixed `sys_` (or has a documented exception in [DATABASE.md](DATABASE.md)).
- [ ] Every new public route uses `/api/system/*` and is registered in `routes/system.php`, not `routes/api.php`.
- [ ] `middleware.ts` host-rewrite rules are unchanged unless intentionally updated.

CI runs a script (`scripts/check-system-isolation.sh`, added in SYS-01) that fails the build if any of the above are violated.

---

*Last updated: May 10, 2026*
