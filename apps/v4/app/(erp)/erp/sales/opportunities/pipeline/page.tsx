
"use client"

import { useState, useEffect, useRef } from "react";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/registry/new-york-v4/ui/select";
import { User } from "lucide-react";
import { PipelineBoard } from "../components/pipeline-board";

interface Opportunity {
  id: number;
  title: string;
  company: string;
  contact: string;
  email?: string;
  phone?: string;
  stage: string;
  value: number;
  probability: number;
  expected_close_date?: string;
  assigned_to?: string;
  source?: string;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function OpportunitiesPipelinePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rawSearch, setRawSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/opportunities");
        const data = await response.json();
        if (response.ok) {
          setOpportunities(data.opportunities || []);
        } else {
          console.error("Failed to fetch opportunities:", data.error);
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  // initialize search from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("opportunities.pipeline.search") || "";
      setRawSearch(saved);
      setSearchTerm(saved);
    } catch (e) {
      /* ignore */
    }
  }, []);

  // debounce rawSearch into searchTerm and persist
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(rawSearch);
      try {
        localStorage.setItem("opportunities.pipeline.search", rawSearch || "");
      } catch (e) {
        // ignore
      }
    }, 300);
    return () => clearTimeout(t);
  }, [rawSearch]);

  // keyboard shortcut: focus search when user presses '/'
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && (document.activeElement as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleStageChange = async (opportunityId: number, newStage: string) => {
    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage: newStage }),
      });
      if (response.ok) {
        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === opportunityId ? { ...opp, stage: newStage } : opp
          )
        );
        try {
          (await import("sonner")).toast.success("Opportunity stage updated");
        } catch (e) {
          console.log("toast import failed", e);
        }
      } else {
        const data = await response.json();
        try {
          (await import("sonner")).toast.error(data?.error || "Failed to update stage");
        } catch (e) {
          console.error(e);
        }
      }
    } catch (error) {
      console.error("Error updating stage:", error);
      try {
        (await import("sonner")).toast.error("Failed to update stage");
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  // Get unique stages and owners for filter dropdowns
  const stages = [
    "Discovery",
    "Qualification",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost"
  ];
  const owners = Array.from(new Set(opportunities.map(o => o.assigned_to).filter((v): v is string => Boolean(v))));

  // Filter logic
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === "all" || opp.stage === stageFilter;
    const matchesOwner = ownerFilter === "all" || opp.assigned_to === ownerFilter;
    return matchesSearch && matchesStage && matchesOwner;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <Input
          placeholder="Search opportunities... (press / to focus)"
          value={rawSearch}
          onChange={e => setRawSearch(e.target.value)}
          className="w-full md:w-64"
          ref={searchRef}
          aria-label="Search opportunities"
        />
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map(stage => (
              <SelectItem key={stage} value={stage}>{stage}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Owners</SelectItem>
            {owners.map(owner => (
              <SelectItem key={owner} value={owner}>{owner}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <PipelineBoard opportunities={filteredOpportunities} onStageChange={handleStageChange} />
    </div>
  );
}
