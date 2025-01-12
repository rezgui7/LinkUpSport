import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = sessionStorage.getItem('auth-token') !== null;
    this.userRole = sessionStorage.getItem('user-role');
  }

  logout(): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, déconnectez-moi!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('user-role');
        this.isLoggedIn = false;
        this.userRole = null;

        // Déclencher une détection des changements
        this.cdr.detectChanges();

        Swal.fire(
          'Déconnecté!',
          'Vous avez été déconnecté avec succès.',
          'success'
        );
      }
    });
  }

 
}
