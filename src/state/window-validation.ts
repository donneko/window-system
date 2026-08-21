import { WindowSystemError } from "../errors/window-system-public-error.js";
import type { DisplayType } from "../types/window-config.type.js";
import type { WindowStatus } from "../types/window-status.type.js";

const DISPLAY_TYPES = new Set<DisplayType>(["auto", "scroll", "stint"]);
const CONTENT_PROTOCOLS = new Set(["http:", "https:", "about:", "blob:"]);
const ICON_PROTOCOLS = new Set(["http:", "https:", "data:", "blob:"]);

export function finiteNumber(value: unknown, fallback: number, label: string): number {
    const result = value ?? fallback;
    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new WindowSystemError("INVALID_CONFIG", `${label} must be a finite number.`);
    }
    return result;
}

export function nonNegativeNumber(value: unknown, fallback: number, label: string): number {
    const result = finiteNumber(value, fallback, label);
    if (result < 0) {
        throw new WindowSystemError("INVALID_CONFIG", `${label} must be zero or greater.`);
    }
    return result;
}

export function optionalMaximum(value: unknown, label: string): number | null {
    if (value === undefined || value === null) return null;
    return nonNegativeNumber(value, 0, label);
}

export function booleanValue(value: unknown, fallback: boolean, label: string): boolean {
    const result = value ?? fallback;
    if (typeof result !== "boolean") {
        throw new WindowSystemError("INVALID_CONFIG", `${label} must be a boolean.`);
    }
    return result;
}

export function stringValue(value: unknown, fallback: string, label: string): string {
    const result = value ?? fallback;
    if (typeof result !== "string") {
        throw new WindowSystemError("INVALID_CONFIG", `${label} must be a string.`);
    }
    return result;
}

export function displayTypeValue(value: unknown, fallback: DisplayType): DisplayType {
    const result = value ?? fallback;
    if (typeof result !== "string" || !DISPLAY_TYPES.has(result as DisplayType)) {
        throw new WindowSystemError(
            "INVALID_CONFIG",
            "titleDisplayType must be auto, scroll, or stint."
        );
    }
    return result as DisplayType;
}

export function resolveWindowUrl(
    value: unknown,
    fallback: string,
    label: string,
    kind: "content" | "icon"
): string {
    const source = stringValue(value, fallback, label);
    if (source === "" && kind === "icon") return "";
    let url: URL;
    try {
        url = new URL(source, document.baseURI);
    } catch (cause) {
        throw new WindowSystemError("INVALID_URL", `${label} is not a valid URL.`, cause);
    }
    const protocols = kind === "icon" ? ICON_PROTOCOLS : CONTENT_PROTOCOLS;
    if (!protocols.has(url.protocol)) {
        throw new WindowSystemError("INVALID_URL", `${label} uses an unsupported protocol.`);
    }
    return url.href;
}

export function normalizeStatus(
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
