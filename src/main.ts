import { WindowManager } from "./app/window-manager.js";
import type { WindowSystemAPI, WindowSystemOptions } from "./app/window-manager.js";

export function createWindowSystem(options: WindowSystemOptions = {}): WindowSystemAPI {
    return new WindowManager(options).api();
}

export { WindowSystemError } from "./errors/window-system-public-error.js";
export type { WindowSystemErrorCode } from "./errors/window-system-public-error.js";
export type { WindowSystemAPI, WindowSystemOptions } from "./app/window-manager.js";
export type {
    DisplayType,
    WindowBounds,
    WindowChange,
    WindowConfig,
    WindowCreateConfig,
} from "./types/window-config.type.js";
export type { WindowInput, WindowSnapshot } from "./types/window-snapshot.type.js";
export type { WindowStatus } from "./types/window-status.type.js";
