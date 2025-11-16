import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { proposals } from "@/lib/data/proposals";

export default function ProposalsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Project Pitch{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Templates
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pick a template to start drafting your pilot — tailored to education, energy, and civic programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {proposals.map((proposal) => {
            const Icon = proposal.icon;
            return (
              <Card 
                key={proposal.name}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${proposal.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{proposal.name}</CardTitle>
                  <CardDescription className="text-sm">
                    <strong>Audience:</strong> {proposal.audience}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{proposal.summary}</p>
                  <div className="p-4 bg-accent rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-accent-foreground">
                      Outcome: {proposal.outcome}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
