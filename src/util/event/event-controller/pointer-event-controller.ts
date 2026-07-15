import {DataStoreController}from "../../data/data-store-controller/data-store-controller.js";
import {validation}from "../../safety/validation/main.js";

type EventFunction = (event:PointerEvent)=>void;
type EventTable = {
    className :string ,
    onStart   :EventFunction,
    onMove    :EventFunction,
    onEnd     :EventFunction,
    capture   ?:boolean,
};
type EventTableKey = "onStart" | "onMove" | "onEnd";

export class PointerEventController{
    private readonly EVENT_NAME_LIST = [
            "pointerdown",
            "pointercancel",
            "pointermove",
            "pointerup"
        ] as const;
    private readonly EVENT_FUNCTION_MAP:Record<string,EventTableKey> = {
            "pointerdown"  :"onStart",
            "pointermove"  :"onMove",
            "pointerup"    :"onEnd",
            "pointercancel":"onEnd",
        } as const;
    private readonly EVENT_POINTE = {
            onStart :(e:PointerEvent)=> this.#setPointe(e),
            onMove : ()=>"",
            onEnd   :(e:PointerEvent)=> this.#clearPointe(e),
        }
    private EVENT_ARROW  = (e:PointerEvent) => {this.#EventMaster(e)};
    private EVENT_OPTION = { passive:false }

    private eventController
    private element
    private pointeId:null | number = null;

    constructor(element:HTMLElement,eventList:EventTable[]){
        this.eventController = new DataStoreController<EventTable>(eventList);
        this.element = element;

        this.#init();
    }
    #init():void{
        this.#initEvent()
    }
    #initEvent():void{
        for(const eventName of this.EVENT_NAME_LIST){
            this.element.addEventListener(
                eventName,
                this.EVENT_ARROW,
                this.EVENT_OPTION
            );
        }
    }


    #EventMaster(event:PointerEvent){

        const eventType = event.type;
        const target = event.target;
        validation(target,"HTMLElement");

        const classList = target.classList;
        const type = this.EVENT_FUNCTION_MAP[eventType] ?? "onEnd";

        this.#EventExecution(event,{classList,type});
    }
    #EventExecution(event:PointerEvent,{classList,type}:{classList:DOMTokenList,type:EventTableKey}){
        const tables = this.eventController.filterDataTable("class",[...classList]);

        for(const table of tables){
            const fu = table[type];

            validation(fu,"function");

            if(table?.capture) this.EVENT_POINTE[type](event);
            fu(event);
        }
    }
    #setPointe(event:PointerEvent):void{
        this.pointeId = event.pointerId;
        this.element.setPointerCapture(this.pointeId);
    }
    #clearPointe(event:PointerEvent):void{
        if(this.pointeId === null)return;

        this.element.releasePointerCapture(this.pointeId);
        this.pointeId = null;
    }


    removeEvent():void{
        for(const eventName of this.EVENT_NAME_LIST){
            this.element.removeEventListener(
                eventName,
                this.EVENT_ARROW,
            );
        }
    }
    addEvent(eventList:EventTable[]):void{
        for(const event of eventList){
            this.eventController.push(event);
        }
    }
}