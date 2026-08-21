import type { ManagedWindow } from "../window/managed-window.js";

export type WindowEntries = () => IterableIterator<[string, ManagedWindow]>;
