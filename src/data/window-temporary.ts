import {StateDataStore}from "../util/data/state-data-store/state-data-store.js"

type WindowTemporaryState = {
    restoreX: null;
    restoreY: null;
    restoreWidth: null;
    restoreHeight: null;
};

const INITIAL_WINDOW_TEMPORARY_STATE :WindowTemporaryState = {
    restoreX: null,
    restoreY: null,
    restoreWidth: null,
    restoreHeight: null,
};

export const windowTemporaryState = new StateDataStore(INITIAL_WINDOW_TEMPORARY_STATE);