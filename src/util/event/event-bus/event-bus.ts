import {BusError} from "../../safety/error/logic/bus-error.js"


type EventHandler<Type> = (arg:Type) => void;
export class EventBus<EventMap extends Record<string,unknown>>{

    #EVENT_DATA_STORE = new Map<
    keyof EventMap,
    Array<Function>
    >();

    on<Key extends keyof EventMap>(type:Key,fn:EventHandler<EventMap[Key]>){
        if(!this.#EVENT_DATA_STORE.has(type)){
            this.#EVENT_DATA_STORE.set(type,[]);
        }

        const list = this.#EVENT_DATA_STORE.get(type)!;

        list.push(fn);

        return () => this.off(type,fn);
    }
    once<Key extends keyof EventMap>(type:Key,fn:EventHandler<EventMap[Key]>){
        const func:EventHandler<EventMap[Key]> = (arg) =>{
            this.off(type,func);
            fn(arg)
        };
        this.on(type,func);
    }
    off<Key extends keyof EventMap>(type:Key,fn:EventHandler<EventMap[Key]>){
        const list = this.#EVENT_DATA_STORE.get(type);
        if (!list) return;

        const index = list.indexOf(fn);
        if (index === -1) return;

        list.splice(index,1);

        if(list.length === 0){
            this.#EVENT_DATA_STORE.delete(type);
        }
    }
    emit<Key extends keyof EventMap>(type:Key,arg:EventMap[Key]){
        const list = this.#EVENT_DATA_STORE.get(type);

        if(!list)return;

        for(const fn of [...list]){
            try {
                (fn as EventHandler<EventMap[Key]>)(arg);
            } catch (error) {
                console.error(`[EventBus emit error] ${String(type)}`, error);
                new BusError("[EventBus emit error]",{
                        meta:{
                            type,
                            handlerName:fn.name
                        },
                        cause:error,
                    });
            }
        }
    }
}