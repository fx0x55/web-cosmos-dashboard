"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Address is required");
      return;
    }
    
    // Simple mock validation
    if (query.length < 5) {
      setError("Address is too short");
      return;
    }

    setError("");
    const chain = searchParams.get("chain") || "aifx";
    router.push(`/address/${query}?chain=${chain}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-end gap-3 relative z-10">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="search-address" className="sr-only">Search Address</Label>
        <div className="relative">
          <Input
            id="search-address"
            type="text"
            placeholder="Search address..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError("");
            }}
            className={`w-full h-11 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-slate-200 dark:border-white/20 shadow-sm transition-all focus:scale-[1.02] duration-200 ${error ? "border-red-500 ring-red-500" : ""}`}
          />
          {error && <p className="text-xs text-red-500 absolute -bottom-5 left-0">{error}</p>}
        </div>
      </div>
      <Button 
        type="submit" 
        size="icon" 
        variant="ghost" 
        className="h-11 w-11 shrink-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-slate-200 dark:border-white/20 shadow-sm hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:scale-105"
      >
        <Search className="h-4 w-4 text-slate-500" />
      </Button>
    </form>
  );
}
