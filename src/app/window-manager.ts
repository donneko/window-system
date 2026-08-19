import { WindowSystemError } from "../errors/window-system-public-error.js";
import type { WindowChange, WindowCreateConfig } from "../types/window-config.type.js";
import type { WindowInput, WindowSnapshot } from "../types/window-snapshot.type.js";
import { WindowSystem } from "./window-system.js";
import { normalizeWindowInput } from "./window-state.js";

export type WindowSystemOptions = {
    baseElement?: HTMLElement;
};

export type WindowSystemAPI = {
    create(config: WindowInput): string;
    delete(id: string): void;
    change(id: string, patch: WindowChange): void;
    window(id: string): WindowSnapshot;
    allWindow(): WindowSnapshot[];
};

function assertId(id: unknown): asserts id is string {
    if (typeof id !== "string" || id.trim() === "") {
        throw new WindowSystemError("INVALID_ID", "Window id must be a non-empty string.");
    }
}

export class WindowManager {
    private readonly baseElement: HTMLElement;
    private readonly windows = new Map<string, WindowSystem>();
    private idSequence = 0;

    constructor(options: WindowSystemOptions = {}) {
        if (typeof document === "undefined") {
            throw new WindowSystemError("INVALID_CONFIG", "WindowSystem requires a browser DOM.");
        }
        const baseElement = options.baseElement ?? document.body;
        if (!(baseElement instanceof HTMLElement)) {
            throw new WindowSystemError("INVALID_CONFIG", "baseElement must be an HTMLElement.");
        }
        this.baseElement = baseElement;
    }

    private createId(): string {
        let id: string;
        do {
            this.idSequence += 1;
            id = `window-${Date.now()}-${this.idSequence}`;
        } while (this.windows.has(id));
        return id;
    }

    private nextZIndex(): number {
        return this.allWindow().reduce((maximum, item) => Math.max(maximum, item.zIndex), 999) + 1;
    }

    create(input: WindowInput): string {
        const requestedId = (input as WindowCreateConfig).id;
        if (requestedId !== undefined) assertId(requestedId);
        const id = requestedId ?? this.createId();
        if (this.windows.has(id)) {
            throw new WindowSystemError("DUPLICATE_ID", `A window with id "${id}" already exists.`);
        }

        const state = normalizeWindowInput(input, id, this.nextZIndex());
        const windowSystem = new WindowSystem(this.baseElement, state, {
            activate: (targetId) => this.activate(targetId),
            close: (targetId) => this.delete(targetId),
        });
        this.windows.set(id, windowSystem);

        if (state.status.isActive && !state.status.isHidden) {
            const isSnapshotRestore = "restoreBounds" in input;
            if (isSnapshotRestore) {
                for (const [windowId, item] of this.windows) item.setActive(windowId === id);
            } else {
                this.activate(id);
            }
        }
        return id;
    }

    delete(id: string): void {
        const windowSystem = this.getWindow(id);
        const wasActive = windowSystem.snapshot().status.isActive;
        windowSystem.destroy();
        this.windows.delete(id);
        if (wasActive) this.promoteTopWindow();
    }

    change(id: string, patch: WindowChange): void {
        if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
            throw new WindowSystemError("INVALID_CONFIG", "Window patch must be an object.");
        }
        const windowSystem = this.getWindow(id);
        const wasActive = windowSystem.snapshot().status.isActive;
        windowSystem.change(patch);
        const current = windowSystem.snapshot();

        if (patch.status?.isActive === true && !current.status.isHidden) {
            this.activate(id);
        } else if (wasActive && (current.status.isHidden || patch.status?.isActive === false)) {
            windowSystem.setActive(false);
            this.promoteTopWindow(id);
        }
    }

    window(id: string): WindowSnapshot {
        return this.getWindow(id).snapshot();
    }

    allWindow(): WindowSnapshot[] {
        return [...this.windows.values()]
            .map((item) => item.snapshot())
            .sort((left, right) => left.zIndex - right.zIndex);
    }

    private getWindow(id: string): WindowSystem {
        assertId(id);
        const windowSystem = this.windows.get(id);
        if (!windowSystem) {
            throw new WindowSystemError("WINDOW_NOT_FOUND", `Window "${id}" was not found.`);
        }
        return windowSystem;
    }

    private activate(id: string): void {
        const target = this.getWindow(id);
        if (target.snapshot().status.isHidden) return;
        const zIndex = this.nextZIndex();
        for (const [windowId, windowSystem] of this.windows) {
            windowSystem.setActive(windowId === id);
        }
        target.setZIndex(zIndex);
    }

    private promoteTopWindow(excludedId?: string): void {
        const candidate = this.allWindow()
            .filter((item) => item.id !== excludedId && !item.status.isHidden)
            .at(-1);
        if (candidate) this.activate(candidate.id);
    }

    api(): WindowSystemAPI {
        return {
            create: (config) => this.create(config),
            delete: (id) => this.delete(id),
            change: (id, patch) => this.change(id, patch),
            window: (id) => this.window(id),
            allWindow: () => this.allWindow(),
        };
    }
}
