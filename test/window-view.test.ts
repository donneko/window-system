import { beforeEach, describe, expect, it } from "vitest";
import { WindowManager } from "../src/index.js";
import { resetDocument, windowRoot } from "./helpers/dom.js";

describe("window view", () => {
    beforeEach(() => resetDocument());

    it("renders title, iframe, icon, position, and size", () => {
        const manager = new WindowManager();
        manager.createWindow({
            id: "view",
            title: "Rendered title",
            iconUrl: "https://example.com/icon.png",
            contentUrl: "/content.html",
            x: 20,
            y: 30,
            width: 320,
            height: 240,
        });
        const root = windowRoot("view");
        expect(root.style.left).toBe("20px");
        expect(root.style.height).toBe("240px");
        expect(root.querySelector(".window-header-title-text")?.textContent).toBe("Rendered title");
        expect(root.classList.contains("is-icon")).toBe(true);
        expect(root.querySelector<HTMLIFrameElement>("iframe")?.src).toBe(
            "http://localhost:3000/content.html"
        );
    });

    it("synchronizes hidden, minimized, and closable state", () => {
        const manager = new WindowManager();
        manager.createWindow({
            id: "state",
            closable: false,
            status: { isHidden: true, isMinimized: true },
        });
        const root = windowRoot("state");
        expect(root.classList.contains("is-hidden")).toBe(true);
        expect(root.classList.contains("is-minimized")).toBe(true);
        root.querySelector<HTMLButtonElement>(".window-header-remove-button")?.click();
        expect(manager.getWindow("state").id).toBe("state");
    });
});
