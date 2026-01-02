// Service types
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

export interface Service {
  id: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  icon: string;
  benefits: string[];
  processSteps: ProcessStep[];
  regions: string[];
  ctaText: string;
  ctaLink: string;
  featured: boolean;
  order: number;
}

// Region types
export interface Region {
  id: string;
  name: string;
  code: string;
  flag: string;
  authority: string;
  complianceInfo: string;
  services: string[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  operatingHours: string;
  currency: string;
}

// AI Agent types
export interface UseCase {
  title: string;
  description: string;
  outcome: string;
}

export interface AIAgent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  capabilities: string[];
  useCases: UseCase[];
  demoAvailable: boolean;
  demoLink?: string;
  featured: boolean;
  order: number;
}

// Team types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  credentials: string[];
  linkedin?: string;
  featured: boolean;
  order: number;
}

// Testimonial types
export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  quote: string;
  image?: string;
  region: string;
  service: string;
  featured: boolean;
  order: number;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
