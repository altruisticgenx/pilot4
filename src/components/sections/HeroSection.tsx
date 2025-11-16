import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const liveExperiments = [
  {
    title: "Campus Energy Storyboard",
    hypothesis: "Energy data as narrative helps facilities win grant funding.",
    status: "now_shipping" as const,
    domain: "Energy",
  },
  {
    title: "Capstone Partner Matchmaker",
    hypothesis: "Match students & partners faster by modeling affinity & capacity.",
    status: "seeking_partners" as const,
    domain: "Education",
  },
  {
    title: "Founder OS Dashboard",
    hypothesis: "Consolidate product & ops signals for rapid decision-making.",
    status: "shipped" as const,
    domain: "Startup",
  },
];

const statusConfig = {
  now_shipping: { label: "Now Shipping", className: "bg-success/10 text-success border-success/20" },
  seeking_partners: { label: "Looking for Partners", className: "bg-primary/10 text-primary border-primary/20" },
  shipped: { label: "Shipped", className: "bg-muted/10 text-muted-foreground border-muted/20" },
};

export const HeroSection = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="container mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Text Content */}
        <div className="md:col-span-6 space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.02] font-extrabold tracking-tight">
            Build an ethical AI pilot in{" "}
            <span className="text-primary">four weeks</span> — for energy, education, and civic tech.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            A Live AI Lab that ships working prototypes fast. Week-by-week sprints, async-first communication, and code you own.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
            <Button 
              size="lg" 
              className="text-base group"
              onClick={() => scrollToSection("contact")}
              aria-label="Start a 4-week pilot inquiry"
            >
              Start a 4-Week Pilot
              <ArrowRight className={`ml-2 h-4 w-4 ${!prefersReducedMotion && 'group-hover:translate-x-1 transition-transform'}`} />
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-base"
              onClick={() => scrollToSection("experiments")}
            >
              See the Lab Notebook
            </Button>
          </div>
          
          {/* Metrics */}
          <div className="flex gap-8 pt-6 border-t border-border/40">
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-semibold">24</span>
              <span className="text-sm text-muted-foreground">Active Pilots</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-semibold">99.9%</span>
              <span className="text-sm text-muted-foreground">Uptime</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-semibold">4 wks</span>
              <span className="text-sm text-muted-foreground">Avg Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Experiment Feed */}
        <div className="md:col-span-6">
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/40">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Live Experiment Board</h3>
              </div>
              <button 
                onClick={() => scrollToSection("experiments")}
                className="text-sm text-primary hover:underline"
              >
                Open Lab Notebook
              </button>
            </div>
            
            <div className="space-y-4">
              {liveExperiments.map((experiment, index) => (
                <article 
                  key={index}
                  className="group p-4 rounded-lg border border-border/40 bg-background/50 hover:bg-background hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {experiment.title}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={statusConfig[experiment.status].className}
                    >
                      {statusConfig[experiment.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {experiment.hypothesis}
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {experiment.domain}
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
