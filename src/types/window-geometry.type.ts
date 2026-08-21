export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type SizeConstraints = {
    minWidth: number;
    minHeight: number;
    maxWidth: number | null;
    maxHeight: number | null;
};
