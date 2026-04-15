"use client";

import { cn } from "@/lib/utils";
import type { EditableBlock } from "@/components/editor/use-editor-store";

type FeaturesSectionProps = {
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

export function FeaturesSection({
  sectionId,
  blocks,
  selectedBlockId,
  dirtyBlockIds,
  onSelectBlock,
  canEdit,
}: FeaturesSectionProps) {
  const title = byKey(blocks, "title");
  const description = byKey(blocks, "description");

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10"
      data-section-id={sectionId}
    >
      <div className="space-y-4">
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
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            {title?.value ?? "Our Services"}
          </h2>
          {title && dirtyBlockIds.has(title.id) && (
            <span className="mt-2 inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              Unsaved
            </span>
          )}
        </button>

        <button
          type="button"
          disabled={!canEdit || !description}
          onClick={() => description && onSelectBlock(description)}
          className={cn(
            "block w-full rounded-xl text-left transition-colors",
            canEdit && "hover:bg-[#0A66FF]/5",
            selectedBlockId === description?.id && "outline-2 outline-[#0A66FF]",
          )}
        >
          <p className="text-base text-zinc-600 md:text-lg">
            {description?.value ?? "We deliver high-quality solutions"}
          </p>
          {description && dirtyBlockIds.has(description.id) && (
            <span className="mt-2 inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              Unsaved
            </span>
          )}
        </button>
      </div>
    </section>
  );
}
