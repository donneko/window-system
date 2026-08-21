import type { DisplayType, WindowBounds, WindowCreateConfig } from "./window-config.type.js";
import type { WindowStatus } from "./window-status.type.js";

export type WindowSnapshot = {
    id: string;
    title: string;
    titleDisplayType: DisplayType;
    iconUrl: string;
    contentUrl: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number | null;
    maxHeight: number | null;
    movable: boolean;
    resizable: boolean;
    closable: boolean;
    status: WindowStatus;
    restoreBounds: WindowBounds | null;
};

export type WindowInput = WindowCreateConfig | WindowSnapshot;
