import type { WindowSystemErrorCode } from "../types/window-system-error.type.js";

export class WindowSystemError extends Error {
    readonly code: WindowSystemErrorCode;
    readonly details: unknown;

    constructor(code: WindowSystemErrorCode, message: string, details?: unknown) {
        super(message);
        this.name = "WindowSystemError";
        this.code = code;
        this.details = details;
    }
}
