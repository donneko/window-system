import { WindowSystemError } from "../errors/window-system-public-error.js";
import type { DisplayType, WindowChange, WindowCreateConfig } from "../types/window-config.type.js";
import type { WindowSnapshot } from "../types/window-snapshot.type.js";
import type { WindowStatus } from "../types/window-status.type.js";

const DISPLAY_TYPES = new Set<DisplayType>(["auto", "scroll", "stint"]);
const DEFAULT_STATUS: WindowStatus = {
    isActive: true,
    isMinimized: false,
    isMaximized: false,
    isHidden: false,
};

function finiteNumber(value: unknown, fallback: number, label: string): number {
    const result = value ?? fallback;
    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new WindowSystemError("INVALID_CONFIG", `${label} must be a finite number.`);
    }
    return result;
}

function nonNegative(value: unknown, fallback: number, label: string): number {
    const result = finiteNumber(value, fallback, label);
    if (result < 0) {
        throw new WindowSystemError("INVALID_CONFIG", `${label} must be zero or greater.`);
    }
    return result;
}

function optionalMaximum(value: unknown, label: string): number | null {
    if (value === undefined || value === null) return null;
    return nonNegative(value, 0, label);
}

function booleanValue(value: unknown, fallback: boolean, label: string): boolean {
    const result = value ?? fallback;
    if (typeof result !== "boolean") {
        throw new WindowSystemError("INVALID_CONFIG", `${label} must be a boolean.`);
    }
    return result;
}

function stringValue(value: unknown, fallback: string, label: string): string {
    const result = value ?? fallback;
    if (typeof result !== "string") {
        throw new WindowSystemError("INVALID_CONFIG", `${label} must be a string.`);
    }
    return result;
}

function resolveUrl(value: unknown, fallback: string, label: string, icon = false): string {
    const source = stringValue(value, fallback, label);
    if (source === "" && icon) return "";
    let url: URL;
    try {
        url = new URL(source, document.baseURI);
    } catch (cause) {
        throw new WindowSystemError("INVALID_URL", `${label} is not a valid URL.`, cause);
    }
    const protocols = icon
        ? new Set(["http:", "https:", "data:", "blob:"])
        : new Set(["http:", "https:", "about:", "blob:"]);
    if (!protocols.has(url.protocol)) {
        throw new WindowSystemError("INVALID_URL", `${label} uses an unsupported protocol.`);
    }
    return url.href;
}

function normalizeStatus(
    value: Partial<WindowStatus> | undefined,
    fallback: WindowStatus
): WindowStatus {
    const status: WindowStatus = {
        isActive: booleanValue(value?.isActive, fallback.isActive, "status.isActive"),
        isMinimized: booleanValue(value?.isMinimized, fallback.isMinimized, "status.isMinimized"),
        isMaximized: booleanValue(value?.isMaximized, fallback.isMaximized, "status.isMaximized"),
        isHidden: booleanValue(value?.isHidden, fallback.isHidden, "status.isHidden"),
    };
    if (status.isMinimized && status.isMaximized) {
        throw new WindowSystemError(
            "INVALID_CONFIG",
            "A window cannot be minimized and maximized at the same time."
        );
    }
    return status;
}

export function normalizeWindowInput(
    input: WindowCreateConfig | WindowSnapshot,
    id: string,
    zIndex: number
): WindowSnapshot {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new WindowSystemError("INVALID_CONFIG", "Window configuration must be an object.");
    }
    const titleDisplayType = input.titleDisplayType ?? "auto";
    if (!DISPLAY_TYPES.has(titleDisplayType)) {
        throw new WindowSystemError(
            "INVALID_CONFIG",
            "titleDisplayType must be auto, scroll, or stint."
        );
    }

    const minWidth = nonNegative(input.minWidth, 150, "minWidth");
    const minHeight = nonNegative(input.minHeight, 80, "minHeight");
    const maxWidth = optionalMaximum(input.maxWidth, "maxWidth");
    const maxHeight = optionalMaximum(input.maxHeight, "maxHeight");
    if (maxWidth !== null && maxWidth < minWidth) {
        throw new WindowSystemError(
            "INVALID_CONFIG",
            "maxWidth must be greater than or equal to minWidth."
        );
    }
    if (maxHeight !== null && maxHeight < minHeight) {
        throw new WindowSystemError(
            "INVALID_CONFIG",
            "maxHeight must be greater than or equal to minHeight."
        );
    }

    const width = Math.min(
        Math.max(nonNegative(input.width, 400, "width"), minWidth),
        maxWidth ?? Infinity
    );
    const height = Math.min(
        Math.max(nonNegative(input.height, 250, "height"), minHeight),
        maxHeight ?? Infinity
    );
    const snapshotInput = input as Partial<WindowSnapshot>;
    const restoreBounds = snapshotInput.restoreBounds;
    if (restoreBounds !== undefined && restoreBounds !== null) {
        finiteNumber(restoreBounds.x, 0, "restoreBounds.x");
        finiteNumber(restoreBounds.y, 0, "restoreBounds.y");
        nonNegative(restoreBounds.width, minWidth, "restoreBounds.width");
        nonNegative(restoreBounds.height, minHeight, "restoreBounds.height");
    }

    return {
        id,
        title: stringValue(input.title, "Untitled window", "title"),
        titleDisplayType,
        iconUrl: resolveUrl(input.iconUrl, "", "iconUrl", true),
        contentUrl: resolveUrl(input.contentUrl, "about:blank", "contentUrl"),
        x: finiteNumber(input.x, 10, "x"),
        y: finiteNumber(input.y, 10, "y"),
        width,
        height,
        zIndex: finiteNumber(input.zIndex, zIndex, "zIndex"),
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        movable: booleanValue(input.movable, true, "movable"),
        resizable: booleanValue(input.resizable, true, "resizable"),
        closable: booleanValue(input.closable, true, "closable"),
        status: normalizeStatus(input.status, DEFAULT_STATUS),
        restoreBounds: restoreBounds ? { ...restoreBounds } : null,
    };
}

export function applyWindowPatch(current: WindowSnapshot, patch: WindowChange): WindowSnapshot {
    const nextStatus = { ...current.status, ...patch.status };
    if (patch.status?.isMaximized === true) nextStatus.isMinimized = false;
    if (patch.status?.isMinimized === true) nextStatus.isMaximized = false;
    return normalizeWindowInput(
        {
            ...current,
            ...patch,
            id: current.id,
            status: nextStatus,
            restoreBounds: current.restoreBounds,
        } as WindowSnapshot,
        current.id,
        current.zIndex
    );
}
