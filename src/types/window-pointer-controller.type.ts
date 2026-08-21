import type { WindowBounds } from "./window-config.type.js";
import type { ResizeDirection } from "./window-geometry.type.js";
import type { WindowSnapshot } from "./window-snapshot.type.js";

export type PointerSession = {
    pointerId: number;
    mode: "move" | "resize";
    direction?: ResizeDirection;
    startClientX: number;
    startClientY: number;
    startBounds: WindowBounds;
};

export type WindowPointerCallbacks = {
    getState(): WindowSnapshot;
    activate(): void;
    close(): void;
    updateBounds(bounds: WindowBounds): void;
    setInteracting(interacting: boolean): void;
};
