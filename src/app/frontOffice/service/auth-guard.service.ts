import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) {}

  canActivate(): boolean {
    const user = this.authService.getUser();

    if (!user) {
      // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
      this.router.navigate(['/user/login']);
      return false;
    }

    const role = user.role;

    // Vérifier si l'utilisateur a un des rôles autorisés pour accéder à /admin
    if (role === 'ROLE_ORGANISATEUR' || role === 'ROLE_RESPONSABLE') {
      return true;
    }

    // Si l'utilisateur n'a pas les bons rôles, rediriger vers la page utilisateur
    this.router.navigate(['/user']);
    return false;
  }
}
