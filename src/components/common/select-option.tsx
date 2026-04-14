"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Options } from "@/lib/api/types";

interface SelectOptionsProps {
  options: Options[];
  value: string | string[] | undefined;
  onChange: (value: string[] | string | null) => void;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
}

export function SelectOptions({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  multiple = false,
}: SelectOptionsProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleValue = (val: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? [...value] : [];
      const exists = arr.includes(val);
      if (exists) {
        onChange(arr.filter((v) => v !== val));
      } else {
        onChange([...arr, val]);
      }
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  const removeValue = (val: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((v) => v !== val));
    }
  };

  const renderValue = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap items-center gap-1">
          {value.map((val) => {
            const label =
              options.find((opt) => opt.value === val)?.label || val;
            return (
              <Badge
                key={val}
                variant="secondary"
                className="flex items-center gap-1 pr-1 bg-secondary p-2 rounded-md"
              >
                {label}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeValue(val);
                  }}
                  className="hover:text-red-500 cursor-pointer items-center text-xs"
                >
                  x
                </span>
              </Badge>
            );
          })}
        </div>
      );
    } else if (!multiple && typeof value === "string") {
      const label = options.find((opt) => opt.value === value)?.label || value;
      return <span>{label}</span>;
    }
    return <span className="text-muted-foreground">{placeholder}</span>;
  };

  const availableOptions =
    multiple && Array.isArray(value)
      ? options.filter((opt) => !value.includes(opt.value))
      : options;

  return (
    <div className="w-full" ref={ref}>
      {label && <p className="text-sm mb-1 font-medium">{label}</p>}

      <div className="relative w-full">
        <div
          onClick={() => setOpen(!open)}
          className="w-full border rounded-md px-3 py-2 text-sm flex flex-row flex-wrap gap-1 cursor-pointer transition  focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <div className="flex flex-wrap gap-1 flex-1 items-center">
            {renderValue()}
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground mt-1" />
        </div>

        {open && (
          <div className="absolute mt-1 w-full z-10 rounded-md border bg-popover text-popover-foreground shadow-md max-h-72 overflow-y-auto">
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-y-auto">
                {availableOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => toggleValue(option.value)}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
}
