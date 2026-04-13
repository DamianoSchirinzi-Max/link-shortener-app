"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLinkAction } from "./actions";

export function CreateLinkDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [errors, setErrors] = useState<{ url?: string[]; shortCode?: string[] }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setUrl("");
      setShortCode("");
      setErrors({});
      setServerError(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    startTransition(async () => {
      const result = await createLinkAction({ url, shortCode });

      if (result.error) {
        if (typeof result.error === "string") {
          setServerError(result.error);
        } else {
          setErrors(result.error as { url?: string[]; shortCode?: string[] });
        }
        return;
      }

      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isPending}
              required
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url[0]}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shortCode">Short Code</Label>
            <Input
              id="shortCode"
              placeholder="my-link"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              disabled={isPending}
              required
            />
            {errors.shortCode && (
              <p className="text-sm text-destructive">{errors.shortCode[0]}</p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}
          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Creating..." : "Create Link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
