export type ManagedWindowCallbacks = {
    activate(id: string): void;
    close(id: string): void;
};
