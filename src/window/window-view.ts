import { WINDOW_BODY_HTML } from "../assets/html/template.js";
import type { WindowElements } from "../types/window-elements.type.js";
import type { WindowSnapshot } from "../types/window-snapshot.type.js";
import { getWindowElements } from "./window-elements.js";

export class WindowView {
    readonly elements: WindowElements;

    constructor(container: HTMLElement, state: WindowSnapshot) {
        const root = document.createElement("section");
        root.className = "window js-window-controller-window";
        root.innerHTML = WINDOW_BODY_HTML;
        root.dataset.windowId = state.id;
        root.setAttribute("role", "dialog");
        this.elements = getWindowElements(root);
        container.appendChild(root);
        this.render(state, false);
    }

    render(state: WindowSnapshot, interacting: boolean): void {
        this.renderBounds(state);
        this.renderClasses(state, interacting);
        const { root, title, icon, iframe, close } = this.elements;
        title.textContent = state.title;
        root.setAttribute("aria-label", state.title);
        if (state.iconUrl) icon.src = state.iconUrl;
        else icon.removeAttribute("src");
        if (iframe.src !== state.contentUrl) iframe.src = state.contentUrl;
        close.hidden = !state.closable;
        close.disabled = !state.closable;
        this.updateTitleDisplay(state);
    }

    renderBounds(state: WindowSnapshot): void {
        Object.assign(this.elements.root.style, {
            left: `${state.x}px`,
            top: `${state.y}px`,
            width: `${state.width}px`,
            height: `${state.height}px`,
            zIndex: String(state.zIndex),
        });
    }

    renderClasses(state: WindowSnapshot, interacting: boolean): void {
        const { root, content } = this.elements;
        root.classList.toggle("is-active", state.status.isActive);
        root.classList.toggle("is-hidden", state.status.isHidden);
        root.classList.toggle("is-minimized", state.status.isMinimized);
        root.classList.toggle("is-maximized", state.status.isMaximized);
        root.classList.toggle("is-icon", state.iconUrl !== "");
        root.classList.toggle("is-movable", state.movable);
        root.classList.toggle("is-resizable", state.resizable);
        root.classList.toggle("is-interacting", interacting);
        content.classList.toggle("is-drag", interacting);
    }

    private updateTitleDisplay(state: WindowSnapshot): void {
        const { title, titleBox } = this.elements;
        const shouldScroll =
            state.titleDisplayType === "scroll" ||
            (state.titleDisplayType === "auto" && title.scrollWidth > titleBox.clientWidth);
        title.classList.toggle("is-scroll-animation", shouldScroll);
    }

    capturePointer(pointerId: number): void {
        try {
            this.elements.root.setPointerCapture?.(pointerId);
        } catch {
            // Synthetic events and detached elements may not support pointer capture.
        }
    }

    releasePointer(pointerId: number): void {
        try {
            if (this.elements.root.hasPointerCapture?.(pointerId)) {
                this.elements.root.releasePointerCapture(pointerId);
            }
        } catch {
            // The browser may already have released capture after pointercancel.
        }
    }

    destroy(): void {
        this.elements.root.remove();
    }
}
