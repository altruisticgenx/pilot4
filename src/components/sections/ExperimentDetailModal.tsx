import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Shield } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Experiment = Database["public"]["Tables"]["experiments"]["Row"];

interface ExperimentDetailModalProps {
  experiment: Experiment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors = {
  now_shipping: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  seeking_partners: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  shelved: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
};

const statusLabels = {
  now_shipping: "Now Shipping",
  seeking_partners: "Seeking Partners",
  shelved: "Shelved",
};

const domainLabels = {
  energy: "Energy",
  education: "Education",
  civic: "Civic",
  startup: "Startup",
  data_infrastructure: "Data Infrastructure",
};

export default function ExperimentDetailModal({
  experiment,
  open,
  onOpenChange,
}: ExperimentDetailModalProps) {
  if (!experiment) return null;

  const metrics = experiment.metrics as Record<string, any> || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{experiment.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Domain */}
          <div className="flex flex-wrap gap-2">
            <Badge className={statusColors[experiment.status as keyof typeof statusColors]}>
              {statusLabels[experiment.status as keyof typeof statusLabels]}
            </Badge>
            <Badge variant="outline">{domainLabels[experiment.domain as keyof typeof domainLabels]}</Badge>
            {experiment.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Hypothesis */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Hypothesis</h3>
            <p className="text-muted-foreground">{experiment.hypothesis}</p>
          </div>

          {/* Metrics */}
          {Object.keys(metrics).length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="bg-muted/50 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </div>
                    <div className="text-lg font-semibold">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ethics Note */}
          {experiment.ethics_note && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Ethics & Guardrails</h3>
                  <p className="text-muted-foreground text-sm">{experiment.ethics_note}</p>
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {experiment.demo_url && (
              <Button variant="default" asChild>
                <a href={experiment.demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Demo
                </a>
              </Button>
            )}
            {experiment.repo_url && (
              <Button variant="outline" asChild>
                <a href={experiment.repo_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View Repo
                </a>
              </Button>
            )}
          </div>

          {/* CTA */}
          {experiment.status === "seeking_partners" && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Interested in partnering?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                We're looking for organizations to pilot this experiment. Get in touch to learn more.
              </p>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contact Us
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
