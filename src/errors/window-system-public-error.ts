export type WindowSystemErrorCode =
    "DUPLICATE_ID" | "INVALID_CONFIG" | "INVALID_ID" | "INVALID_URL" | "WINDOW_NOT_FOUND";

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
