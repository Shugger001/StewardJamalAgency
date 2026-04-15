"use client";

import { create } from "zustand";

export type EditableBlock = {
  id: string;
  key: string;
  type: "text" | "image";
  value: string;
  sectionId: string;
};

type EditorStore = {
  selectedBlock: EditableBlock | null;
  panelOpen: boolean;
  setSelectedBlock: (block: EditableBlock) => void;
  closePanel: () => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  selectedBlock: null,
  panelOpen: false,
  setSelectedBlock: (block) =>
    set({
      selectedBlock: block,
      panelOpen: true,
    }),
  closePanel: () =>
    set({
      selectedBlock: null,
      panelOpen: false,
    }),
}));
