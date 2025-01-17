import { Academie } from "./academie.model";

export class match {
    id: number;
    nbrmitemps: number;
    duree_mitemps: number;
    datetime: string;  // Utilisation de string car LocalDate sera transformé en ISO 8601 au frontend
    score: { [key: string]: number }; 
    carton_rouge: string;
    carton_jaune: string;
    academies: any[];  // Liste des academies associées au match
  
    constructor(
      id: number = 0,
      nbrmitemps: number = 0,
      duree_mitemps: number = 0,
      datetime: string = '',
      score: { [key: string]: number } = {},
      carton_rouge: string = '',
      carton_jaune: string = '',
      academies: Academie[] = []
    ) {
      this.id = id;
      this.nbrmitemps = nbrmitemps;
      this.duree_mitemps = duree_mitemps;
      this.datetime = datetime;
      this.score = score;
      this.carton_rouge = carton_rouge;
      this.carton_jaune = carton_jaune;
      this.academies = academies;
    }
  }