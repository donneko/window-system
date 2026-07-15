type DefaultTable = Record<string,unknown>
export class DataStoreController<Table extends DefaultTable>{
    private DATA_TABLE:readonly Table[];

    constructor(dataTable:readonly Table[]){
        this.DATA_TABLE = dataTable;
    }

    // 参照
    indexOf(key:string,value:any):number{
        return this.DATA_TABLE.findIndex(table=> table[key] === value)
    }
    length():number{
        return this.DATA_TABLE.length;
    }
    allList(key:string):Table[]{
        return [...this.DATA_TABLE];
    }
    selectIndex(number:number){
        return this.DATA_TABLE[number];
    }
    searchDataTable(key:string,value:any){
        return this.DATA_TABLE.find(table => table[key] === value)
    }
    filterDataTable(key:string,values:any[]){
        return this.DATA_TABLE.filter(table => values.includes(table[key]))
    }
    filterKey(key:string){
        return this.DATA_TABLE.map(table => table[key])
    }


    // 編集
    push(record:Table):void{
        const newTable = [...this.DATA_TABLE];
        newTable.push(record);
        this.DATA_TABLE = newTable;
    }
}