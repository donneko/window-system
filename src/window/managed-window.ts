import { maximizeBounds } from "../geometry/window-geometry.js";
import { applyWindowUpdate } from "../state/apply-window-update.js";
import type { ManagedWindowCallbacks } from "../types/managed-window.type.js";
import type { WindowBounds, WindowUpdate } from "../types/window-config.type.js";
import type { WindowSnapshot } from "../types/window-snapshot.type.js";
import { WindowPointerController } from "./window-pointer-controller.js";
import { WindowView } from "./window-view.js";

export class ManagedWindow {
    private state: WindowSnapshot;
    private readonly view: WindowView;
    private readonly pointerController: WindowPointerController;
    private interacting = false;
    private destroyed = false;

    constructor(
        private readonly container: HTMLElement,
        initialState: WindowSnapshot,
        callbacks: ManagedWindowCallbacks
    ) {
        this.state = structuredClone(initialState);
        if (this.state.status.isMaximized) this.enterMaximized();
        this.view = new WindowView(container, this.state);
        this.pointerController = new WindowPointerController(this.view, {
            getState: () => this.state,
            activate: () => callbacks.activate(this.state.id),
            close: () => callbacks.close(this.state.id),
            updateBounds: (bounds) => this.updateBounds(bounds),
            setInteracting: (interacting) => this.setInteracting(interacting),
        });
    }

    update(update: WindowUpdate): void {
        const previous = this.snapshot();
        const wasMaximized = previous.status.isMaximized;
        const next = applyWindowUpdate(previous, update);
        if (wasMaximized && next.status.isMaximized) {
            const restore = previous.restoreBounds ?? this.boundsFrom(previous);
            next.restoreBounds = {
                x: update.x ?? restore.x,
                y: update.y ?? restore.y,
                width: update.width ?? restore.width,
                height: update.height ?? restore.height,
            };
            Object.assign(next, this.boundsFrom(previous));
        }
        this.state = next;
        if (!wasMaximized && this.state.status.isMaximized) this.enterMaximized();
        if (wasMaximized && !this.state.status.isMaximized) this.leaveMaximized();
        this.view.render(this.state, this.interacting);
    }

    setActive(active: boolean): void {
        this.state.status.isActive = active;
        this.view.renderClasses(this.state, this.interacting);
    }

    setZIndex(zIndex: number): void {
        this.state.zIndex = zIndex;
        this.view.renderBounds(this.state);
    }

    snapshot(): WindowSnapshot {
        return structuredClone(this.state);
    }

    destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        this.pointerController.destroy();
        this.view.destroy();
    }

    private updateBounds(bounds: WindowBounds): void {
        Object.assign(this.state, bounds);
        this.view.renderBounds(this.state);
    }

    private setInteracting(interacting: boolean): void {
        this.interacting = interacting;
        this.view.renderClasses(this.state, interacting);
    }

    private enterMaximized(): void {
        if (!this.state.restoreBounds) this.state.restoreBounds = this.boundsFrom(this.state);
        const availableWidth =
            this.container.clientWidth || globalThis.innerWidth || this.state.width;
        const availableHeight =
            this.container.clientHeight || globalThis.innerHeight || this.state.height;
        Object.assign(
            this.state,
            maximizeBounds(availableWidth, availableHeight, {
                minWidth: this.state.minWidth,
                minHeight: this.state.minHeight,
                maxWidth: this.state.maxWidth,
                maxHeight: this.state.maxHeight,
            })
        );
    }

    private leaveMaximized(): void {
        if (!this.state.restoreBounds) return;
        Object.assign(this.state, this.state.restoreBounds);
        this.state.restoreBounds = null;
    }

    private boundsFrom(state: WindowSnapshot): WindowBounds {
        return {
            x: state.x,
            y: state.y,
            width: state.width,
            height: state.height,
        };
    }
}
