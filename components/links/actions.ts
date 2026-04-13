"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLink, updateLink, deleteLink } from "@/data/links";

type CreateLinkInput = {
  url: string;
  shortCode: string;
};

type UpdateLinkInput = {
  id: number;
  url: string;
  shortCode: string;
};

type DeleteLinkInput = {
  id: number;
};

const linkSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters.")
    .max(20, "Short code must be at most 20 characters.")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed."),
});

const createLinkSchema = linkSchema;
const updateLinkSchema = linkSchema.extend({ id: z.number() });
const deleteLinkSchema = z.object({ id: z.number() });

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = createLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await createLink({ ...parsed.data, userId });
    return { success: true };
  } catch {
    return { error: "Failed to create link. Please try again." };
  }
}

export async function updateLinkAction(input: UpdateLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = updateLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateLink({ ...parsed.data, userId });
    return { success: true };
  } catch {
    return { error: "Failed to update link. Please try again." };
  }
}

export async function deleteLinkAction(input: DeleteLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = deleteLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Invalid request." };
  }

  try {
    await deleteLink({ id: parsed.data.id, userId });
    return { success: true };
  } catch {
    return { error: "Failed to delete link. Please try again." };
  }
}
