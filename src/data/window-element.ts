import { HtmlElementController } from "../util/dom/html-element-controller/html-element-controller.js";
import {StateDataStore}from "../util/data/state-data-store/state-data-store.js"

export const ELEMENT_NAMES = Object.freeze({
    WINDOW_BODY          : ".js-window-body",
    HEADER_BODY          : ".js-window-header-body",
    HEADER_ICON          : ".js-window-header-icon",
    HEADER_TITLE_BODY    : ".js-window-header-title-body",
    HEADER_TITLE_BOX     : ".js-window-header-title-box",
    HEADER_TITLE_TEXT    : ".js-window-header-title-text",
    HEADER_LOG_BUTTON    : ".js-window-header-log-button",
    HEADER_DELETE_BUTTON : ".js-window-header-delete-button",
    WINDOW_CONTENT_BODY  : ".js-window-content-body",
    WINDOW_CONTENT_BOX   : ".js-window-content-box",
    WINDOW_CONTENT_FRAME : ".js-window-content-frame",
} as const);

type windowElementStoreData = {
    windowBody         : HtmlElementController;
    headerBody         : HtmlElementController;
    headerIcon         : HtmlElementController;
    headerTitleBody    : HtmlElementController;
    headerTitleBox     : HtmlElementController;
    headerTitleText    : HtmlElementController;
    headerLogButton    : HtmlElementController;
    headerDeleteButton : HtmlElementController;
    windowContentBody  : HtmlElementController;
    windowContentBox   : HtmlElementController;
    windowContentFrame : HtmlElementController;
}
type InputData = {
        windowBodyElement:HTMLElement
    }

export class WindowElementState{
    private windowElementStore:StateDataStore<windowElementStoreData>;

    constructor({windowBodyElement}:InputData){
        const windowBody = new HtmlElementController(null);
        windowBody.setElement(windowBodyElement);

        this.windowElementStore = new StateDataStore({
            windowBody:windowBody,
            headerBody         : new HtmlElementController(null),
            headerIcon         : new HtmlElementController(null),
            headerTitleBody    : new HtmlElementController(null),
            headerTitleBox     : new HtmlElementController(null),
            headerTitleText    : new HtmlElementController(null),
            headerLogButton    : new HtmlElementController(null),
            headerDeleteButton : new HtmlElementController(null),
            windowContentBody  : new HtmlElementController(null),
            windowContentBox   : new HtmlElementController(null),
            windowContentFrame : new HtmlElementController(null),
        });

        this.#init(windowBodyElement)
    }
    #init(windowBodyElement:HTMLElement){
        const OPTION = {targetObject:windowBodyElement};
        const INITIAL_WINDOW_ELEMENT = {
            headerBody         : new HtmlElementController(ELEMENT_NAMES.HEADER_BODY,OPTION),
            headerIcon         : new HtmlElementController(ELEMENT_NAMES.HEADER_ICON,OPTION),
            headerTitleBody    : new HtmlElementController(ELEMENT_NAMES.HEADER_TITLE_BODY,OPTION),
            headerTitleBox     : new HtmlElementController(ELEMENT_NAMES.HEADER_TITLE_BOX,OPTION),
            headerTitleText    : new HtmlElementController(ELEMENT_NAMES.HEADER_TITLE_TEXT,OPTION),
            headerLogButton    : new HtmlElementController(ELEMENT_NAMES.HEADER_LOG_BUTTON,OPTION),
            headerDeleteButton : new HtmlElementController(ELEMENT_NAMES.HEADER_DELETE_BUTTON,OPTION),
            windowContentBody  : new HtmlElementController(ELEMENT_NAMES.WINDOW_CONTENT_BODY,OPTION),
            windowContentBox   : new HtmlElementController(ELEMENT_NAMES.WINDOW_CONTENT_BOX,OPTION),
            windowContentFrame : new HtmlElementController(ELEMENT_NAMES.WINDOW_CONTENT_FRAME,OPTION),
        };

        this.windowElementStore.update(INITIAL_WINDOW_ELEMENT);
    }

    getSelect<K extends keyof windowElementStoreData>(key:K):windowElementStoreData[K]{
        return this.windowElementStore.getSelect(key);
    }
}


