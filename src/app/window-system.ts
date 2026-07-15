import{UiWindowBodyController}from"../ui/ui-window-body-controller/ui-window-body-controller.js";
import{UiWindowContentController}from"../ui/ui-window-content-controller/ui-window-content-controller.js";
import{UiWindowHeaderController}from"../ui/ui-window-header-controller/ui-window-header-controller.js";

import {INITIAL_WINDOW_CONFIG_STATE,WindowConfigState,TitleDisplayType}from "../data/window-config.js"
import {INITIAL_WINDOW_PERSISTENT_STATE,WindowPersistentState}from "../data/window-persistent.js"
import {WINDOW_BODY_HTML}from "../assets/html/template.js"
import {WindowElementState} from "../data/window-element.js";

import {StateDataStore}from "../util/data/state-data-store/state-data-store.js"
import {EventBus} from "../util/event/event-bus/event-bus.js"
import {PointerEventController} from "../util/event/event-controller/pointer-event-controller.js";
import {addCssClass} from "../util/dom/add-css-class/add-css-class.js";
import { validation } from "../util/safety/validation/main.js";


type WindowEvents = {
    "window:move" :{id:string,x:number,y:number},
    "window:close":{id:string},
    "window:header-display-type":{id:string,type:TitleDisplayType},
    "window:header-icon-valid":{id:string,flag:boolean},
    "window:header-icon-src":{id:string,src:string},
    "window:header-title-text":{id:string,value:string},
};

type InitialWindowConfig = {
    config:WindowConfigState;
    persistent:WindowPersistentState;
}

export type UiWindowAPI = {
    elementState :WindowElementState;
    eventBus     :EventBus<WindowEvents>;
    pointerEvent :PointerEventController;
}

export class WindowSystem{
    protected windowEventBus = new EventBus<WindowEvents>();
    protected windowPointerEvent!:PointerEventController;
    protected windowConfigState = new StateDataStore(INITIAL_WINDOW_CONFIG_STATE);
    protected windowPersistentState = new StateDataStore(INITIAL_WINDOW_PERSISTENT_STATE);
    protected windowElementState!:WindowElementState;

    protected uiWindowBodyController!:UiWindowBodyController;
    protected uiWindowContentController!:UiWindowContentController;
    protected uiWindowHeaderController!:UiWindowHeaderController;

    constructor(initialWindowConfig:InitialWindowConfig){

        this.windowConfigState.update(initialWindowConfig.config);
        this.windowPersistentState.update(initialWindowConfig.persistent);

        this.init();
    }
    private init(){
        this.initElement();
        this.initEvents();
        this.initControllers();
    }
    private initElement(){
        const windowBodyHtmlElement = this.initHtmlBody();
        this.windowElementState = new WindowElementState({windowBodyElement:windowBodyHtmlElement});
    }
    private initHtmlBody():HTMLElement{
        const basisElement = this.windowConfigState.getSelect("basisElement");
        const html = document.createElement("div");

        const addCssClassName = ["window","js-window-controller-window"]
        addCssClass(html,addCssClassName);

        html.innerHTML = WINDOW_BODY_HTML;
        basisElement.appendChild(html);
        return html;
    }
    private initEvents(){
        const element = this.windowElementState.getSelect("windowBody").getElement();
        validation(element,"HTMLElement");

        this.windowPointerEvent = new PointerEventController(element,[]);
    }
    private initControllers(){
        const uiWindowAPI:UiWindowAPI = {
            elementState :this.windowElementState,
            eventBus     :this.windowEventBus,
            pointerEvent:this.windowPointerEvent,
        }

        this.uiWindowBodyController = new UiWindowBodyController(uiWindowAPI);
        this.uiWindowContentController = new UiWindowContentController(uiWindowAPI);
        this.uiWindowHeaderController = new UiWindowHeaderController(uiWindowAPI);
    }
}