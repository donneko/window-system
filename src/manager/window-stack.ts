import type { WindowSnapshot } from "../types/window-snapshot.type.js";
import type { WindowEntries } from "../types/window-stack.type.js";

export class WindowStack {
    constructor(private readonly entries: WindowEntries) {}

    nextZIndex(): number {
        return this.snapshots().reduce((maximum, item) => Math.max(maximum, item.zIndex), 999) + 1;
    }

    activate(id: string, raise = true): void {
        const windows = [...this.entries()];
        const target = windows.find(([windowId]) => windowId === id)?.[1];
        if (!target || target.snapshot().status.isHidden) return;
        for (const [windowId, window] of windows) window.setActive(windowId === id);
        if (raise) target.setZIndex(this.nextZIndex());
    }

    promote(excludedId?: string): void {
        const candidate = this.snapshots()
            .filter((item) => item.id !== excludedId && !item.status.isHidden)
            .at(-1);
        if (candidate) this.activate(candidate.id);
    }

    snapshots(): WindowSnapshot[] {
        return [...this.entries()]
            .map(([, window]) => window.snapshot())
            .sort((left, right) => left.zIndex - right.zIndex);
    }
}
