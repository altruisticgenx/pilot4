import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ExternalLink, Github } from "lucide-react";
import { useExperiments } from "@/hooks/useExperiments";
import ExperimentDetailModal from "./ExperimentDetailModal";
import { Database } from "@/integrations/supabase/types";

type Experiment = Database["public"]["Tables"]["experiments"]["Row"];

const statusColors = {
  now_shipping: "bg-ethics-green/10 text-ethics-green border-ethics-green/20",
  seeking_partners: "bg-climate-blue/10 text-climate-blue border-climate-blue/20",
  shelved: "bg-muted/10 text-muted-foreground border-muted/20",
};

const statusLabels = {
  now_shipping: "Now Shipping",
  seeking_partners: "Looking for Partners",
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

export default function ExperimentBoard() {
  const [domain, setDomain] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: experiments, isLoading } = useExperiments({
    domain: domain !== "all" ? domain : undefined,
    search: search || undefined,
  });

  const experimentsByStatus = useMemo(() => {
    if (!experiments) return { now_shipping: [], seeking_partners: [], shelved: [] };
    return {
      now_shipping: experiments.filter(exp => exp.status === "now_shipping"),
      seeking_partners: experiments.filter(exp => exp.status === "seeking_partners"),
      shelved: experiments.filter(exp => exp.status === "shelved"),
    };
  }, [experiments]);

  const handleViewDetails = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setModalOpen(true);
  };

  const renderExperimentCard = (experiment: Experiment) => (
    <div key={experiment.id} className="bg-background rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(experiment)}>
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-semibold flex-1 pr-2">{experiment.title}</div>
        {experiment.metrics && typeof experiment.metrics === 'object' && 'uptime' in experiment.metrics && (
          <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">Uptime {experiment.metrics.uptime}</div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{experiment.hypothesis}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="text-xs">{experiment.domain}</Badge>
        {experiment.tags?.slice(0, 2).map((tag, idx) => <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>)}
      </div>
      {(experiment.demo_url || experiment.repo_url) && (
        <div className="flex gap-2 mt-3">
          {experiment.demo_url && <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={(e) => { e.stopPropagation(); window.open(experiment.demo_url!, "_blank"); }}><ExternalLink className="h-3 w-3 mr-1" />Demo</Button>}
          {experiment.repo_url && <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={(e) => { e.stopPropagation(); window.open(experiment.repo_url!, "_blank"); }}><Github className="h-3 w-3 mr-1" />Repo</Button>}
        </div>
      )}
    </div>
  );

  const renderColumn = (title: string, status: keyof typeof experimentsByStatus, experiments: Experiment[]) => (
    <div className="min-w-[320px] shrink-0">
      <h4 className="font-semibold mb-4 flex items-center gap-2">{title}<Badge variant="outline" className={statusColors[status]}>{experiments.length}</Badge></h4>
      <div className="space-y-4">
        {isLoading ? Array.from({ length: 2 }).map((_, idx) => <Skeleton key={idx} className="h-32 rounded-lg" />) : experiments.length > 0 ? experiments.map(renderExperimentCard) : <div className="text-sm text-muted-foreground italic">No experiments</div>}
      </div>
    </div>
  );

  return (
    <>
      <section id="experiments" className="container mx-auto max-w-6xl px-6 py-24 bg-sand">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Live Experiment Board</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search experiments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <select value={domain} onChange={(e) => setDomain(e.target.value)} className="border border-input rounded-md px-3 py-2 bg-background h-10 min-w-[200px]">
              {domainOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {renderColumn("Now Shipping", "now_shipping", experimentsByStatus.now_shipping)}
          {renderColumn("Looking for Partners", "seeking_partners", experimentsByStatus.seeking_partners)}
          {renderColumn("Shelved", "shelved", experimentsByStatus.shelved)}
        </div>
      </section>
      <ExperimentDetailModal experiment={selectedExperiment} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
