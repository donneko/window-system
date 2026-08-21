import { WindowSystemError } from "../errors/window-system-public-error.js";
import type { WindowCreateConfig } from "../types/window-config.type.js";
import type { WindowSnapshot } from "../types/window-snapshot.type.js";
import { DEFAULT_WINDOW_STATUS, DEFAULT_WINDOW_VALUES } from "./window-defaults.js";
import {
    booleanValue,
    displayTypeValue,
    finiteNumber,
    nonNegativeNumber,
    normalizeStatus,
    optionalMaximum,
    resolveWindowUrl,
    stringValue,
} from "./window-validation.js";

export function normalizeWindowInput(
    input: WindowCreateConfig | WindowSnapshot,
    id: string,
    zIndex: number
): WindowSnapshot {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new WindowSystemError("INVALID_CONFIG", "Window configuration must be an object.");
    }
    const minWidth = nonNegativeNumber(input.minWidth, DEFAULT_WINDOW_VALUES.minWidth, "minWidth");
    const minHeight = nonNegativeNumber(
        input.minHeight,
        DEFAULT_WINDOW_VALUES.minHeight,
        "minHeight"
    );
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
        Math.max(nonNegativeNumber(input.width, DEFAULT_WINDOW_VALUES.width, "width"), minWidth),
        maxWidth ?? Infinity
    );
    const height = Math.min(
        Math.max(
            nonNegativeNumber(input.height, DEFAULT_WINDOW_VALUES.height, "height"),
            minHeight
        ),
        maxHeight ?? Infinity
    );
    const restoreBounds = (input as Partial<WindowSnapshot>).restoreBounds;
    if (restoreBounds !== undefined && restoreBounds !== null) {
        finiteNumber(restoreBounds.x, 0, "restoreBounds.x");
        finiteNumber(restoreBounds.y, 0, "restoreBounds.y");
        nonNegativeNumber(restoreBounds.width, minWidth, "restoreBounds.width");
        nonNegativeNumber(restoreBounds.height, minHeight, "restoreBounds.height");
    }

    return {
        id,
        title: stringValue(input.title, DEFAULT_WINDOW_VALUES.title, "title"),
        titleDisplayType: displayTypeValue(
            input.titleDisplayType,
            DEFAULT_WINDOW_VALUES.titleDisplayType
        ),
        iconUrl: resolveWindowUrl(input.iconUrl, DEFAULT_WINDOW_VALUES.iconUrl, "iconUrl", "icon"),
        contentUrl: resolveWindowUrl(
            input.contentUrl,
            DEFAULT_WINDOW_VALUES.contentUrl,
            "contentUrl",
            "content"
        ),
        x: finiteNumber(input.x, DEFAULT_WINDOW_VALUES.x, "x"),
        y: finiteNumber(input.y, DEFAULT_WINDOW_VALUES.y, "y"),
        width,
        height,
        zIndex: finiteNumber(input.zIndex, zIndex, "zIndex"),
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        movable: booleanValue(input.movable, DEFAULT_WINDOW_VALUES.movable, "movable"),
        resizable: booleanValue(input.resizable, DEFAULT_WINDOW_VALUES.resizable, "resizable"),
        closable: booleanValue(input.closable, DEFAULT_WINDOW_VALUES.closable, "closable"),
        status: normalizeStatus(input.status, DEFAULT_WINDOW_STATUS),
        restoreBounds: restoreBounds ? { ...restoreBounds } : null,
    };
}
