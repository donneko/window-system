import { WindowSystemError } from "../errors/window-system-public-error.js";
import { normalizeWindowInput } from "../state/normalize-window.js";
import type { WindowUpdate } from "../types/window-config.type.js";
import type { WindowInput, WindowSnapshot } from "../types/window-snapshot.type.js";
import { ManagedWindow } from "../window/managed-window.js";
import { WindowStack } from "./window-stack.js";

export type WindowManagerOptions = {
    container?: HTMLElement;
};

function assertId(id: unknown): asserts id is string {
    if (typeof id !== "string" || id.trim() === "") {
        throw new WindowSystemError("INVALID_ID", "Window id must be a non-empty string.");
    }
}

export class WindowManager {
    private readonly container: HTMLElement;
    private readonly windows = new Map<string, ManagedWindow>();
    private readonly stack = new WindowStack(() => this.windows.entries());
    private idSequence = 0;
    private destroyed = false;

    constructor(options: WindowManagerOptions = {}) {
        if (typeof document === "undefined") {
            throw new WindowSystemError("INVALID_CONFIG", "WindowSystem requires a browser DOM.");
        }
        const container = options.container ?? document.body;
        if (!(container instanceof HTMLElement)) {
            throw new WindowSystemError("INVALID_CONFIG", "container must be an HTMLElement.");
        }
        this.container = container;
    }

    createWindow(input: WindowInput): string {
        this.assertUsable();
        const requestedId =
            input && typeof input === "object" ? (input as { id?: unknown }).id : undefined;
        if (requestedId !== undefined) assertId(requestedId);
        const id = requestedId ?? this.createId();
        if (this.windows.has(id)) {
            throw new WindowSystemError("DUPLICATE_ID", `A window with id "${id}" already exists.`);
        }

        const state = normalizeWindowInput(input, id, this.stack.nextZIndex());
        const window = new ManagedWindow(this.container, state, {
            activate: (targetId) => this.stack.activate(targetId),
            close: (targetId) => this.removeWindow(targetId),
        });
        this.windows.set(id, window);
        if (state.status.isActive && !state.status.isHidden) {
            const isSnapshotRestore = "restoreBounds" in input;
            this.stack.activate(id, !isSnapshotRestore);
        }
        return id;
    }

    removeWindow(id: string): void {
        this.assertUsable();
        const window = this.requireWindow(id);
        const wasActive = window.snapshot().status.isActive;
        window.destroy();
        this.windows.delete(id);
        if (wasActive) this.stack.promote();
    }

    updateWindow(id: string, update: WindowUpdate): void {
        this.assertUsable();
        if (!update || typeof update !== "object" || Array.isArray(update)) {
            throw new WindowSystemError("INVALID_CONFIG", "Window update must be an object.");
        }
        const window = this.requireWindow(id);
        const wasActive = window.snapshot().status.isActive;
        window.update(update);
        const current = window.snapshot();
        if (update.status?.isActive === true && !current.status.isHidden) {
            this.stack.activate(id);
        } else if (wasActive && (current.status.isHidden || update.status?.isActive === false)) {
            window.setActive(false);
            this.stack.promote(id);
        }
    }

    getWindow(id: string): WindowSnapshot {
        this.assertUsable();
        return this.requireWindow(id).snapshot();
    }

    getWindows(): WindowSnapshot[] {
        this.assertUsable();
        return this.stack.snapshots();
    }

    destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        for (const window of this.windows.values()) window.destroy();
        this.windows.clear();
    }

    private createId(): string {
        let id: string;
        do {
            this.idSequence += 1;
            id = `window-${Date.now()}-${this.idSequence}`;
        } while (this.windows.has(id));
        return id;
    }

    private requireWindow(id: string): ManagedWindow {
        assertId(id);
        const window = this.windows.get(id);
        if (!window) {
            throw new WindowSystemError("WINDOW_NOT_FOUND", `Window "${id}" was not found.`);
        }
        return window;
    }

    private assertUsable(): void {
        if (this.destroyed) {
            throw new WindowSystemError(
                "MANAGER_DESTROYED",
                "This WindowManager has been destroyed."
            );
        }
    }
}
