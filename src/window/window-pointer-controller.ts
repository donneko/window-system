import { resizeBounds } from "../geometry/window-geometry.js";
import { Disposer } from "../shared/disposer.js";
import type { ResizeDirection, SizeConstraints } from "../types/window-geometry.type.js";
import type { WindowSnapshot } from "../types/window-snapshot.type.js";
import type {
    PointerSession,
    WindowPointerCallbacks,
} from "../types/window-pointer-controller.type.js";
import type { WindowView } from "./window-view.js";

function constraintsFrom(state: WindowSnapshot): SizeConstraints {
    return {
        minWidth: state.minWidth,
        minHeight: state.minHeight,
        maxWidth: state.maxWidth,
        maxHeight: state.maxHeight,
    };
}

export class WindowPointerController {
    private readonly disposer = new Disposer();
    private session: PointerSession | null = null;

    constructor(
        private readonly view: WindowView,
        private readonly callbacks: WindowPointerCallbacks
    ) {
        this.bindEvents();
    }

    private bindEvents(): void {
        const { root, header, close, resizeHandles } = this.view.elements;
        this.disposer.listen(root, "pointerdown", (() =>
            this.callbacks.activate()) as EventListener);
        this.disposer.listen(header, "pointerdown", ((event: PointerEvent) => {
            const state = this.callbacks.getState();
            if (event.button !== 0 || !state.movable || state.status.isMaximized) return;
            if ((event.target as Element | null)?.closest("button")) return;
            this.start(event, "move");
        }) as EventListener);
        for (const handle of resizeHandles) {
            this.disposer.listen(handle.element, "pointerdown", ((event: PointerEvent) => {
                const state = this.callbacks.getState();
                if (event.button !== 0 || !state.resizable || state.status.isMaximized) return;
                this.start(event, "resize", handle.direction);
            }) as EventListener);
        }
        this.disposer.listen(root, "pointermove", ((event: PointerEvent) =>
            this.move(event)) as EventListener);
        this.disposer.listen(root, "pointerup", ((event: PointerEvent) =>
            this.end(event)) as EventListener);
        this.disposer.listen(root, "pointercancel", ((event: PointerEvent) =>
            this.end(event)) as EventListener);
        this.disposer.listen(close, "click", ((event: Event) => {
            event.stopPropagation();
            if (this.callbacks.getState().closable) this.callbacks.close();
        }) as EventListener);
    }

    private start(event: PointerEvent, mode: "move" | "resize", direction?: ResizeDirection): void {
        event.preventDefault();
        const state = this.callbacks.getState();
        const session: PointerSession = {
            pointerId: event.pointerId,
            mode,
            startClientX: event.clientX,
            startClientY: event.clientY,
            startBounds: {
                x: state.x,
                y: state.y,
                width: state.width,
                height: state.height,
            },
        };
        if (direction) session.direction = direction;
        this.session = session;
        this.callbacks.setInteracting(true);
        this.view.capturePointer(event.pointerId);
    }

    private move(event: PointerEvent): void {
        const session = this.session;
        if (!session || session.pointerId !== event.pointerId) return;
        event.preventDefault();
        const deltaX = event.clientX - session.startClientX;
        const deltaY = event.clientY - session.startClientY;
        if (session.mode === "move") {
            this.callbacks.updateBounds({
                ...session.startBounds,
                x: session.startBounds.x + deltaX,
                y: session.startBounds.y + deltaY,
            });
            return;
        }
        if (session.direction) {
            this.callbacks.updateBounds(
                resizeBounds(
                    session.startBounds,
                    session.direction,
                    deltaX,
                    deltaY,
                    constraintsFrom(this.callbacks.getState())
                )
            );
        }
    }

    private end(event: PointerEvent): void {
        if (!this.session || this.session.pointerId !== event.pointerId) return;
        this.view.releasePointer(event.pointerId);
        this.session = null;
        this.callbacks.setInteracting(false);
    }

    destroy(): void {
        if (this.session) this.view.releasePointer(this.session.pointerId);
        this.session = null;
        this.callbacks.setInteracting(false);
        this.disposer.dispose();
    }
}
