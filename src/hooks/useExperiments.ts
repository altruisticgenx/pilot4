import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Experiment = Database["public"]["Tables"]["experiments"]["Row"];

interface UseExperimentsFilters {
  domain?: string;
  status?: string;
  search?: string;
  tags?: string[];
}

export const useExperiments = (filters?: UseExperimentsFilters) => {
  return useQuery({
    queryKey: ["experiments", filters],
    queryFn: async () => {
      let query = supabase.from("experiments").select("*");

      // Apply filters
      if (filters?.domain && filters.domain !== "all") {
        query = query.eq("domain", filters.domain);
      }

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,hypothesis.ilike.%${filters.search}%`
        );
      }

      // Sort by last_updated descending
      query = query.order("last_updated", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Client-side tag filtering (since PostgreSQL array operations can be complex)
      let filteredData = data || [];
      if (filters?.tags && filters.tags.length > 0) {
        filteredData = filteredData.filter((exp) =>
          filters.tags!.some((tag) => exp.tags?.includes(tag))
        );
      }

      return filteredData as Experiment[];
    },
  });
};
