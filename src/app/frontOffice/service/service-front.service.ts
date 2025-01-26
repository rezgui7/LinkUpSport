import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../frontOffice/service/auth.service';
import { Observable } from 'rxjs';
import { match } from '../../_model/match';
import { Academie } from '../../_model/academie.model';
 // Assurez-vous d'avoir un modèle pour "match"

@Injectable({
  providedIn: 'root'
})
export class ServiceFrontService {
  private userUrl = "http://localhost:8085/match";  // L'URL de votre API backend pour les matchs

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();  // Récupérer le token depuis le sessionStorage
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);  // Ajouter l'en-tête Authorization
    }
    return headers;
  }

  // Ajouter un match
  addMatch(match: match, academieIds: number[]): Observable<match> {
    const headers = this.getAuthHeaders();
    return this.http.post<match>(`${this.userUrl}/add?academieIds=${academieIds.join(',')}`, match, { headers });
  }

  // Mettre à jour un match
  updateMatch(id: number, match: match): Observable<match> {
    const headers = this.getAuthHeaders();
    return this.http.put<match>(`${this.userUrl}/update/${id}`, match, { headers });
  }

  // Récupérer un match par ID
  getMatchById(id: number): Observable<match> {
    const headers = this.getAuthHeaders();
    return this.http.get<match>(`${this.userUrl}/${id}`, { headers });
  }

  // Récupérer tous les matchs
  getAllMatches(): Observable<match[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<match[]>(`${this.userUrl}/all`, { headers });
  }

  // Supprimer un match
  deleteMatch(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.userUrl}/delete/${id}`, { headers });
  }
  

getAcademyById(matchId: number, academieId: number): Observable<Academie | null> {
  const headers = this.getAuthHeaders();
  return this.http.get<Academie | null>(`${this.userUrl}/${matchId}/academie/${academieId}`, { headers });
}

updateMatchScore(matchId: number, academieId: number, joueurId: number): Observable<match> {
  const headers = this.getAuthHeaders();
  const params = new URLSearchParams();
  params.append('academieId', academieId.toString());
  params.append('joueurId', joueurId.toString());

  return this.http.put<match>(
    `${this.userUrl}/updateScore/${matchId}?${params.toString()}`,
    {}, // Aucune donnée dans le corps de la requête
    { headers }
  );
}

// Méthode 2 : Récupérer les butteurs d'un match
getMatchButteurs(matchId: number): Observable<string[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<string[]>(`${this.userUrl}/${matchId}/butteurs`, { headers });
}

// Méthode 3 : Ajouter un carton
addCarton(matchId: number, academieId: number, joueurId: number, couleurCarton: string): Observable<match> {
  const headers = this.getAuthHeaders();
  return this.http.put<match>(
    `${this.userUrl}/addCarton/${matchId}?academieId=${academieId}&joueurId=${joueurId}&couleurCarton=${couleurCarton}`,
    null,
    { headers }
  );
}

// Méthode 4 : Récupérer les joueurs ayant des cartons rouge et jaune

getJoueursAvecCartons(matchId: string): Observable<{ cartonsRouges: string[], cartonsJaunes: string[] }> {
  const headers = this.getAuthHeaders();

  return this.http.get<{ cartonsRouges: string[], cartonsJaunes: string[] }>(`${this.userUrl}/joueursCartons/${matchId}`, { headers });
}

}
