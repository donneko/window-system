import type { WindowStatus } from "./window-status.type.js";

export type DisplayType = "auto" | "scroll" | "stint";

export type WindowBounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type WindowCreateConfig = {
    id?: string;
    title?: string;
    titleDisplayType?: DisplayType;
    iconUrl?: string;
    contentUrl?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    zIndex?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number | null;
    maxHeight?: number | null;
    movable?: boolean;
    resizable?: boolean;
    closable?: boolean;
    status?: Partial<WindowStatus>;
};

export type WindowChange = Omit<Partial<WindowCreateConfig>, "id">;

/** @deprecated Use WindowCreateConfig. */
export type WindowConfig = WindowCreateConfig;
