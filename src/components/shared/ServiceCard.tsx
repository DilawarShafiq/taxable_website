"use client";

import Link from "next/link";
import { ArrowRight, FileText, Calculator, ClipboardCheck, BookOpen, LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/types";

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  Calculator,
  ClipboardCheck,
  BookOpen,
  FileText,
};

interface ServiceCardProps {
  service: Service;
  featured?: boolean;
}

export function ServiceCard({ service, featured = false }: ServiceCardProps) {
  // Get icon from map or use default
  const IconComponent = iconMap[service.icon] || FileText;

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${featured ? 'border-primary/50' : ''}`}>
      {featured && (
        <div className="absolute top-4 right-4">
          <Badge variant="default">Popular</Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
          <IconComponent className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{service.name}</CardTitle>
        <CardDescription className="text-base">{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {service.benefits.slice(0, 4).map((benefit, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="mr-2 text-green-500">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href={service.ctaLink} className="w-full">
          <Button variant="outline" className="w-full group">
            {service.ctaText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
