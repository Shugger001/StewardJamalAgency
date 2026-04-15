"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EditorPanel } from "@/components/editor/editor-panel";
import { DevRoleSwitcher } from "@/components/editor/dev-role-switcher";
import {
  useEditorStore,
  type EditableBlock,
} from "@/components/editor/use-editor-store";
import { FeaturesSection } from "@/components/sections/features";
import { HeroSection } from "@/components/sections/hero";
import type { AppRole } from "@/lib/auth/role";
import { cn } from "@/lib/utils";

type EditorSection = {
  id: string;
  type: string;
  position: number;
  pageId: string;
};

type WebsiteEditorProps = {
  websiteId: string;
  websiteName: string;
  role: AppRole;
  enableDevRoleSwitcher?: boolean;
  sections: EditorSection[];
  blocks: EditableBlock[];
};

type ToastState = {
  message: string;
  kind: "success" | "error";
} | null;

export function WebsiteEditor({
  websiteId,
  websiteName,
  role,
  enableDevRoleSwitcher = false,
  sections,
  blocks,
}: WebsiteEditorProps) {
  const canEditContent = role === "admin" || role === "client";
  const [localBlocks, setLocalBlocks] = useState<EditableBlock[]>(blocks);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [toast, setToast] = useState<ToastState>(null);
  const [dirtyBlockIds, setDirtyBlockIds] = useState<Set<string>>(new Set());

  const selectedBlock = useEditorStore((state) => state.selectedBlock);
  const setSelectedBlock = useEditorStore((state) => state.setSelectedBlock);

  const blocksRef = useRef<EditableBlock[]>(localBlocks);
  const saveTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    blocksRef.current = localBlocks;
  }, [localBlocks]);

  useEffect(() => {
    return () => {
      Object.values(saveTimersRef.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const blockById = useMemo(
    () => new Map(localBlocks.map((block) => [block.id, block])),
    [localBlocks],
  );

  const activeBlock = selectedBlock ? blockById.get(selectedBlock.id) ?? selectedBlock : null;

  const blocksBySection = useMemo(() => {
    return localBlocks.reduce<Map<string, EditableBlock[]>>((acc, block) => {
      const list = acc.get(block.sectionId) ?? [];
      list.push(block);
      acc.set(block.sectionId, list);
      return acc;
    }, new Map());
  }, [localBlocks]);

  function pushToast(message: string, kind: "success" | "error") {
    setToast({ message, kind });
    window.clearTimeout((pushToast as unknown as { timer?: number }).timer);
    (pushToast as unknown as { timer?: number }).timer = window.setTimeout(() => {
      setToast(null);
    }, 1400);
  }

  function setBlockValue(blockId: string, nextValue: string) {
    setLocalBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
              ...block,
              value: nextValue,
            }
          : block,
      ),
    );
  }

  async function persistBlockValue(blockId: string, previousValue: string, nextValue: string) {
    try {
      const response = await fetch(`/api/content-blocks/${blockId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: nextValue,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("PERMISSION_DENIED");
        }
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Failed to save.");
      }

      setSaveState("saved");
      setDirtyBlockIds((prev) => {
        const next = new Set(prev);
        next.delete(blockId);
        return next;
      });
      pushToast("Saved", "success");
      window.setTimeout(() => setSaveState("idle"), 700);
    } catch (error) {
      setBlockValue(blockId, previousValue);
      setDirtyBlockIds((prev) => {
        const next = new Set(prev);
        next.delete(blockId);
        return next;
      });
      const reverted = blocksRef.current.find((block) => block.id === blockId);
      if (reverted) {
        setSelectedBlock(reverted);
      }
      setSaveState("error");
      if (error instanceof Error && error.message === "PERMISSION_DENIED") {
        pushToast("Insufficient permission", "error");
      } else {
        pushToast("Failed to save", "error");
      }
    }
  }

  function handleValueChange(nextValue: string) {
    if (!activeBlock || !canEditContent) return;

    const blockId = activeBlock.id;
    const previousValue =
      blocksRef.current.find((block) => block.id === blockId)?.value ?? "";

    setBlockValue(blockId, nextValue);
    setSelectedBlock({
      ...activeBlock,
      value: nextValue,
    });
    setSaveState("saving");
    setDirtyBlockIds((prev) => {
      const next = new Set(prev);
      next.add(blockId);
      return next;
    });

    const previousTimer = saveTimersRef.current[blockId];
    if (previousTimer) clearTimeout(previousTimer);

    saveTimersRef.current[blockId] = setTimeout(() => {
      persistBlockValue(blockId, previousValue, nextValue);
    }, 500);
  }

  return (
    <div className="relative">
      <div className="mx-auto max-w-5xl space-y-6 pr-0 transition-all lg:pr-[360px]">
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Website Editor</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
            {websiteName}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Locked layout mode: only content blocks are editable.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Role:{" "}
            <span className="font-medium text-zinc-700">
              {role === "admin"
                ? "Admin (full access)"
                : role === "client"
                  ? "Client (content only)"
                  : "Viewer (read-only)"}
            </span>
          </p>
          {enableDevRoleSwitcher && (
            <div className="mt-3">
              <DevRoleSwitcher role={role} />
            </div>
          )}
        </div>

        {!canEditContent && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You have read-only access. Editing content blocks is disabled.
          </div>
        )}

        {sections.map((section) => {
          const sectionBlocks = blocksBySection.get(section.id) ?? [];

          if (section.type === "hero") {
            return (
              <HeroSection
                key={section.id}
                sectionId={section.id}
                blocks={sectionBlocks}
                selectedBlockId={activeBlock?.id ?? null}
                dirtyBlockIds={dirtyBlockIds}
                onSelectBlock={setSelectedBlock}
                canEdit={canEditContent}
              />
            );
          }

          if (section.type === "features") {
            return (
              <FeaturesSection
                key={section.id}
                sectionId={section.id}
                blocks={sectionBlocks}
                selectedBlockId={activeBlock?.id ?? null}
                dirtyBlockIds={dirtyBlockIds}
                onSelectBlock={setSelectedBlock}
                canEdit={canEditContent}
              />
            );
          }

          return (
            <section
              key={section.id}
              className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-500"
            >
              Section type <span className="font-medium text-zinc-700">{section.type}</span> is
              not mapped yet.
            </section>
          );
        })}
      </div>

      <EditorPanel
        block={activeBlock}
        onValueChange={handleValueChange}
        isSaving={saveState === "saving"}
        saveState={saveState}
        canEdit={canEditContent}
      />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className={cn(
            "fixed bottom-6 right-6 z-[60] rounded-lg border px-3 py-2 text-sm shadow-sm",
            toast.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {toast.message}
        </motion.div>
      )}

      <input type="hidden" value={websiteId} readOnly />
    </div>
  );
}
