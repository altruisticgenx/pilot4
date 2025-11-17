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
  shelved: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
};
const statusLabels = {
  now_shipping: "Now Shipping",
  seeking_partners: "Seeking Partners",
  shelved: "Shelved"
};
const domainOptions = [{
  value: "all",
  label: "All Domains"
}, {
  value: "energy",
  label: "Energy"
}, {
  value: "education",
  label: "Education"
}, {
  value: "civic",
  label: "Civic"
}, {
  value: "startup",
  label: "Startup"
}, {
  value: "data_infrastructure",
  label: "Data Infrastructure"
}];
const statusOptions = [{
  value: "all",
  label: "All Status"
}, {
  value: "now_shipping",
  label: "Now Shipping"
}, {
  value: "seeking_partners",
  label: "Seeking Partners"
}, {
  value: "shelved",
  label: "Shelved"
}];
export default function ExperimentBoard() {
  const [domain, setDomain] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const {
    data: experiments,
    isLoading
  } = useExperiments({
    domain: domain !== "all" ? domain : undefined,
    status: status !== "all" ? status : undefined,
    search: search || undefined
  });

  // Collect all unique tags for display
  const allTags = useMemo(() => {
    if (!experiments) return [];
    const tags = new Set<string>();
    experiments.forEach(exp => {
      exp.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [experiments]);
  
  // Group experiments by status for kanban view
  const groupedExperiments = useMemo(() => {
    const grouped = {
      now_shipping: [] as Experiment[],
      seeking_partners: [] as Experiment[],
      shelved: [] as Experiment[]
    };
    
    experiments?.forEach(exp => {
      const status = exp.status as keyof typeof grouped;
      if (grouped[status]) {
        grouped[status].push(exp);
      }
    });
    
    return grouped;
  }, [experiments]);

  const handleViewDetails = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setModalOpen(true);
  };

  return <>
      <section id="experiments" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-primary-foreground">Live Experiment Board</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What We're Building</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our live experiments, shipped projects, and open partnership opportunities. Everything here is
              real—see what's shipping, what's seeking partners, and what we learned.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search experiments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
              <select value={domain} onChange={e => setDomain(e.target.value)} className="border border-input rounded-md px-3 py-2 bg-background h-10 min-w-[200px]">
                {domainOptions.map(opt => <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>)}
              </select>
            </div>
          </div>

          {/* Kanban Board */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6">
              {/* Now Shipping Column */}
              <div className="flex-shrink-0 w-80">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="w-3 h-3 bg-success rounded-full"></span>
                    Now Shipping
                    <span className="text-sm text-muted-foreground">({groupedExperiments.now_shipping.length})</span>
                  </h3>
                </div>
                <div className="space-y-4">
                  {groupedExperiments.now_shipping.map(exp => (
                    <Card key={exp.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleViewDetails(exp)}>
                      <CardHeader className="space-y-3 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge className={statusColors.now_shipping}>
                            {statusLabels.now_shipping}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exp.domain}
                          </Badge>
                        </div>
                        <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                          {exp.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <CardDescription className="line-clamp-2 text-sm">
                          {exp.hypothesis}
                        </CardDescription>
                        {(exp.demo_url || exp.repo_url) && (
                          <div className="flex gap-2">
                            {exp.demo_url && (
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild onClick={e => e.stopPropagation()}>
                                <a href={exp.demo_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Demo
                                </a>
                              </Button>
                            )}
                            {exp.repo_url && (
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild onClick={e => e.stopPropagation()}>
                                <a href={exp.repo_url} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-3 h-3 mr-1" />
                                  Repo
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {groupedExperiments.now_shipping.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No experiments shipping</p>
                  )}
                </div>
              </div>

              {/* Seeking Partners Column */}
              <div className="flex-shrink-0 w-80">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    Looking for Partners
                    <span className="text-sm text-muted-foreground">({groupedExperiments.seeking_partners.length})</span>
                  </h3>
                </div>
                <div className="space-y-4">
                  {groupedExperiments.seeking_partners.map(exp => (
                    <Card key={exp.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleViewDetails(exp)}>
                      <CardHeader className="space-y-3 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge className={statusColors.seeking_partners}>
                            {statusLabels.seeking_partners}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exp.domain}
                          </Badge>
                        </div>
                        <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                          {exp.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <CardDescription className="line-clamp-2 text-sm">
                          {exp.hypothesis}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                  {groupedExperiments.seeking_partners.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No partnerships sought</p>
                  )}
                </div>
              </div>

              {/* Shelved Column */}
              <div className="flex-shrink-0 w-80">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="w-3 h-3 bg-muted rounded-full"></span>
                    Shelved
                    <span className="text-sm text-muted-foreground">({groupedExperiments.shelved.length})</span>
                  </h3>
                </div>
                <div className="space-y-4">
                  {groupedExperiments.shelved.map(exp => (
                    <Card key={exp.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleViewDetails(exp)}>
                      <CardHeader className="space-y-3 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge className={statusColors.shelved}>
                            {statusLabels.shelved}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exp.domain}
                          </Badge>
                        </div>
                        <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                          {exp.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <CardDescription className="line-clamp-2 text-sm">
                          {exp.hypothesis}
                        </CardDescription>
                        {exp.ethics_note && (
                          <p className="text-xs text-muted-foreground italic">
                            Note: {exp.ethics_note}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {groupedExperiments.shelved.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No shelved experiments</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <ExperimentDetailModal experiment={selectedExperiment} open={modalOpen} onOpenChange={setModalOpen} />
    </>;
}