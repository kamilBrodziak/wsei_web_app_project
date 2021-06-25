export interface INote {
    title: string;
    body: string;
    color: string;
    id:string;
    pinned: boolean;
    date: {
        created: number;
        updated?:number;
    }
}

export type TNoteDict = {[id:string]:INote};