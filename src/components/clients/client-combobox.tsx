"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ClientOption = {
  id: string;
  name: string;
};

type ClientComboboxProps = {
  clients: ClientOption[];
  value: string;
  onChange: (clientId: string, client?: ClientOption) => void;
  disabled?: boolean;
  required?: boolean;
  highlighted?: boolean;
  placeholder?: string;
  /** When true, typing a new name offers creating that client via API. */
  allowCreate?: boolean;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Searchable client picker. Type to filter existing clients; optionally create a new one by name.
 */
export function ClientCombobox({
  clients,
  value,
  onChange,
  disabled = false,
  required = false,
  highlighted = false,
  placeholder = "Type or select a client…",
  allowCreate = false,
  name,
  id,
  className,
}: ClientComboboxProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [localClients, setLocalClients] = useState(clients);

  useEffect(() => {
    setLocalClients(clients);
  }, [clients]);

  const selected = localClients.find((client) => client.id === value) ?? null;

  useEffect(() => {
    if (!open) {
      setQuery(selected?.name ?? "");
    }
  }, [open, selected?.name, value]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return localClients;
    return localClients.filter((client) => client.name.toLowerCase().includes(term));
  }, [localClients, query]);

  const exactMatch = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return null;
    return localClients.find((client) => client.name.toLowerCase() === term) ?? null;
  }, [localClients, query]);

  const canCreate =
    allowCreate &&
    !disabled &&
    query.trim().length > 0 &&
    !exactMatch &&
    !creating;

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function selectClient(client: ClientOption) {
    onChange(client.id, client);
    setQuery(client.name);
    setCreateError(null);
    setOpen(false);
  }

  async function createClient() {
    const businessName = query.trim();
    if (!businessName || creating) return;
    setCreating(true);
    setCreateError(null);
    try {
      const response = await fetch("/api/dashboard/clients", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_name: businessName }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        client?: { id?: string; business_name?: string } | null;
      };
      if (!response.ok || !data.client?.id) {
        throw new Error(data.error || "Could not add client.");
      }
      const created: ClientOption = {
        id: String(data.client.id),
        name: String(data.client.business_name ?? businessName),
      };
      setLocalClients((prev) =>
        prev.some((item) => item.id === created.id) ? prev : [created, ...prev],
      );
      selectClient(created);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Could not add client.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        disabled={disabled}
        required={required && !value}
        placeholder={placeholder}
        value={open || !selected ? query : selected.name}
        onFocus={() => {
          setOpen(true);
          setQuery(selected?.name ?? query);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(true);
          setCreateError(null);
          if (selected && next.trim().toLowerCase() !== selected.name.toLowerCase()) {
            onChange("");
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
          }
          if (event.key === "Enter" && open && canCreate && filtered.length === 0) {
            event.preventDefault();
            void createClient();
          }
        }}
        className={cn(
          "h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20 disabled:cursor-not-allowed disabled:bg-zinc-50",
          highlighted ? "border-amber-400 bg-amber-50/40" : "border-zinc-200",
        )}
      />

      {open && !disabled ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 && !canCreate ? (
            <li className="px-3 py-2 text-sm text-zinc-500">No matching clients</li>
          ) : null}
          {filtered.map((client) => (
            <li key={client.id} role="option" aria-selected={client.id === value}>
              <button
                type="button"
                className={cn(
                  "flex w-full px-3 py-2 text-left text-sm hover:bg-zinc-50",
                  client.id === value ? "bg-[#1860F0]/5 font-medium text-[#1860F0]" : "text-zinc-800",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectClient(client)}
              >
                {client.name}
              </button>
            </li>
          ))}
          {canCreate ? (
            <li role="option" aria-selected={false}>
              <button
                type="button"
                className="flex w-full px-3 py-2 text-left text-sm font-medium text-[#1860F0] hover:bg-[#1860F0]/5"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => void createClient()}
              >
                {creating ? "Adding…" : `Add “${query.trim()}” as new client`}
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}

      {createError ? <p className="mt-1 text-xs text-red-600">{createError}</p> : null}
      {allowCreate && !disabled ? (
        <p className="mt-1 text-[11px] text-zinc-500">
          Type to search, or enter a new name and choose Add as new client.
        </p>
      ) : null}
    </div>
  );
}
