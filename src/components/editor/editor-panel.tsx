"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEditorStore, type EditableBlock } from "@/components/editor/use-editor-store";
import { cn } from "@/lib/utils";

type EditorPanelProps = {
  block: EditableBlock | null;
  onValueChange: (value: string) => void;
  isSaving: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
  canEdit: boolean;
};

export function EditorPanel({
  block,
  onValueChange,
  isSaving,
  saveState,
  canEdit,
}: EditorPanelProps) {
  const panelOpen = useEditorStore((state) => state.panelOpen);
  const closePanel = useEditorStore((state) => state.closePanel);

  return (
    <AnimatePresence>
      {panelOpen && block && (
        <motion.aside
          key="editor-panel"
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed inset-y-0 right-0 z-50 w-[350px] border-l border-zinc-200 bg-white"
        >
          <div className="flex h-full flex-col">
            <header className="flex h-14 items-center justify-between border-b border-zinc-100 px-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Editing Block
                </p>
                <p className="text-sm font-semibold text-zinc-900">{block.key}</p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                aria-label="Close editor panel"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="space-y-4 p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600">Field key</label>
                <input
                  disabled
                  value={block.key}
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600">Value</label>
                {block.type === "image" ? (
                  <input
                    type="url"
                    value={block.value}
                    disabled={!canEdit}
                    onChange={(event) => onValueChange(event.target.value)}
                    placeholder="https://..."
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  />
                ) : (
                  <textarea
                    value={block.value}
                    disabled={!canEdit}
                    onChange={(event) => onValueChange(event.target.value)}
                    rows={8}
                    className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  />
                )}
              </div>

              {!canEdit && (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                  Read-only mode: you can preview content but cannot edit.
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                {isSaving && (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-[#0A66FF]" />
                )}
                <span
                  className={cn(
                    saveState === "saved" && "text-emerald-700",
                    saveState === "error" && "text-red-600",
                  )}
                >
                  {saveState === "saving" && "Saving..."}
                  {saveState === "saved" && "Saved"}
                  {saveState === "error" && "Failed to save"}
                  {saveState === "idle" && "Changes auto-save"}
                </span>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
