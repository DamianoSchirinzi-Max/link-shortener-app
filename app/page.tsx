import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Link2, Zap, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroCTA } from "@/components/hero-cta";

const features = [
  {
    icon: Link2,
    title: "Instant URL Shortening",
    description:
      "Turn any long, unwieldy URL into a clean, shareable short link in seconds. Perfect for social media, emails, and messaging.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Redirects happen in milliseconds. Built on a globally distributed infrastructure to ensure your links are always fast and reliable.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your links are yours. Manage, edit, or delete them at any time. Full control over your short URLs from a single dashboard.",
  },
];

const steps = [
  { step: "1", title: "Paste your URL", description: "Enter any long link into the shortener." },
  { step: "2", title: "Get your short link", description: "Receive a compact, shareable URL instantly." },
  { step: "3", title: "Share everywhere", description: "Share your short link across social media, emails, and messaging." },
];

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-36 gap-8">
        <Badge variant="secondary" className="text-sm px-4 py-1">
          Free to use · No credit card required
        </Badge>
        <div className="flex flex-col gap-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Shorten Links.{" "}
            <span className="text-muted-foreground">Amplify Reach.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create short, memorable links in seconds. Manage your URLs and share
            confidently — all from one simple dashboard.
          </p>
        </div>
        <HeroCTA />
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A powerful, yet simple toolset for managing and sharing your links.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get your first short link live in under a minute.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-center gap-4 md:gap-0">
            {steps.map(({ step, title, description }, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center text-center gap-4 flex-1">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                    {step}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-start justify-center pt-4 px-2 shrink-0">
                    <ArrowRight className="size-5 text-muted-foreground" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of users shortening links every day. It&apos;s free.
          </p>
          <HeroCTA />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Link Shortener. All rights reserved.</p>
      </footer>
    </div>
  );
}
