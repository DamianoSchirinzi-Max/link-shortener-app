# Authentication Rules

## ⚠️ Critical Rules

### Clerk is the ONLY Auth Method
**NEVER implement alternative authentication methods.** This application uses Clerk exclusively for all authentication and user management. Do not add:
- Custom JWT authentication
- Session-based auth with cookies
- OAuth providers outside of Clerk
- Custom login/signup forms
- Any other authentication library

## Project-Specific Requirements

### 1. Protected Dashboard Route
The `/dashboard` route **MUST** require authentication:

```tsx
// app/dashboard/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return <>{children}</>;
}
```

### 2. Homepage Redirect for Authenticated Users
Logged-in users accessing the homepage (`/`) **MUST** be redirected to `/dashboard`:

```tsx
// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  
  // Redirect authenticated users to dashboard
  if (userId) {
    redirect("/dashboard");
  }
  
  // Show landing page for unauthenticated users
  return (
    <div>
      <h1>Welcome to Link Shortener</h1>
      {/* Landing page content */}
    </div>
  );
}
```

### 3. Modal Sign In/Sign Up
Sign in and sign up **MUST ALWAYS** launch as modals, never as full pages:

```tsx
// components/header.tsx
"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header>
      <nav>
        {/* ✅ CORRECT - Modal mode */}
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
        
        <SignUpButton mode="modal">
          <button>Sign Up</button>
        </SignUpButton>
      </nav>
    </header>
  );
}
```

**❌ DO NOT** create dedicated sign-in/sign-up pages like:
- `app/sign-in/page.tsx`
- `app/sign-up/page.tsx`

## Implementation Checklist

When implementing authentication features:

- [ ] Use Clerk components/hooks exclusively
- [ ] Protect `/dashboard` route with auth check
- [ ] Redirect authenticated users from `/` to `/dashboard`
- [ ] Set `mode="modal"` on all SignInButton and SignUpButton components
- [ ] Use `auth()` from `@clerk/nextjs/server` in Server Components
- [ ] Use `useAuth()` or `useUser()` in Client Components
- [ ] Never implement custom auth logic

## Common Patterns

### Protecting Server Actions
```tsx
"use server";

import { auth } from "@clerk/nextjs/server";

export async function createLink(url: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  // Proceed with authenticated action
}
```

### Conditional UI Based on Auth
```tsx
"use client";

import { Show } from "@clerk/nextjs";

export function Navigation() {
  return (
    <nav>
      {/* Only show for authenticated users */}
      <Show when="signed-in">
        <a href="/dashboard">Dashboard</a>
      </Show>
      
      {/* Only show for unauthenticated users */}
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </Show>
    </nav>
  );
}
```

### Getting User ID in Database Queries
```tsx
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Always scope queries to the authenticated user
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, userId),
  });
  
  return <LinksList links={userLinks} />;
}
```

## Environment Variables

Required Clerk environment variables:

```env
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Modal auth (no dedicated pages)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Best Practices

### ✅ DO
- Use Clerk exclusively for all authentication
- Protect the `/dashboard` route at the layout level
- Redirect authenticated users from homepage to dashboard
- Always use `mode="modal"` for sign in/up buttons
- Check `userId` in all Server Actions
- Scope all database queries to the authenticated user
- Use Clerk's `Show` component for conditional rendering

### ❌ DON'T
- Implement any custom authentication
- Create sign-in/sign-up page routes
- Allow unauthenticated access to `/dashboard`
- Let authenticated users stay on the homepage
- Use redirect mode for sign in/up
- Skip auth checks in Server Actions
- Trust client-side auth checks alone
- Expose other users' data

## Troubleshooting

### User can access dashboard without logging in
- Check that `app/dashboard/layout.tsx` has the auth check
- Verify the redirect is called if `!userId`
- Ensure the file is named `layout.tsx` (not `page.tsx`)

### Authenticated users see the homepage
- Check `app/page.tsx` has the redirect for authenticated users
- Verify `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard` in `.env.local`

### Sign in opens a new page instead of modal
- Verify `mode="modal"` is set on `SignInButton`
- Check that the component is a Client Component (`"use client"`)
- Ensure Clerk environment variables are properly configured
