"use client";

import { useState, useMemo, useCallback } from "react";
import { User } from "lucide-react";
import ActorCard from "./ActorCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import type { FilterOption } from "@/components/SearchFilterBar";
import { debounce } from "@/lib/utils";
import type { UserWithProfile, Play } from "@/drizzle/Types/types";

const ActorsGrid = ({
  users,
  plays,
}: {
  users: UserWithProfile[];
  plays: Play[];
}) => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedPlayId, setSelectedPlayId] = useState("all");

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
    setSelectedPlayId("all");
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nameMatch = user.name
        .toLowerCase()
        .includes(search.toLowerCase());
      if (selectedPlayId === "all") return nameMatch;
      const playMatch = user.profile?.plays?.some(
        (p) => p.playId === selectedPlayId,
      );
      return nameMatch && playMatch;
    });
  }, [users, search, selectedPlayId]);

  const playFilterOptions: FilterOption[] = useMemo(
    () => plays.map((p) => ({ value: p.id, label: p.name })),
    [plays],
  );

  const hasFilters = !!(searchInput || selectedPlayId !== "all");

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Actors</h1>
        <p className="text-muted-foreground mt-1">
          Browse all registered actors and performers
        </p>
      </div>

      <SearchFilterBar
        searchInput={searchInput}
        searching={searching}
        onSearchChange={handleSearchChange}
        onClear={handleClear}
        hasFilters={hasFilters}
        placeholder="Search actors..."
        filter={{
          value: selectedPlayId,
          onValueChange: setSelectedPlayId,
          placeholder: "All plays",
          options: playFilterOptions,
        }}
      />

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <User className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No actors match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredUsers.map((user) => (
            <ActorCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActorsGrid;
