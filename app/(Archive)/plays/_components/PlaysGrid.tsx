"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, Theater } from "lucide-react";
import PlayCard from "./PlayCard";
import { Button } from "@/components/ui/button";
import SearchFilterBar from "@/components/SearchFilterBar";
import type { FilterOption } from "@/components/SearchFilterBar";
import { debounce } from "@/lib/utils";
import type { Play } from "@/drizzle/Types/types";

const PlaysGrid = ({ plays }: { plays: Play[] }) => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setSearching(false);
      }, 300),
    [],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      setSearching(true);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch],
  );

  const handleClear = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setSearching(false);
    setSelectedYear("all");
  }, []);

  const years = useMemo(() => {
    const set = new Set<number>();
    plays.forEach((p) => {
      if (p.playDate) {
        const year = new Date(p.playDate).getFullYear();
        if (!isNaN(year)) set.add(year);
      }
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [plays]);

  const filteredPlays = useMemo(() => {
    return plays.filter((play) => {
      const nameMatch = play.name
        .toLowerCase()
        .includes(search.toLowerCase());
      if (selectedYear === "all") return nameMatch;
      if (!play.playDate) return false;
      const year = new Date(play.playDate).getFullYear();
      return nameMatch && year === Number(selectedYear);
    });
  }, [plays, search, selectedYear]);

  const yearFilterOptions: FilterOption[] = useMemo(
    () => years.map((y) => ({ value: String(y), label: String(y) })),
    [years],
  );

  const hasFilters = !!(searchInput || selectedYear !== "all");

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Plays</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage all available plays
        </p>
      </div>

      <SearchFilterBar
        searchInput={searchInput}
        searching={searching}
        onSearchChange={handleSearchChange}
        onClear={handleClear}
        hasFilters={hasFilters}
        placeholder="Search plays..."
        filter={{
          value: selectedYear,
          onValueChange: setSelectedYear,
          placeholder: "All years",
          options: yearFilterOptions,
        }}
      />

      {filteredPlays.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <Theater className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No plays match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPlays.map((play) => (
            <PlayCard key={play.id} play={play} />
          ))}
        </div>
      )}

      <Link href="/plays/create">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 rounded-full shadow-lg gap-2 z-50"
        >
          <Plus className="w-5 h-5" />
          Add Play
        </Button>
      </Link>
    </div>
  );
};

export default PlaysGrid;
