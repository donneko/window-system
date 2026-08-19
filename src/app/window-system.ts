import { WINDOW_BODY_HTML } from "../assets/html/template.js";
import type { WindowBounds, WindowChange } from "../types/window-config.type.js";
import type { WindowSnapshot } from "../types/window-snapshot.type.js";
import { applyWindowPatch } from "./window-state.js";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type PointerSession = {
    pointerId: number;
    mode: "move" | "resize";
    direction?: ResizeDirection;
    startClientX: number;
    startClientY: number;
    startBounds: WindowBounds;
};

export type WindowSystemCallbacks = {
    activate(id: string): void;
    close(id: string): void;
};

function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Window template is missing ${selector}.`);
    return element;
}

function clamp(value: number, minimum: number, maximum: number | null): number {
    return Math.min(Math.max(value, minimum), maximum ?? Infinity);
}

export class WindowSystem {
    private state: WindowSnapshot;
    private readonly baseElement: HTMLElement;
    private readonly callbacks: WindowSystemCallbacks;
    private readonly cleanup: Array<() => void> = [];
    private pointerSession: PointerSession | null = null;

    private readonly rootElement: HTMLElement;
    private readonly headerElement: HTMLElement;
    private readonly titleBoxElement: HTMLElement;
    private readonly titleElement: HTMLElement;
    private readonly iconElement: HTMLImageElement;
    private readonly contentElement: HTMLElement;
    private readonly iframeElement: HTMLIFrameElement;
    private readonly closeElement: HTMLButtonElement;

    constructor(
        baseElement: HTMLElement,
        initialState: WindowSnapshot,
        callbacks: WindowSystemCallbacks
    ) {
        this.baseElement = baseElement;
        this.state = structuredClone(initialState);
        this.callbacks = callbacks;

        this.rootElement = document.createElement("section");
        this.rootElement.className = "window js-window-controller-window";
        this.rootElement.innerHTML = WINDOW_BODY_HTML;
        this.rootElement.dataset.windowId = this.state.id;
        this.rootElement.setAttribute("role", "dialog");

        this.headerElement = requiredElement(this.rootElement, ".js-window-header-body");
        this.titleBoxElement = requiredElement(this.rootElement, ".js-window-header-title-box");
        this.titleElement = requiredElement(this.rootElement, ".js-window-header-title-text");
        this.iconElement = requiredElement(this.rootElement, ".js-window-header-icon");
        this.contentElement = requiredElement(this.rootElement, ".js-window-content-box");
        this.iframeElement = requiredElement(this.rootElement, ".js-window-content-frame");
        this.closeElement = requiredElement(this.rootElement, ".js-window-header-delete-button");

        this.baseElement.appendChild(this.rootElement);
        this.bindEvents();
        if (this.state.status.isMaximized) this.enterMaximized();
        this.render();
    }

    private listen(
        target: EventTarget,
        type: string,
        listener: EventListener,
        options?: AddEventListenerOptions
    ): void {
        target.addEventListener(type, listener, options);
        this.cleanup.push(() => target.removeEventListener(type, listener, options));
    }

    private bindEvents(): void {
        this.listen(this.rootElement, "pointerdown", (() => {
            this.callbacks.activate(this.state.id);
        }) as EventListener);

        this.listen(this.headerElement, "pointerdown", ((event: PointerEvent) => {
            if (event.button !== 0 || !this.state.movable || this.state.status.isMaximized) return;
            if ((event.target as Element | null)?.closest("button")) return;
            this.startPointerSession(event, "move");
        }) as EventListener);

        for (const handle of this.rootElement.querySelectorAll<HTMLElement>(
            "[data-resize-direction]"
        )) {
            this.listen(handle, "pointerdown", ((event: PointerEvent) => {
                if (event.button !== 0 || !this.state.resizable || this.state.status.isMaximized)
                    return;
                this.startPointerSession(
                    event,
                    "resize",
                    handle.dataset.resizeDirection as ResizeDirection
                );
            }) as EventListener);
        }

        this.listen(this.rootElement, "pointermove", ((event: PointerEvent) => {
            this.continuePointerSession(event);
        }) as EventListener);
        this.listen(this.rootElement, "pointerup", ((event: PointerEvent) => {
            this.endPointerSession(event);
        }) as EventListener);
        this.listen(this.rootElement, "pointercancel", ((event: PointerEvent) => {
            this.endPointerSession(event);
        }) as EventListener);

        this.listen(this.closeElement, "click", ((event: Event) => {
            event.stopPropagation();
            if (this.state.closable) this.callbacks.close(this.state.id);
        }) as EventListener);
    }

    private startPointerSession(
        event: PointerEvent,
        mode: "move" | "resize",
        direction?: ResizeDirection
    ): void {
        event.preventDefault();
        this.callbacks.activate(this.state.id);
        const session: PointerSession = {
            pointerId: event.pointerId,
            mode,
            startClientX: event.clientX,
            startClientY: event.clientY,
            startBounds: this.currentBounds(),
        };
        if (direction) session.direction = direction;
        this.pointerSession = session;
        this.rootElement.classList.add("is-interacting");
        try {
            this.rootElement.setPointerCapture?.(event.pointerId);
        } catch {
            // Pointer capture can fail when a synthetic event is used.
        }
    }

    private continuePointerSession(event: PointerEvent): void {
        const session = this.pointerSession;
        if (!session || session.pointerId !== event.pointerId) return;
        event.preventDefault();
        const deltaX = event.clientX - session.startClientX;
        const deltaY = event.clientY - session.startClientY;
        if (session.mode === "move") {
            this.state.x = session.startBounds.x + deltaX;
            this.state.y = session.startBounds.y + deltaY;
        } else if (session.direction) {
            this.resizeFromPointer(session.direction, session.startBounds, deltaX, deltaY);
        }
        this.renderBounds();
    }

    private resizeFromPointer(
        direction: ResizeDirection,
        start: WindowBounds,
        deltaX: number,
        deltaY: number
    ): void {
        let width = start.width;
        let height = start.height;
        let x = start.x;
        let y = start.y;

        if (direction.includes("e"))
            width = clamp(start.width + deltaX, this.state.minWidth, this.state.maxWidth);
        if (direction.includes("s"))
            height = clamp(start.height + deltaY, this.state.minHeight, this.state.maxHeight);
        if (direction.includes("w")) {
            width = clamp(start.width - deltaX, this.state.minWidth, this.state.maxWidth);
            x = start.x + (start.width - width);
        }
        if (direction.includes("n")) {
            height = clamp(start.height - deltaY, this.state.minHeight, this.state.maxHeight);
            y = start.y + (start.height - height);
        }

        Object.assign(this.state, { x, y, width, height });
    }

    private endPointerSession(event: PointerEvent): void {
        if (!this.pointerSession || this.pointerSession.pointerId !== event.pointerId) return;
        try {
            if (this.rootElement.hasPointerCapture?.(event.pointerId)) {
                this.rootElement.releasePointerCapture(event.pointerId);
            }
        } catch {
            // The browser may already have released capture after pointercancel.
        }
        this.pointerSession = null;
        this.rootElement.classList.remove("is-interacting");
        this.render();
    }

    private currentBounds(): WindowBounds {
        return {
            x: this.state.x,
            y: this.state.y,
            width: this.state.width,
            height: this.state.height,
        };
    }

    private enterMaximized(): void {
        if (!this.state.restoreBounds) this.state.restoreBounds = this.currentBounds();
        const availableWidth =
            this.baseElement.clientWidth || globalThis.innerWidth || this.state.width;
        const availableHeight =
            this.baseElement.clientHeight || globalThis.innerHeight || this.state.height;
        this.state.x = 0;
        this.state.y = 0;
        this.state.width = clamp(availableWidth, this.state.minWidth, this.state.maxWidth);
        this.state.height = clamp(availableHeight, this.state.minHeight, this.state.maxHeight);
    }

    private leaveMaximized(): void {
        if (!this.state.restoreBounds) return;
        Object.assign(this.state, this.state.restoreBounds);
        this.state.restoreBounds = null;
    }

    change(patch: WindowChange): void {
        const previous = this.snapshot();
        const wasMaximized = previous.status.isMaximized;
        const next = applyWindowPatch(previous, patch);

        if (wasMaximized && next.status.isMaximized) {
            const restore = previous.restoreBounds ?? {
                x: previous.x,
                y: previous.y,
                width: previous.width,
                height: previous.height,
            };
            next.restoreBounds = {
                x: patch.x ?? restore.x,
                y: patch.y ?? restore.y,
                width: patch.width ?? restore.width,
                height: patch.height ?? restore.height,
            };
            next.x = previous.x;
            next.y = previous.y;
            next.width = previous.width;
            next.height = previous.height;
        }

        this.state = next;
        if (!wasMaximized && this.state.status.isMaximized) this.enterMaximized();
        if (wasMaximized && !this.state.status.isMaximized) this.leaveMaximized();
        this.render();
    }

    setActive(active: boolean): void {
        this.state.status.isActive = active;
        this.renderClasses();
    }

    setZIndex(zIndex: number): void {
        this.state.zIndex = zIndex;
        this.rootElement.style.zIndex = String(zIndex);
    }

    snapshot(): WindowSnapshot {
        return structuredClone(this.state);
    }

    private render(): void {
        this.renderBounds();
        this.renderClasses();
        this.titleElement.textContent = this.state.title;
        this.rootElement.setAttribute("aria-label", this.state.title);

        if (this.state.iconUrl) {
            this.iconElement.src = this.state.iconUrl;
        } else {
            this.iconElement.removeAttribute("src");
        }
        if (this.iframeElement.src !== this.state.contentUrl)
            this.iframeElement.src = this.state.contentUrl;
        this.closeElement.hidden = !this.state.closable;
        this.closeElement.disabled = !this.state.closable;
        this.updateTitleDisplay();
    }

    private renderBounds(): void {
        Object.assign(this.rootElement.style, {
            left: `${this.state.x}px`,
            top: `${this.state.y}px`,
            width: `${this.state.width}px`,
            height: `${this.state.height}px`,
            zIndex: String(this.state.zIndex),
        });
    }

    private renderClasses(): void {
        this.rootElement.classList.toggle("is-active", this.state.status.isActive);
        this.rootElement.classList.toggle("is-hidden", this.state.status.isHidden);
        this.rootElement.classList.toggle("is-minimized", this.state.status.isMinimized);
        this.rootElement.classList.toggle("is-maximized", this.state.status.isMaximized);
        this.rootElement.classList.toggle("is-icon", this.state.iconUrl !== "");
        this.rootElement.classList.toggle("is-movable", this.state.movable);
        this.rootElement.classList.toggle("is-resizable", this.state.resizable);
        this.contentElement.classList.toggle("is-drag", this.pointerSession !== null);
    }

    private updateTitleDisplay(): void {
        const shouldScroll =
            this.state.titleDisplayType === "scroll" ||
            (this.state.titleDisplayType === "auto" &&
                this.titleElement.scrollWidth > this.titleBoxElement.clientWidth);
        this.titleElement.classList.toggle("is-scroll-animation", shouldScroll);
    }

    destroy(): void {
        if (this.pointerSession) {
            try {
                this.rootElement.releasePointerCapture?.(this.pointerSession.pointerId);
            } catch {
                // Ignore cleanup errors for detached pointers.
            }
        }
        this.pointerSession = null;
        for (const dispose of this.cleanup.splice(0)) dispose();
        this.rootElement.remove();
    }
}
