export function pointerEvent(type: string, x: number, y: number, pointerId = 1): Event {
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

export function setContainerSize(element: HTMLElement, width: number, height: number): void {
    Object.defineProperty(element, "clientWidth", { configurable: true, value: width });
    Object.defineProperty(element, "clientHeight", { configurable: true, value: height });
}

export function resetDocument(width = 800, height = 600): void {
    document.body.innerHTML = "";
    setContainerSize(document.body, width, height);
}

export function windowRoot(id: string): HTMLElement {
    const root = document.querySelector<HTMLElement>(`[data-window-id="${id}"]`);
    if (!root) throw new Error(`Window root "${id}" was not found.`);
    return root;
}
