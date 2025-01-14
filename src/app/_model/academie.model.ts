import { FileHandle } from "./file-handle.model";
import { Joueur } from "./joueur.model";
export interface Academie {
    id:number,
    nom:string,
    adresse:string,
    nomproprietaire:string,
    telephone:string,
    email:string,
    images: FileHandle[]
    Joueur: Joueur[]; 


} 

