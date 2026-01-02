"use client";

import { Star, Building2, Users, Globe, TrendingUp, MessageSquare, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { icon: Building2, value: "—", label: "Clients Served", comingSoon: true },
  { icon: Globe, value: "5", label: "Countries", comingSoon: false },
  { icon: Users, value: "—", label: "Documents Processed", comingSoon: true },
  { icon: TrendingUp, value: "—", label: "Client Satisfaction", comingSoon: true },
];

const upcomingFeatures = [
  "Verified client testimonials",
  "Real-time review integration",
  "Video testimonials",
  "Case study highlights",
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Client Success Stories</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Leading Businesses Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of enterprises across 5 countries who trust Taxable AI
            for their chartered accountancy needs.
          </p>
        </AnimatedSection>

        {/* Stats Bar */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className={`text-2xl font-bold ${stat.comingSoon ? 'text-muted-foreground' : 'text-primary'}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                {stat.comingSoon && (
                  <span className="text-[10px] text-muted-foreground/60 block mt-1">Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Coming Soon Reviews Section */}
        <AnimatedSection delay={0.2}>
          <Card className="max-w-3xl mx-auto border-dashed border-2 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
                <MessageSquare className="h-8 w-8" />
              </div>

              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                <Clock className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>

              <h3 className="text-2xl font-bold mb-3">
                Real-Time Client Reviews
              </h3>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                We're building a live review system to showcase authentic feedback from our
                clients across Pakistan, UK, USA, Saudi Arabia, and UAE.
              </p>

              {/* Preview of what's coming */}
              <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                {upcomingFeatures.map((feature, index) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Placeholder review cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-muted/50 border border-dashed"
                  >
                    <div className="flex gap-1 justify-center mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-muted-foreground/30" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted-foreground/10 rounded w-full" />
                      <div className="h-2 bg-muted-foreground/10 rounded w-4/5 mx-auto" />
                      <div className="h-2 bg-muted-foreground/10 rounded w-3/5 mx-auto" />
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted-foreground/10" />
                      <div className="space-y-1">
                        <div className="h-2 bg-muted-foreground/10 rounded w-16" />
                        <div className="h-2 bg-muted-foreground/10 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
}
