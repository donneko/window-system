export class StateDataStore<TableData extends Record<string,unknown>>{
    private readonly INITIAL_STATE: TableData;
    private stateData:TableData;

    constructor(stateTabla:TableData){
        this.INITIAL_STATE = {...stateTabla};
        this.stateData = {...stateTabla};
    }

    getAll():TableData{
        return {...this.stateData};
    }
    getSelect<K extends keyof TableData>(key:K):TableData[K]{
        return this.stateData[key];
    }
    update(patch:Partial<TableData>):void{
        this.stateData = {...this.stateData,...patch}
    }
    reset():void{
        this.stateData = {...this.INITIAL_STATE};
    }
}
