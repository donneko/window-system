import type { WindowElements } from "../types/window-elements.type.js";
import type { ResizeDirection } from "../types/window-geometry.type.js";

const SELECTORS = {
    header: ".js-window-header-body",
    titleBox: ".js-window-header-title-box",
    title: ".js-window-header-title-text",
    icon: ".js-window-header-icon",
    content: ".js-window-content-box",
    iframe: ".js-window-content-frame",
    close: ".js-window-header-delete-button",
    resizeHandle: "[data-resize-direction]",
} as const;

function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Window template is missing ${selector}.`);
    return element;
}

export function getWindowElements(root: HTMLElement): WindowElements {
    const resizeHandles = [...root.querySelectorAll<HTMLElement>(SELECTORS.resizeHandle)].map(
        (element) => ({
            element,
            direction: element.dataset.resizeDirection as ResizeDirection,
        })
    );
    return {
        root,
        header: requiredElement(root, SELECTORS.header),
        titleBox: requiredElement(root, SELECTORS.titleBox),
        title: requiredElement(root, SELECTORS.title),
        icon: requiredElement(root, SELECTORS.icon),
        content: requiredElement(root, SELECTORS.content),
        iframe: requiredElement(root, SELECTORS.iframe),
        close: requiredElement(root, SELECTORS.close),
        resizeHandles,
    };
}
