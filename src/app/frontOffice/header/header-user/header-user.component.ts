import { Component, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router'; // Import du RouterModule
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [RouterModule,CommonModule,HttpClientModule],  // Ajoutez RouterModule ici
  providers:[AuthService],
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent  {
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté et récupérer le rôle depuis sessionStorage
    this.isLoggedIn = sessionStorage.getItem('auth-token') !== null; // Vérifier si un token d'authentification est présent
    this.userRole = sessionStorage.getItem('user-role'); // Récupérer le rôle de l'utilisateur depuis sessionStorage
  }

  logout(): void {
    // Supprimer les informations de session lors de la déconnexion
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user-role');
    this.isLoggedIn = false;
    this.userRole = null;
  }
}
