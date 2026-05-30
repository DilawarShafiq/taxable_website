import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/ContactForm";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Taxable AI for expert chartered accountancy services. We're here to help with your taxation, audit, and accounting needs.",
};

const offices = [
  {
    region: "Pakistan",
    flag: "🇵🇰",
    email: "pk@taxable.ai",
    phone: null,
    address: "Karachi, Pakistan",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM PKT",
  },
  {
    region: "United Kingdom",
    flag: "🇬🇧",
    email: "uk@taxable.ai",
    phone: null,
    address: "London, UK",
    hours: "Mon-Fri: 9:00 AM - 5:30 PM GMT",
  },
  {
    region: "United States",
    flag: "🇺🇸",
    email: "usa@taxable.ai",
    phone: null,
    address: "New York, USA",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM EST",
  },
  {
    region: "Saudi Arabia",
    flag: "🇸🇦",
    email: "sa@taxable.ai",
    phone: null,
    address: "Riyadh, Saudi Arabia",
    hours: "Sun-Thu: 8:00 AM - 5:00 PM AST",
  },
  {
    region: "UAE",
    flag: "🇦🇪",
    email: "uae@taxable.ai",
    phone: null,
    address: "Dubai, UAE",
    hours: "Sun-Thu: 9:00 AM - 6:00 PM GST",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Ready to transform your finances? Get in touch with our expert team
              for a personalized consultation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <AnimatedSection>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Contact Info */}
            <div className="space-y-6">
              <AnimatedSection delay={0.1}>
                <h2 className="text-2xl font-bold mb-6">Our Global Offices</h2>
              </AnimatedSection>
              {offices.map((office, index) => (
                <AnimatedSection key={office.region} delay={0.1 + index * 0.05}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{office.flag}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{office.region}</h3>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${office.email}`} className="hover:text-foreground">
                                {office.email}
                              </a>
                            </div>
                            {office.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${office.phone}`} className="hover:text-foreground">
                                {office.phone}
                              </a>
                            </div>
                            )}
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{office.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{office.hours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
