import { beforeEach, describe, expect, it } from "vitest";
import { createWindowSystem, WindowSystemError } from "../src/main.js";

function pointerEvent(type: string, x: number, y: number, pointerId = 1): Event {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        button: 0,
        clientX: x,
        clientY: y,
    });
    Object.defineProperty(event, "pointerId", { value: pointerId });
    return event;
}

function setContainerSize(element: HTMLElement, width: number, height: number): void {
    Object.defineProperty(element, "clientWidth", { configurable: true, value: width });
    Object.defineProperty(element, "clientHeight", { configurable: true, value: height });
}

describe("WindowSystem public API", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        setContainerSize(document.body, 800, 600);
    });

    it("creates, reads, changes, and deletes a window", () => {
        const api = createWindowSystem();
        const id = api.create({
            id: "alpha",
            title: "Alpha",
            contentUrl: "/tools/alpha.html",
            iconUrl: "https://example.com/icon.png",
            x: 20,
            y: 30,
            width: 320,
            height: 240,
        });

        expect(id).toBe("alpha");
        expect(api.window(id)).toMatchObject({
            title: "Alpha",
            contentUrl: "http://localhost:3000/tools/alpha.html",
            x: 20,
            y: 30,
            width: 320,
            height: 240,
        });
        const element = document.querySelector<HTMLElement>('[data-window-id="alpha"]');
        expect(element?.style.left).toBe("20px");
        expect(element?.querySelector("iframe")).not.toBeNull();

        api.change(id, {
            title: "Changed",
            x: 45,
            status: { isMinimized: true },
        });
        expect(api.window(id)).toMatchObject({
            title: "Changed",
            x: 45,
            status: { isMinimized: true, isMaximized: false },
        });
        expect(element?.classList.contains("is-minimized")).toBe(true);

        api.delete(id);
        expect(document.querySelector('[data-window-id="alpha"]')).toBeNull();
        expect(() => api.window(id)).toThrowError(WindowSystemError);
    });

    it("keeps one clicked window active and moves it to the front", () => {
        const api = createWindowSystem();
        const first = api.create({ id: "first" });
        const second = api.create({ id: "second" });
        expect(api.window(first).status.isActive).toBe(false);
        expect(api.window(second).status.isActive).toBe(true);

        document
            .querySelector<HTMLElement>('[data-window-id="first"]')
            ?.dispatchEvent(pointerEvent("pointerdown", 1, 1));

        expect(api.window(first).status.isActive).toBe(true);
        expect(api.window(second).status.isActive).toBe(false);
        expect(api.window(first).zIndex).toBeGreaterThan(api.window(second).zIndex);
    });

    it("moves a movable window and ignores movement when disabled", () => {
        const api = createWindowSystem();
        const id = api.create({ id: "move", x: 10, y: 20 });
        const root = document.querySelector<HTMLElement>('[data-window-id="move"]')!;
        const header = root.querySelector<HTMLElement>(".window-header")!;

        header.dispatchEvent(pointerEvent("pointerdown", 100, 100));
        root.dispatchEvent(pointerEvent("pointermove", 135, 145));
        root.dispatchEvent(pointerEvent("pointerup", 135, 145));
        expect(api.window(id)).toMatchObject({ x: 45, y: 65 });

        api.change(id, { movable: false });
        header.dispatchEvent(pointerEvent("pointerdown", 0, 0, 2));
        root.dispatchEvent(pointerEvent("pointermove", 100, 100, 2));
        root.dispatchEvent(pointerEvent("pointercancel", 100, 100, 2));
        expect(api.window(id)).toMatchObject({ x: 45, y: 65 });
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
        const api = createWindowSystem();
        const id = api.create({
            id: `resize-${direction}`,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            minWidth: 50,
            minHeight: 50,
        });
        const root = document.querySelector<HTMLElement>(`[data-window-id="resize-${direction}"]`)!;
        const handle = root.querySelector<HTMLElement>(`[data-resize-direction="${direction}"]`)!;
        handle.dispatchEvent(pointerEvent("pointerdown", 0, 0));
        root.dispatchEvent(pointerEvent("pointermove", deltaX, deltaY));
        root.dispatchEvent(pointerEvent("pointerup", deltaX, deltaY));
        expect(api.window(id)).toMatchObject(expected);
    });

    it("enforces resize limits", () => {
        const api = createWindowSystem();
        const id = api.create({
            id: "limits",
            width: 100,
            height: 100,
            minWidth: 80,
            maxWidth: 120,
        });
        const root = document.querySelector<HTMLElement>('[data-window-id="limits"]')!;
        const east = root.querySelector<HTMLElement>('[data-resize-direction="e"]')!;
        east.dispatchEvent(pointerEvent("pointerdown", 0, 0));
        root.dispatchEvent(pointerEvent("pointermove", 500, 0));
        root.dispatchEvent(pointerEvent("pointerup", 500, 0));
        expect(api.window(id).width).toBe(120);
    });

    it("round-trips JSON snapshots including maximized restore bounds", () => {
        const api = createWindowSystem();
        const id = api.create({ id: "restore", x: 25, y: 35, width: 300, height: 200 });
        api.change(id, { status: { isMaximized: true } });
        const serialized = JSON.stringify(api.allWindow());
        expect(api.window(id)).toMatchObject({
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            restoreBounds: { x: 25, y: 35, width: 300, height: 200 },
        });

        api.delete(id);
        const restored = JSON.parse(serialized) as ReturnType<typeof api.allWindow>;
        for (const snapshot of restored) api.create(snapshot);
        expect(api.window(id).zIndex).toBe(restored[0]?.zIndex);
        api.change(id, { status: { isMaximized: false } });
        expect(api.window(id)).toMatchObject({
            x: 25,
            y: 35,
            width: 300,
            height: 200,
            restoreBounds: null,
        });
    });

    it("respects hidden and closable state", () => {
        const api = createWindowSystem();
        const id = api.create({ id: "locked", closable: false, status: { isHidden: true } });
        const root = document.querySelector<HTMLElement>('[data-window-id="locked"]')!;
        expect(root.classList.contains("is-hidden")).toBe(true);
        root.querySelector<HTMLButtonElement>(".window-header-remove-button")?.click();
        expect(api.window(id).id).toBe(id);
    });

    it("rejects invalid input and duplicate ids", () => {
        const api = createWindowSystem();
        api.create({ id: "duplicate" });
        expect(() => api.create({ id: "duplicate" })).toThrowError(WindowSystemError);
        expect(() => api.create({ contentUrl: "javascript:alert(1)" })).toThrowError(
            WindowSystemError
        );
        expect(() => api.create({ minWidth: 200, maxWidth: 100 })).toThrowError(WindowSystemError);
        expect(() => api.change("missing", {})).toThrowError(WindowSystemError);
    });
});
