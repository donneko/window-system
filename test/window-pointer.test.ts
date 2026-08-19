import { beforeEach, describe, expect, it } from "vitest";
import { WindowManager } from "../src/main.js";
import { pointerEvent, resetDocument, windowRoot } from "./helpers/dom.js";

describe("window pointer interactions", () => {
    beforeEach(() => resetDocument());

    it("moves a movable window and ignores movement when disabled", () => {
        const manager = new WindowManager();
        manager.createWindow({ id: "move", x: 10, y: 20 });
        const root = windowRoot("move");
        const header = root.querySelector<HTMLElement>(".window-header")!;

        header.dispatchEvent(pointerEvent("pointerdown", 100, 100));
        root.dispatchEvent(pointerEvent("pointermove", 135, 145));
        root.dispatchEvent(pointerEvent("pointerup", 135, 145));
        expect(manager.getWindow("move")).toMatchObject({ x: 45, y: 65 });

        manager.updateWindow("move", { movable: false });
        header.dispatchEvent(pointerEvent("pointerdown", 0, 0, 2));
        root.dispatchEvent(pointerEvent("pointermove", 100, 100, 2));
        root.dispatchEvent(pointerEvent("pointercancel", 100, 100, 2));
        expect(manager.getWindow("move")).toMatchObject({ x: 45, y: 65 });
    });

    it.each([
        ["n", 0, -20, { height: 120, y: -20 }],
        ["s", 0, 20, { height: 120 }],
        ["e", 20, 0, { width: 120 }],
        ["w", -20, 0, { width: 120, x: -20 }],
        ["ne", 20, -20, { width: 120, height: 120, y: -20 }],
        ["nw", -20, -20, { width: 120, height: 120, x: -20, y: -20 }],
        ["se", 20, 20, { width: 120, height: 120 }],
        ["sw", -20, 20, { width: 120, height: 120, x: -20 }],
    ])("resizes from the %s handle", (direction, deltaX, deltaY, expected) => {
        const manager = new WindowManager();
        const id = `resize-${direction}`;
        manager.createWindow({
            id,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            minWidth: 50,
            minHeight: 50,
        });
        const root = windowRoot(id);
        const handle = root.querySelector<HTMLElement>(`[data-resize-direction="${direction}"]`)!;
        handle.dispatchEvent(pointerEvent("pointerdown", 0, 0));
        root.dispatchEvent(pointerEvent("pointermove", deltaX, deltaY));
        root.dispatchEvent(pointerEvent("pointerup", deltaX, deltaY));
        expect(manager.getWindow(id)).toMatchObject(expected);
    });

    it("enforces resize limits", () => {
        const manager = new WindowManager();
        manager.createWindow({
            id: "limits",
            width: 100,
            height: 100,
            minWidth: 80,
            maxWidth: 120,
        });
        const root = windowRoot("limits");
        const east = root.querySelector<HTMLElement>('[data-resize-direction="e"]')!;
        east.dispatchEvent(pointerEvent("pointerdown", 0, 0));
        root.dispatchEvent(pointerEvent("pointermove", 500, 0));
        root.dispatchEvent(pointerEvent("pointerup", 500, 0));
        expect(manager.getWindow("limits").width).toBe(120);
    });
});
