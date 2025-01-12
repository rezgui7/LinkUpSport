import { FileHandle } from "./file-handle.model";

export interface Joueur {
    id:number,
    nom:string,
    prenom:string,
    datenaissance:string,
    telephone:string,
    categorie:string,
    images: FileHandle[]


} 