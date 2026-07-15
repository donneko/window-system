import {StateDataStore}from "../util/data/state-data-store/state-data-store.js"

const INITIAL_WINDOW_ELEMENT = {
    isMove        :"is-move",
    isResize      : "is-resize",
    isTransparent : "is-transparent",
    isActive      : "is-active",
    isResizing    :"is-resizing",
    isRemoveReady : "is-remove-ready",
    isDebagMode   :"is-debag-mode",
    isLog         : "is-log",
};

export const windowConfigState = new StateDataStore(INITIAL_WINDOW_ELEMENT);
