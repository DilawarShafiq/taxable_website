"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Globe, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
            AI-Powered Accountancy Services
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Transform Your Finances with{" "}
            <span className="text-primary">AI-Powered</span> Chartered Accountancy
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Expert taxation, audits, and accounting services powered by cutting-edge AI.
            Serving businesses across Pakistan, UK, USA, Saudi Arabia, and UAE.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/demo">
              <Button size="xl" className="w-full sm:w-auto">
                Try AI Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Get a Quote
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 md:gap-8"
          >
            <div className="flex items-center text-sm text-muted-foreground">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Bank-Level Security
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Globe className="h-5 w-5 mr-2 text-blue-500" />
              5 Countries Served
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Bot className="h-5 w-5 mr-2 text-purple-500" />
              AI-Powered Analysis
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "—", label: "Clients Served", comingSoon: true },
            { value: "5", label: "Countries", comingSoon: false },
            { value: "—", label: "Client Satisfaction", comingSoon: true },
            { value: "24/7", label: "AI Support", comingSoon: false },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
                {stat.comingSoon && <span className="block text-xs text-primary/60">Coming Soon</span>}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
