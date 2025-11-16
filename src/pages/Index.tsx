import { HeroSection } from "@/components/sections/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ProposalsSection from "@/components/sections/ProposalsSection";
import ContactForm from "@/components/sections/ContactForm";
import ExperimentBoard from "@/components/sections/ExperimentBoard";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-sand">
      <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="text-xl font-bold text-foreground">AltruisticX<span className="text-climate-blue">AI</span></div>
              <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
                <button onClick={() => scrollToSection("experiments")} className="hover:text-foreground transition-colors">Experiments</button>
                <button onClick={() => scrollToSection("process")} className="hover:text-foreground transition-colors">Process</button>
                <button onClick={() => scrollToSection("testimonials")} className="hover:text-foreground transition-colors">Case Studies</button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="hidden md:inline text-sm text-muted-foreground hover:text-foreground">Lab Notebook</button>
              <Button onClick={() => scrollToSection("contact")}>Start a 4-Week Pilot</Button>
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-4">
                <button onClick={() => scrollToSection("experiments")} className="text-left text-muted-foreground hover:text-foreground">Experiments</button>
                <button onClick={() => scrollToSection("process")} className="text-left text-muted-foreground hover:text-foreground">Process</button>
                <button onClick={() => scrollToSection("testimonials")} className="text-left text-muted-foreground hover:text-foreground">Case Studies</button>
              </nav>
            </div>
          )}
        </div>
      </header>
      <HeroSection />
      <ExperimentBoard />
      <section id="process" className="container mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-3xl font-semibold mb-12 text-center">4-Week Pilot — Week by Week</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card><CardHeader><CardTitle className="font-mono text-sm">Week 1-2 — Foundation</CardTitle></CardHeader><CardContent><ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1"><li>Repo + CI/CD</li><li>DB & API skeleton</li><li>First MVP feature</li></ul></CardContent></Card>
          <Card><CardHeader><CardTitle className="font-mono text-sm">Week 3 — Polish</CardTitle></CardHeader><CardContent><ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1"><li>Frontend integration</li><li>AI model integration</li><li>Documentation</li></ul></CardContent></Card>
          <Card><CardHeader><CardTitle className="font-mono text-sm">Week 4 — Ship or Stop</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Ship & scale or stop after week 1. You own the code.</p></CardContent></Card>
        </div>
      </section>
      <ProposalsSection />
      <section id="testimonials" className="py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12"><h2 className="text-3xl font-semibold mb-4">What Partners Say</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[{quote: "They shipped our energy dashboard in 3 weeks. Real code, real value.", author: "Facilities Director", org: "Major University"}, {quote: "Ethical AI that actually works. No black boxes, no lock-in.", author: "Program Lead", org: "EdTech Nonprofit"}, {quote: "Fast iteration, transparent process. Exactly what we needed.", author: "CTO", org: "Civic Startup"}].map((t, idx) => <Card key={idx}><CardContent className="pt-6"><p className="text-muted-foreground mb-4">&ldquo;{t.quote}&rdquo;</p><div><div className="font-semibold text-sm">{t.author}</div><div className="text-xs text-muted-foreground">{t.org}</div></div></CardContent></Card>)}
          </div>
        </div>
      </section>
      <section className="py-24 bg-sand">
        <div className="container mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="ownership"><AccordionTrigger>Who owns the code?</AccordionTrigger><AccordionContent>You do. Full code ownership, no vendor lock-in. We deliver the repo, docs, and deployment access.</AccordionContent></AccordionItem>
            <AccordionItem value="data"><AccordionTrigger>How do you handle data?</AccordionTrigger><AccordionContent>Your data stays yours. We follow strict data handling protocols and can work with sensitive data under NDA.</AccordionContent></AccordionItem>
            <AccordionItem value="timeline"><AccordionTrigger>What if we need to pause?</AccordionTrigger><AccordionContent>Pause anytime. You keep everything built to that point. No penalties, no lock-in.</AccordionContent></AccordionItem>
            <AccordionItem value="ethics"><AccordionTrigger>What's your ethical stance?</AccordionTrigger><AccordionContent>Explainable AI, no black boxes for public systems, no political surveillance. We publish experiment notes and learnings.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </section>
      <section id="contact"><ContactForm /></section>
      <footer className="bg-background border-t">
        <div className="container mx-auto max-w-6xl px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div><div className="font-bold text-lg mb-2">AltruisticX AI</div><p className="text-sm text-muted-foreground max-w-sm">Ethical, rapid AI pilots for energy, education, and civic tech. We ship working prototypes fast — and you own the code.</p></div>
            <div><div className="font-semibold mb-3 text-sm">Explore</div><ul className="space-y-2 text-sm text-muted-foreground"><li><button onClick={() => scrollToSection("experiments")} className="hover:text-foreground">Lab Notebook</button></li><li><button onClick={() => scrollToSection("process")} className="hover:text-foreground">Process</button></li></ul></div>
            <div><div className="font-semibold mb-3 text-sm">Regions</div><div className="text-sm text-muted-foreground">PA • DC • Boston • Maine</div></div>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground py-4 border-t">LAT 39.9526 • LONG -75.1652 • Local labs in PA / DC / MA / ME</div>
      </footer>
    </div>
  );
};

export default Index;
