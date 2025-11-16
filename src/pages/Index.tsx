import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Target, Cpu, Heart } from "lucide-react";
import ProposalsSection from "@/components/sections/ProposalsSection";
import ContactForm from "@/components/sections/ContactForm";
import ExperimentBoard from "@/components/sections/ExperimentBoard";
const Index = () => {
  return <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Impact-Oriented AI Lab
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ethical AI Pilots That Ship Fast
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Applied ML consulting for education, energy, and civic impact. 
              Transparent experiments, human-centered design, no vendor lock-in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Your Pilot
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Impact Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              From university campuses to civic coalitions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {["Universities", "EdTech", "Coalitions", "Startups"].map(item => <div key={item} className="text-center">
                <div className="text-2xl font-semibold">{item}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Proposals Section */}
      <ProposalsSection />

      {/* Experiment Board */}
      <ExperimentBoard />

      {/* Core Values */}
      <section className="py-24 bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-pink-950/10 dark:to-purple-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How We Work
            </h2>
            <p className="text-xl text-muted-foreground">
              Transparent, ethical, and fast
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            icon: <Target className="w-12 h-12 text-primary" />,
            title: "Ship in Weeks, Not Months",
            description: "4-week pilots with working demos. Iterate fast, validate early."
          }, {
            icon: <Heart className="w-12 h-12 text-secondary" />,
            title: "Human-Centered AI",
            description: "Ethical guardrails, transparent models, human-in-the-loop design."
          }, {
            icon: <Cpu className="w-12 h-12 text-primary" />,
            title: "You Own Everything",
            description: "Full code ownership, no vendor lock-in, pause anytime."
          }].map((value, idx) => <div key={idx} className="text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-lg">{value.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Week-by-week pilots you can pause anytime
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[{
            name: "Discovery",
            price: "$5k",
            period: "one-time",
            description: "Perfect for validating your idea",
            features: ["1-week scoping sprint", "Technical feasibility report", "Prototype roadmap", "Data audit & recommendations"],
            cta: "Start Discovery",
            highlight: false
          }, {
            name: "4-Week Pilot",
            price: "$20k",
            period: "4 weeks",
            description: "Ship a working demo fast",
            features: ["Working prototype", "Weekly check-ins", "Full code ownership", "Ethical review included", "2 weeks post-pilot support"],
            cta: "Launch Pilot",
            highlight: true
          }, {
            name: "Ongoing R&D",
            price: "Custom",
            period: "flexible",
            description: "For longer-term partnerships",
            features: ["Dedicated team access", "Multi-phase projects", "Grant writing support", "Research publication partnership", "Flexible pause/resume"],
            cta: "Let's Talk",
            highlight: false
          }].map((plan, idx) => <Card key={idx} className={`relative ${plan.highlight ? 'border-primary border-4 shadow-2xl scale-105' : 'border-2 hover:border-primary/30'} transition-all`}>
                {plan.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                  </div>}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    
                    <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                  </div>
                  <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>)}
                  </ul>
                  <Button className="w-full" size="lg" variant={plan.highlight ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our Partners Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            quote: "They turned 5 years of energy data into a grant-winning narrative in just 4 weeks. Game-changer for campus sustainability.",
            author: "Facility Fran",
            role: "University Facilities Manager"
          }, {
            quote: "Finally, a matching tool our teachers actually want to use. Privacy-first, human review built-in, zero compliance headaches.",
            author: "Teacher Tara",
            role: "EdTech Program Lead"
          }, {
            quote: "Transparent AI with clear guardrails. They helped us pilot civic sensing without compromising our community values.",
            author: "Civic Cory",
            role: "Coalition Director"
          }].map((testimonial, idx) => <Card key={idx} className="border-2 hover:border-primary/30 transition-all">
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {[{
            q: "Do we really own the code?",
            a: "Yes! Full IP ownership, all code delivered in open repos, no licensing fees. You can take it in-house, hire another team, or pause anytime."
          }, {
            q: "What if we need to pause?",
            a: "You can pause week-by-week after the initial pilot. No penalties, no long-term contracts. Resume when you're ready."
          }, {
            q: "How do you ensure ethical AI?",
            a: "Every pilot includes: transparent model documentation, bias audits, human-in-the-loop checkpoints, and explicit guardrails co-designed with your team."
          }, {
            q: "Can you help with grant writing?",
            a: "Absolutely. We've supported teams in securing NSF, DOE, and foundation grants. We can provide technical narratives, preliminary data, and feasibility studies."
          }, {
            q: "What if we have regulatory constraints?",
            a: "We specialize in FERPA, HIPAA-adjacent, and civic data contexts. We'll work within your compliance framework from day one."
          }, {
            q: "How fast can we start?",
            a: "Discovery sprints can start within 1-2 weeks. Full pilots typically kick off within 3-4 weeks of first contact."
          }].map((faq, idx) => <AccordionItem key={idx} value={`item-${idx}`} className="border-2 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <div id="contact-form">
        <ContactForm />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">​altruisticxai</h3>
              <p className="text-gray-400">
                Ethical AI pilots for education, energy, and civic impact.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Discovery Sprints</li>
                <li>4-Week Pilots</li>
                <li>Ongoing R&D</li>
                <li>Grant Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Domains</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Campus Energy</li>
                <li>Education Tech</li>
                <li>Civic Programs</li>
                <li>Impact Startups</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>​altruisticxai@gmail.com</li>
                <li>Schedule a call</li>
                <li>Case studies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Impact AI Lab. All rights reserved. Built with care for impact.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;