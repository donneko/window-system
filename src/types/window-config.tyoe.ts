export type DisplayType = "auto" | "scroll" | "stint";

export type WindowConfig = {
    id: string;
    title: string;
    titleDisplayType: DisplayType;

    baseElement: HTMLElement;

    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;

    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;

    movable: boolean;
    resizable: boolean;
    closable: boolean;
};
