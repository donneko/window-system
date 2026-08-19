import type { WindowUpdate } from "../types/window-config.type.js";
import type { WindowSnapshot } from "../types/window-snapshot.type.js";
import { normalizeWindowInput } from "./normalize-window.js";

export function applyWindowUpdate(current: WindowSnapshot, update: WindowUpdate): WindowSnapshot {
    const nextStatus = { ...current.status, ...update.status };
    if (update.status?.isMaximized === true) nextStatus.isMinimized = false;
    if (update.status?.isMinimized === true) nextStatus.isMaximized = false;
    return normalizeWindowInput(
        {
            ...current,
            ...update,
            id: current.id,
            status: nextStatus,
            restoreBounds: current.restoreBounds,
        } as WindowSnapshot,
        current.id,
        current.zIndex
    );
}
