import type { WindowBounds } from "../types/window-config.type.js";

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type SizeConstraints = {
    minWidth: number;
    minHeight: number;
    maxWidth: number | null;
    maxHeight: number | null;
};

export function clampSize(value: number, minimum: number, maximum: number | null): number {
    return Math.min(Math.max(value, minimum), maximum ?? Infinity);
}

export function resizeBounds(
    start: WindowBounds,
    direction: ResizeDirection,
    deltaX: number,
    deltaY: number,
    constraints: SizeConstraints
): WindowBounds {
    let width = start.width;
    let height = start.height;
    let x = start.x;
    let y = start.y;
    if (direction.includes("e")) {
        width = clampSize(start.width + deltaX, constraints.minWidth, constraints.maxWidth);
    }
    if (direction.includes("s")) {
        height = clampSize(start.height + deltaY, constraints.minHeight, constraints.maxHeight);
    }
    if (direction.includes("w")) {
        width = clampSize(start.width - deltaX, constraints.minWidth, constraints.maxWidth);
        x = start.x + (start.width - width);
    }
    if (direction.includes("n")) {
        height = clampSize(start.height - deltaY, constraints.minHeight, constraints.maxHeight);
        y = start.y + (start.height - height);
    }
    return { x, y, width, height };
}

export function maximizeBounds(
    availableWidth: number,
    availableHeight: number,
    constraints: SizeConstraints
): WindowBounds {
    return {
        x: 0,
        y: 0,
        width: clampSize(availableWidth, constraints.minWidth, constraints.maxWidth),
        height: clampSize(availableHeight, constraints.minHeight, constraints.maxHeight),
    };
}
