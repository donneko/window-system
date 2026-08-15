export type WindowEvents = {
    "window:move": { id: string; x: number; y: number };
    "window:close": { id: string };
    "window:header-display-type": { id: string; type: DisplayType };
    "window:header-icon-valid": { id: string; flag: boolean };
    "window:header-icon-src": { id: string; src: string };
    "window:header-title-text": { id: string; value: string };
};
