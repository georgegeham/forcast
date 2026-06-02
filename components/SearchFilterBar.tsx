"use client";

import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type FilterOption = {
  value: string;
  label: string;
};

type SearchFilterBarProps = {
  searchInput: string;
  searching: boolean;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  hasFilters: boolean;
  placeholder?: string;
  filter?: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: FilterOption[];
  };
};

const SearchFilterBar = ({
  searchInput,
  searching,
  onSearchChange,
  onClear,
  hasFilters,
  placeholder,
  filter,
}: SearchFilterBarProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        {searching ? (
          <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        )}
        <Input
          placeholder={placeholder ?? "Search..."}
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      {filter && (
        <Select value={filter.value} onValueChange={filter.onValueChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{filter.placeholder}</SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="shrink-0"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default SearchFilterBar;
