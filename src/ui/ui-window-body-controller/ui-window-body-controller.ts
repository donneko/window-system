import {UiWindowAPI} from "../../app/window-system.js";


export class UiWindowBodyController{
    #pointerEvent;
    #eventBus;

    #EL_WINDOW_BODY

    constructor(uiWindowAPI:UiWindowAPI){
        this.#eventBus = uiWindowAPI.eventBus;
        this.#pointerEvent = uiWindowAPI.pointerEvent;
        
        this.#EL_WINDOW_BODY = uiWindowAPI.elementState.getSelect("windowBody");

        this.#init();
    }
    #init():void{
        this.#initEventBus();
        this.#initEvent();
    }
    #initEventBus():void{
    }
    #initEvent():void{
        this.#pointerEvent.addEvent([])
    }


}