import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import type { FilterState } from "../types";
import { YEARS, QUARTERS, CATEGORIES } from "../data/employees";

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function Select({
  value,
  options,
  onChange,
  width,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  width?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative shrink-0 ${width ?? ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative w-full h-8 border border-[#373737] pl-3 pr-7 text-sm text-[#374151] bg-[#ebebed] text-left focus:outline-none ${isOpen ? "focus:ring-0" : "focus:ring-1 focus:ring-[#373737]"} cursor-pointer`}
      >
        {value}
      </button>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#374151]"
        size={13}
      />
      <div
        className={`absolute top-full left-0 right-0 z-20 mt-0.5 border border-[#d1d5db] bg-[#ebebed] shadow-[0_1px_3px_rgba(0,0,0,0.1)] origin-top transition-all duration-200 ease-out ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}`}
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              onChange(opt);
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-[7px] text-sm text-[#374151] ${opt === value ? "bg-[#ebebed]" : "hover:bg-white"}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Filters({ filters, onChange }: FiltersProps) {
  return (
    <div className="flex flex-col items-stretch md:flex-row md:items-center gap-3 mb-6 mx-auto p-4 md:px-6 md:py-5 border border-[#e5e7eb] rounded-[12px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto md:shrink-0">
        <Select
          value={filters.year}
          options={YEARS}
          onChange={(year) => onChange({ ...filters, year })}
          width="w-[120px]"
        />
        <Select
          value={filters.quarter}
          options={QUARTERS}
          onChange={(quarter) => onChange({ ...filters, quarter })}
          width="w-[120px]"
        />
        <Select
          value={filters.category}
          options={CATEGORIES}
          onChange={(category) => onChange({ ...filters, category })}
          width="w-[150px]"
        />
      </div>
      <div className="group relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#374151] transition-all duration-200 ease-out group-focus-within:-translate-x-2 group-focus-within:opacity-0"
          size={14}
        />
        <input
          type="text"
          placeholder="Search employee..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full h-8 border border-[#373737] pl-9 pr-10 text-sm text-[#374151] placeholder-[#374151] bg-[#ebebed] transition-all duration-200 ease-out focus:pl-3 focus:outline-none focus:ring-1 focus:ring-[#373737]"
        />
        {filters.search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-px top-px bottom-px px-2 flex items-center text-[#374151] hover:bg-white hover:text-[#1f2937]"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
