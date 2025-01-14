import { FileHandle } from "./file-handle.model";

export interface Tournoi {
    id:number,
    nom:string,
    dateDebut:string,
    dateFin:string,
    lieu:string,
    nbrpoule:string,
    type:string,
    images: FileHandle[]


} 