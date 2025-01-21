import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Academie } from '../../_model/academie.model';
import { Joueur } from '../../_model/joueur.model';
import { AuthService } from '../../frontOffice/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceBackService {

  userUrl = "http://localhost:8085/";

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Récupérer le token depuis le sessionStorage
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`); // Ajouter l'en-tête Authorization
    }
    return headers;
  }

  getAllAcademies(): Observable<any> {
    return this.http.get<any>(this.userUrl + 'academie/displayAcademie', { headers: this.getAuthHeaders() });
  }

  addAcademie(t: FormData): Observable<any> {
    return this.http.post<any>(this.userUrl + 'academie/addNewAcademie', t, { headers: this.getAuthHeaders() });
  }

  deleteAcademie(id: number): Observable<any> {
    return this.http.delete(this.userUrl + 'academie/deleteAcademieByID' + `/${id}`, { headers: this.getAuthHeaders() });
  }

  public getAcademieById(id: any): Observable<Academie> {
    return this.http.get<Academie>(this.userUrl + 'academie/displayAcademieByID' + `/${id}`, { headers: this.getAuthHeaders() });
  }

  updateAcademie(t: FormData): Observable<any> {
    return this.http.put<any>(this.userUrl + 'academie/updateNewAcademie', t, { headers: this.getAuthHeaders() });
  }

  addJoueur(t: FormData): Observable<any> {
    return this.http.post<any>(this.userUrl + 'joueur/addNewJoueur', t, { headers: this.getAuthHeaders() });
  }

  getAllJoueurs(): Observable<any> {
    return this.http.get<any>(this.userUrl + 'joueur/displayJoueur', { headers: this.getAuthHeaders() });
  }

  deleteJoueur(id: number): Observable<any> {
    return this.http.delete(this.userUrl + 'joueur/deleteJoueurByID' + `/${id}`, { headers: this.getAuthHeaders() });
  }

  public getJoueurById(id: any): Observable<any> {
    return this.http.get<any>(this.userUrl + 'joueur/displayJoueurByID' + `/${id}`, { headers: this.getAuthHeaders() });
  }

  updateJoueur(t: FormData): Observable<any> {
    return this.http.put<any>(this.userUrl + 'joueur/updateNewJoueur', t, { headers: this.getAuthHeaders() });
  }
  createTournament(t: FormData): Observable<any> {
    return this.http.post<any>(this.userUrl + 'tournoi/addNewTournoi', t, { headers: this.getAuthHeaders() });
  }
  getAllTournoi(): Observable<any> {
    return this.http.get<any>(this.userUrl + 'tournoi/displayTournoi', { headers: this.getAuthHeaders() });
  }
  deleteTournoi(id: number): Observable<any> {
    return this.http.delete(this.userUrl + 'tournoi/deleteTournoiByID' + `/${id}`, { headers: this.getAuthHeaders() });
  }
}
