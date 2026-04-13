import { Fragment } from "react/jsx-runtime";
import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SidebarItem } from "../layout/sidebar/config";

interface SearchBarProps {
  searchOptions: SidebarItem[];
  onSelect?: (item: SidebarItem) => void;
}

export function SearchBar({ searchOptions, onSelect }: SearchBarProps) {
  const [open, setOpen] = useState(false);

  const onSelectHandler = (item: SidebarItem) => {
    if (onSelect) {
      onSelect(item);
    }
    setOpen(false);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Fragment>
      <Button
        variant="ghost"
        className="w-full justify-between px-3 py-2 text-sm text-muted-foreground border rounded-md bg-muted hover:bg-muted/70"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground border rounded px-1.5 py-0.5 bg-white shadow-sm">
          <kbd className="font-mono">⌘</kbd>
          <kbd className="font-mono">K</kbd>
        </span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {searchOptions.map((menu) => (
              <CommandItem
                key={menu.title}
                onSelect={() => onSelectHandler(menu)}
              >
                <menu.icon className="mr-2 h-4 w-4" />
                {menu.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Fragment>
  );
}
