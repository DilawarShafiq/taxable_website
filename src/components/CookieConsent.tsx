"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "taxable_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6">
      <div className="mx-auto max-w-5xl bg-background border rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium mb-0.5">We use cookies</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use essential cookies to make our site work, and optional analytics cookies to understand how you use it.
              All data is handled in compliance with{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                GDPR, CCPA and our Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2 hidden sm:flex">
            <Shield className="h-3.5 w-3.5" />
            <span>No data sold</span>
          </div>
          <Button variant="outline" size="sm" onClick={decline} className="h-8 text-xs">
            Decline
          </Button>
          <Button size="sm" onClick={accept} className="h-8 text-xs">
            Accept All
          </Button>
          <button onClick={decline} className="ml-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
