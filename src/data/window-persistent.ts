export type WindowPersistentState = {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;

    isActive: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isHidden: boolean;
};

export const INITIAL_WINDOW_PERSISTENT_STATE:WindowPersistentState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    zIndex: 0,

    isActive: false,
    isMinimized: false,
    isMaximized: false,
    isHidden: false,
};