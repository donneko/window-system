import type { ResizeDirection } from "./window-geometry.type.js";

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
