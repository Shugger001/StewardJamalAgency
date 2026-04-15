"use client";

import { cn } from "@/lib/utils";
import type { EditableBlock } from "@/components/editor/use-editor-store";

type HeroSectionProps = {
  sectionId: string;
  blocks: EditableBlock[];
  selectedBlockId: string | null;
  dirtyBlockIds: Set<string>;
  onSelectBlock: (block: EditableBlock) => void;
  canEdit: boolean;
};

function byKey(blocks: EditableBlock[], key: string) {
  return blocks.find((block) => block.key === key) ?? null;
}

export function HeroSection({
  sectionId,
  blocks,
  selectedBlockId,
  dirtyBlockIds,
  onSelectBlock,
  canEdit,
}: HeroSectionProps) {
  const title = byKey(blocks, "title");
  const subtitle = byKey(blocks, "subtitle");

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10"
      data-section-id={sectionId}
    >
      <div className="max-w-3xl space-y-4">
        <button
          type="button"
          disabled={!canEdit || !title}
          onClick={() => title && onSelectBlock(title)}
          className={cn(
            "block w-full rounded-xl text-left transition-colors",
            canEdit && "hover:bg-[#0A66FF]/5",
            selectedBlockId === title?.id && "outline-2 outline-[#0A66FF]",
          )}
        >
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            {title?.value ?? "Welcome to your new website"}
          </h1>
          {title && dirtyBlockIds.has(title.id) && (
            <span className="mt-2 inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              Unsaved
            </span>
          )}
        </button>

        <button
          type="button"
          disabled={!canEdit || !subtitle}
          onClick={() => subtitle && onSelectBlock(subtitle)}
          className={cn(
            "block w-full rounded-xl text-left transition-colors",
            canEdit && "hover:bg-[#0A66FF]/5",
            selectedBlockId === subtitle?.id && "outline-2 outline-[#0A66FF]",
          )}
        >
          <p className="text-base text-zinc-600 md:text-lg">
            {subtitle?.value ?? "We build powerful digital experiences"}
          </p>
          {subtitle && dirtyBlockIds.has(subtitle.id) && (
            <span className="mt-2 inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              Unsaved
            </span>
          )}
        </button>
      </div>
    </section>
  );
}
