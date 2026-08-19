import type { ResizeDirection } from "../geometry/window-geometry.js";

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

export type WindowElements = {
    root: HTMLElement;
    header: HTMLElement;
    titleBox: HTMLElement;
    title: HTMLElement;
    icon: HTMLImageElement;
    content: HTMLElement;
    iframe: HTMLIFrameElement;
    close: HTMLButtonElement;
    resizeHandles: ReadonlyArray<{
        element: HTMLElement;
        direction: ResizeDirection;
    }>;
};

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
