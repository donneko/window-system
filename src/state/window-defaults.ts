import type { WindowStatus } from "../types/window-status.type.js";

export const DEFAULT_WINDOW_STATUS: WindowStatus = {
    isActive: true,
    isMinimized: false,
    isMaximized: false,
    isHidden: false,
};

export const DEFAULT_WINDOW_VALUES = {
    title: "Untitled window",
    titleDisplayType: "auto",
    iconUrl: "",
    contentUrl: "about:blank",
    x: 10,
    y: 10,
    width: 400,
    height: 250,
    minWidth: 150,
    minHeight: 80,
    movable: true,
    resizable: true,
    closable: true,
} as const;
