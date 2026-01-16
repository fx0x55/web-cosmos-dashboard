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
    <form onSubmit={handleSearch} className="relative flex items-end gap-2">
      <div className="grid w-full max-w-sm items-center gap-1.5">
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
            className={`w-[300px] h-11 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20 pr-10 transition-all focus:scale-[1.02] duration-200 ${error ? "border-red-500 ring-red-500" : ""}`}
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent text-slate-500"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {error && <p className="text-xs text-red-500 absolute -bottom-5 left-0">{error}</p>}
      </div>
    </form>
  );
}
