import { FileHandle } from "./file-handle.model";

export interface Academie {
    id:number,
    nom:string,
    adresse:string,
    nomproprietaire:string,
    telephone:string,
    email:string,
    images: FileHandle[]


} 

