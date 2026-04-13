---
description: Read this before implementing or modifying any data mutations, server actions, or data access logic in the project.
---

# Server Actions Rules

## ⚠️ Critical Rules

### All Data Mutations MUST Use Server Actions
**NEVER perform data mutations outside of server actions.** Do not:
- Call Drizzle directly from components (server or client)
- Use API routes (`app/api/`) for mutations
- Mutate data in server components directly
- Use `fetch` to a custom endpoint for mutations

### Server Actions MUST Be Called from Client Components
Server actions must always be invoked from a `"use client"` component. Do not call server actions from server components.

### Server Action Files MUST Be Named `actions.ts`
Every server action file **must** be named `actions.ts` and **colocated** in the same directory as the client component that calls it.

```
components/
  links/
    create-link-form.tsx   ✅ client component
    actions.ts             ✅ colocated server actions file
```

## TypeScript Requirements

### Strongly Type All Inputs — Never Use `FormData`
All data passed into server actions must use explicit TypeScript types. **Do NOT use the `FormData` TypeScript type.**

```ts
// ✅ Correct
type CreateLinkInput = {
  url: string;
  shortCode: string;
};

export async function createLink(input: CreateLinkInput) { ... }

// ❌ Wrong
export async function createLink(formData: FormData) { ... }
```

## Error Handling

### NEVER Throw Errors — Always Return an Object
Server actions **must not** throw errors. Instead, always return a typed result object with either an `error` or `success` property. This keeps error handling predictable on the client.

```ts
// ✅ Correct
export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  // ...

  return { success: true };
}

// ❌ Wrong
export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized"); // DO NOT THROW
}
```

Wrap any operations that could fail (e.g. database calls) in a `try/catch` and return `{ error }` rather than letting exceptions propagate:

```ts
try {
  await createLinkForUser({ ...parsed.data, userId });
  return { success: true };
} catch {
  return { error: "Failed to create link. Please try again." };
}
```

## Validation

### All Inputs MUST Be Validated with Zod
Every server action must validate its input using a Zod schema before processing.

```ts
"use server";

import { z } from "zod";

const createLinkSchema = z.object({
  url: z.string().url(),
  shortCode: z.string().min(3).max(20).regex(/^[a-z0-9-]+$/),
});

export async function createLink(input: CreateLinkInput) {
  const parsed = createLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // continue...
}
```

## Authentication

### ALL Server Actions MUST Verify a Logged-In User First
Before any database operation, every server action **must** check for an authenticated user using Clerk. If no user is found, return early with an error — never proceed unauthenticated.

```ts
"use server";

import { auth } from "@clerk/nextjs/server";

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  // only now proceed with database operations
}
```

## Database Access

### Use Helper Functions from `/data` — Never Drizzle Directly
Server actions **must not** import or use Drizzle directly. All database queries must be wrapped in helper functions located in the `/data` directory.

```ts
// ✅ Correct — call a helper from /data
import { createLinkForUser } from "@/data/links";

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await createLinkForUser({ ...parsed.data, userId });
}

// ❌ Wrong — using Drizzle directly in the server action
import { db } from "@/db";
import { links } from "@/db/schema";

export async function createLink(input: CreateLinkInput) {
  await db.insert(links).values({ ...input }); // DO NOT DO THIS
}
```

### `/data` Helper Functions Wrap Drizzle Queries
The `/data` directory contains functions that encapsulate Drizzle queries. These are the **only** place Drizzle should be used.

```ts
// data/links.ts
import { db } from "@/db";
import { links } from "@/db/schema";

export async function createLinkForUser(input: {
  url: string;
  shortCode: string;
  userId: string;
}) {
  return db.insert(links).values(input);
}
```

## Complete Pattern Example

```
components/links/
  create-link-form.tsx   # "use client" — calls the server action
  actions.ts             # "use server" — validates, authenticates, delegates to /data
data/
  links.ts               # Drizzle queries only
```

```ts
// components/links/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLinkForUser } from "@/data/links";

type CreateLinkInput = {
  url: string;
  shortCode: string;
};

const schema = z.object({
  url: z.string().url(),
  shortCode: z.string().min(3).max(20),
});

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await createLinkForUser({ ...parsed.data, userId });
  return { success: true };
}
```
