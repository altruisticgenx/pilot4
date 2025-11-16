import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, ExternalLink, Github } from "lucide-react";
import { useExperiments } from "@/hooks/useExperiments";
import ExperimentDetailModal from "./ExperimentDetailModal";
import { Database } from "@/integrations/supabase/types";

type Experiment = Database["public"]["Tables"]["experiments"]["Row"];

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

const domainOptions = [
  { value: "all", label: "All Domains" },
  { value: "energy", label: "Energy" },
  { value: "education", label: "Education" },
  { value: "civic", label: "Civic" },
  { value: "startup", label: "Startup" },
  { value: "data_infrastructure", label: "Data Infrastructure" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "now_shipping", label: "Now Shipping" },
  { value: "seeking_partners", label: "Seeking Partners" },
  { value: "shelved", label: "Shelved" },
];

export default function ExperimentBoard() {
  const [domain, setDomain] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: experiments, isLoading } = useExperiments({
    domain: domain !== "all" ? domain : undefined,
    status: status !== "all" ? status : undefined,
    search: search || undefined,
  });

  // Collect all unique tags for display
  const allTags = useMemo(() => {
    if (!experiments) return [];
    const tags = new Set<string>();
    experiments.forEach((exp) => {
      exp.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [experiments]);

  const handleViewDetails = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setModalOpen(true);
  };

  return (
    <>
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-primary-foreground">Live Experiment Board</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What We're Building
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our live experiments, shipped projects, and open partnership opportunities. 
              Everything here is real—see what's shipping, what's seeking partners, and what we learned.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search experiments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="border border-input rounded-md px-3 py-2 bg-background h-10 min-w-[200px]"
              >
                {domainOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-input rounded-md px-3 py-2 bg-background h-10 min-w-[200px]"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag display (info only) */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Tech tags across experiments:</span>
                {allTags.slice(0, 8).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {allTags.length > 8 && (
                  <span className="text-xs text-muted-foreground">+{allTags.length - 8} more</span>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : experiments && experiments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiments.map((exp) => {
                const metrics = exp.metrics as Record<string, any> || {};
                return (
                  <Card
                    key={exp.id}
                    className="border-2 hover:border-primary/30 transition-all hover:shadow-lg group"
                  >
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={statusColors[exp.status as keyof typeof statusColors]}>
                          {statusLabels[exp.status as keyof typeof statusLabels]}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {exp.domain.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{exp.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {exp.hypothesis}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Tags */}
                      {exp.tags && exp.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {exp.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Metrics preview */}
                      {Object.keys(metrics).length > 0 && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(metrics).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="bg-muted/50 rounded p-2">
                              <div className="text-xs text-muted-foreground capitalize">
                                {key.replace(/_/g, " ")}
                              </div>
                              <div className="font-semibold text-xs">{String(value)}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewDetails(exp)}
                        >
                          View Details
                        </Button>
                        {exp.demo_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={exp.demo_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {exp.repo_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={exp.repo_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No experiments found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </section>

      <ExperimentDetailModal
        experiment={selectedExperiment}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
