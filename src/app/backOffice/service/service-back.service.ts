import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Academie } from '../../_model/academie.model';
import { Observable } from 'rxjs';
import { Joueur } from '../../_model/joueur.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceBackService {
  userUrl="http://localhost:8085/";

  constructor(private http:HttpClient) { }
  getAllAcademies(){
    return this.http.get<any>(this.userUrl+'academie/displayAcademie');
  }
  addAcademie(t:FormData){
    return this.http.post<Academie>(this.userUrl+'academie/addNewAcademie' , t);
  }
  deleteAcademie(id:number){
    return this.http.delete(this.userUrl+'academie/deleteAcademieByID'+`/${id}`);
  }
  public getAcademieById(id:any):Observable<Academie>{
    return this.http.get<Academie>(this.userUrl+'academie/displayAcademieByID'+`/${id}`);
  }
  updateAcademie(t:FormData){
    return this.http.put<Academie>(this.userUrl+'academie/updateNewAcademie' , t);
  }

  addJoueur(t:FormData){
    return this.http.post<any>(this.userUrl+'joueur/addNewJoueur' , t);
  }
  getAllJoueurs(){
    return this.http.get<any>(this.userUrl+'joueur/displayJoueur');
  }
  deleteJoueur(id:number){
    return this.http.delete(this.userUrl+'joueur/deleteJoueurByID'+`/${id}`);
  }
  public getJoueurById(id:any):Observable<any>{
    return this.http.get<any>(this.userUrl+'joueur/displayJoueurByID'+`/${id}`);
  }
  updateJoueur(t:FormData){
    return this.http.put<any>(this.userUrl+'joueur/updateNewJoueur' , t);
  }
}
