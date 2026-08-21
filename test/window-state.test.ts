import { beforeEach, describe, expect, it, vi } from "vitest";
import { WindowSystemError } from "../src/index.js";
import { resizeBounds } from "../src/geometry/window-geometry.js";
import { Disposer } from "../src/shared/disposer.js";
import { applyWindowUpdate } from "../src/state/apply-window-update.js";
import { normalizeWindowInput } from "../src/state/normalize-window.js";
import { resetDocument } from "./helpers/dom.js";

describe("window state and geometry", () => {
    beforeEach(() => resetDocument());

    it("normalizes defaults and relative URLs", () => {
        expect(normalizeWindowInput({ contentUrl: "/tool.html" }, "id", 1000)).toMatchObject({
            id: "id",
            title: "Untitled window",
            contentUrl: "http://localhost:3000/tool.html",
            width: 400,
            height: 250,
        });
    });

    it("makes minimized and maximized mutually exclusive during updates", () => {
        const initial = normalizeWindowInput({}, "id", 1000);
        const maximized = applyWindowUpdate(initial, { status: { isMaximized: true } });
        const minimized = applyWindowUpdate(maximized, { status: { isMinimized: true } });
        expect(minimized.status).toMatchObject({ isMinimized: true, isMaximized: false });
    });

    it("rejects unsupported URLs and contradictory constraints", () => {
        expect(() =>
            normalizeWindowInput({ contentUrl: "javascript:alert(1)" }, "id", 1000)
        ).toThrowError(WindowSystemError);
        expect(() =>
            normalizeWindowInput({ minHeight: 200, maxHeight: 100 }, "id", 1000)
        ).toThrowError(WindowSystemError);
    });

    it("calculates constrained west-side resizing without DOM state", () => {
        expect(
            resizeBounds({ x: 10, y: 20, width: 100, height: 80 }, "w", 80, 0, {
                minWidth: 50,
                minHeight: 40,
                maxWidth: 120,
                maxHeight: null,
            })
        ).toEqual({ x: 60, y: 20, width: 50, height: 80 });
    });

    it("removes registered listeners exactly once", () => {
        const disposer = new Disposer();
        const target = new EventTarget();
        const listener = vi.fn();
        disposer.listen(target, "change", listener);
        target.dispatchEvent(new Event("change"));
        disposer.dispose();
        disposer.dispose();
        target.dispatchEvent(new Event("change"));
        expect(listener).toHaveBeenCalledTimes(1);
    });
});
