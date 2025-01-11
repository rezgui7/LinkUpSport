import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import du RouterModule
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../frontOffice/service/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule,HttpClientModule],
  providers:[AuthService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté et récupérer le rôle depuis sessionStorage
    this.isLoggedIn = sessionStorage.getItem('auth-token') !== null; // Vérifier si un token d'authentification est présent
    this.userRole = sessionStorage.getItem('user-role'); // Récupérer le rôle de l'utilisateur depuis sessionStorage
  }

  logout(): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Bleu pour la confirmation
      cancelButtonColor: '#d33', // Rouge pour annuler
      confirmButtonText: 'Oui, déconnectez-moi!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, procéder à la déconnexion
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('user-role');
        this.isLoggedIn = false;
        this.userRole = null;
  
        Swal.fire(
          'Déconnecté!',
          'Vous avez été déconnecté avec succès.',
          'success'
        );
      }
    });
  }
  
}
