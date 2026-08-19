import { beforeEach, describe, expect, it } from "vitest";
import { WindowManager, WindowSystemError } from "../src/main.js";
import { pointerEvent, resetDocument, windowRoot } from "./helpers/dom.js";

describe("WindowManager", () => {
    beforeEach(() => resetDocument());

    it("creates, reads, updates, and removes a window", () => {
        const manager = new WindowManager();
        const id = manager.createWindow({
            id: "alpha",
            title: "Alpha",
            contentUrl: "/tools/alpha.html",
            x: 20,
            y: 30,
            width: 320,
            height: 240,
        });
        expect(id).toBe("alpha");
        expect(manager.getWindow(id)).toMatchObject({
            title: "Alpha",
            contentUrl: "http://localhost:3000/tools/alpha.html",
            x: 20,
            y: 30,
        });

        manager.updateWindow(id, { title: "Changed", x: 45 });
        expect(manager.getWindow(id)).toMatchObject({ title: "Changed", x: 45 });

        manager.removeWindow(id);
        expect(document.querySelector('[data-window-id="alpha"]')).toBeNull();
        expect(() => manager.getWindow(id)).toThrowError(WindowSystemError);
    });

    it("keeps one clicked window active and moves it to the front", () => {
        const manager = new WindowManager();
        manager.createWindow({ id: "first" });
        manager.createWindow({ id: "second" });
        expect(manager.getWindow("first").status.isActive).toBe(false);
        expect(manager.getWindow("second").status.isActive).toBe(true);

        windowRoot("first").dispatchEvent(pointerEvent("pointerdown", 1, 1));
        expect(manager.getWindow("first").status.isActive).toBe(true);
        expect(manager.getWindow("second").status.isActive).toBe(false);
        expect(manager.getWindow("first").zIndex).toBeGreaterThan(
            manager.getWindow("second").zIndex
        );
    });

    it("round-trips JSON snapshots and maximized restore bounds", () => {
        const manager = new WindowManager();
        manager.createWindow({ id: "restore", x: 25, y: 35, width: 300, height: 200 });
        manager.updateWindow("restore", { status: { isMaximized: true } });
        const serialized = JSON.stringify(manager.getWindows());
        expect(manager.getWindow("restore")).toMatchObject({
            width: 800,
            height: 600,
            restoreBounds: { x: 25, y: 35, width: 300, height: 200 },
        });

        manager.removeWindow("restore");
        const restored = JSON.parse(serialized) as ReturnType<WindowManager["getWindows"]>;
        for (const snapshot of restored) manager.createWindow(snapshot);
        expect(manager.getWindow("restore").zIndex).toBe(restored[0]?.zIndex);
        manager.updateWindow("restore", { status: { isMaximized: false } });
        expect(manager.getWindow("restore")).toMatchObject({
            x: 25,
            y: 35,
            width: 300,
            height: 200,
            restoreBounds: null,
        });
    });

    it("rejects invalid input, duplicate ids, and missing windows", () => {
        const manager = new WindowManager();
        manager.createWindow({ id: "duplicate" });
        expect(() => manager.createWindow({ id: "duplicate" })).toThrowError(WindowSystemError);
        expect(() => manager.createWindow({ contentUrl: "javascript:alert(1)" })).toThrowError(
            WindowSystemError
        );
        expect(() => manager.createWindow({ minWidth: 200, maxWidth: 100 })).toThrowError(
            WindowSystemError
        );
        expect(() => manager.updateWindow("missing", {})).toThrowError(WindowSystemError);
    });

    it("destroys all windows once and rejects later operations", () => {
        const manager = new WindowManager();
        manager.createWindow({ id: "one" });
        manager.createWindow({ id: "two" });
        manager.destroy();
        expect(document.querySelectorAll("[data-window-id]")).toHaveLength(0);
        expect(() => manager.destroy()).not.toThrow();

        for (const operation of [
            () => manager.createWindow({}),
            () => manager.removeWindow("one"),
            () => manager.updateWindow("one", {}),
            () => manager.getWindow("one"),
            () => manager.getWindows(),
        ]) {
            expect(operation).toThrowError(expect.objectContaining({ code: "MANAGER_DESTROYED" }));
        }
    });
});
