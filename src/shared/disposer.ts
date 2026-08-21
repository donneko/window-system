export class Disposer {
    private disposers: Array<() => void> = [];
    private disposed = false;

    listen(
        target: EventTarget,
        type: string,
        listener: EventListener,
        options?: AddEventListenerOptions
    ): void {
        if (this.disposed) return;
        target.addEventListener(type, listener, options);
        this.add(() => target.removeEventListener(type, listener, options));
    }

    add(dispose: () => void): void {
        if (this.disposed) {
            dispose();
            return;
        }
        this.disposers.push(dispose);
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        for (const dispose of this.disposers.splice(0).reverse()) dispose();
    }
}
