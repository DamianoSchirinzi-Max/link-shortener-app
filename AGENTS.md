# Agent Instructions - Link Shortener App

This is a Next.js 16+ URL shortening application with authentication, database persistence, and modern UI components.

## 🚨 Critical Rules

### Next.js Version Alert
**This is NOT the Next.js you know.** This project uses Next.js 16.2.3, which has breaking changes from earlier versions. Always consult `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

### Tech Stack
- **Framework**: Next.js 16.2.3 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React

## 📚 Detailed Instructions

> ## 🛑 STOP — MANDATORY BEFORE WRITING ANY CODE
> **You MUST read the relevant file(s) from the `/docs` directory before generating a single line of code.**
> Skipping this step is not allowed under any circumstances — even for trivial changes.
> If you are unsure which doc applies, read all of them.

1. **[Authentication Rules](docs/authentication-rules.md)** ⚠️ **READ THIS FIRST, EVERY TIME** - Clerk-only auth, protected routes, modal sign-in/up
2. **[UI Components Rules](docs/ui-components-rules.md)** - shadcn/ui-only components, no custom UI primitives

**Failure to read the relevant `/docs` file before writing code is a critical violation of these instructions.**


## 🎯 Project-Specific Conventions

### File Organization
```
app/              # Next.js App Router pages & layouts
  layout.tsx      # Root layout with Clerk provider
  page.tsx        # Homepage
components/       # React components
  ui/             # shadcn/ui components (DO NOT manually edit)
db/               # Database configuration
  schema.ts       # Drizzle schema definitions
  index.ts        # Database client instance
lib/              # Utility functions
  utils.ts        # cn() helper for class merging
```

### Path Aliases
- Use `@/*` to import from project root: `import { db } from "@/db"`

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```
See [authentication-rules.md](docs/authentication-rules.md) for details.

## ⚡ Quick Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit migrate   # Run migrations
npx drizzle-kit studio    # Open Drizzle Studio
```

## 🔍 When Adding Features

> ### 🚫 DO NOT WRITE CODE UNTIL STEPS 1–2 ARE COMPLETE

1. 🛑 **MANDATORY: Read [authentication-rules.md](docs/authentication-rules.md)** — no exceptions, even if you think you know the rules
2. 🛑 **MANDATORY: Read [ui-components-rules.md](docs/ui-components-rules.md)** — no exceptions, even for small UI changes
3. ✅ Check if similar patterns exist in the codebase
4. ✅ Confirm all relevant `/docs` guides have been read before proceeding
5. ✅ Verify Next.js 16+ compatibility
6. ✅ Use TypeScript strict mode (no `any` types)
7. ✅ Follow existing naming conventions
8. ✅ Use Server Components by default
9. ✅ Add `"use client"` only when necessary
10. ✅ **NEVER** implement authentication outside of Clerk
11. ✅ **NEVER** create custom UI components - use shadcn/ui
