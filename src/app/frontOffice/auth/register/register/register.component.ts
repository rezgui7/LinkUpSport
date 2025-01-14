import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../../models/User';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // Correct import

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule], // Remove ActivatedRoute from here
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
 

  selectedRole: string | null = null;
  user: User = {
    username: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    role: '',
    pictureUrl: '',
  };

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    // Récupérer le rôle sélectionné depuis les query params
    this.route.queryParams.subscribe((params) => {
      if (params['role']) {
        this.user.role = params['role'];
        console.log('User object before API call:', this.user);
        console.log('Rôle récupéré depuis l\'URL:', this.user.role);  // Ajoutez ce log pour vérifier
      }


    });
  }
  

  selectRole(role: string): void {
    this.selectedRole = role;
    this.user.role = role;
  }
  isValidPassword(password: string): boolean {
    // Doit contenir au moins 8 caractères, avec au moins une lettre et un chiffre
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
  }
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  register(): void {
    if (!this.user.username || !this.user.email || !this.user.password || !this.user.address || !this.user.phoneNumber || !this.user.role) {
      Swal.fire({
        icon: 'error',
        title: 'Champs manquants',
        text: 'Merci de remplir tous les champs.',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    console.log('User object before API call:', this.user);  // Vérifiez l'objet user avant l'envoi
    if (!this.isValidPassword(this.user.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Mot de passe invalide',
        text: 'Le mot de passe doit contenir au moins 8 caractères, incluant des lettres et des chiffres.',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (!this.isValidEmail(this.user.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email invalide',
        text: 'Merci de fournir un email valide.',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    this.authService.register(this.user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: 'Vous pouvez maintenant vous connecter !',
          confirmButtonText: 'OK',
        }).then(() => this.router.navigate(['user/login']));
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Email déjà utilisé.';
        if (errorMessage.includes('email already exists')) {
          Swal.fire({
            icon: 'error',
            title: 'Email déjà utilisé',
            text: 'L\'email que vous avez fourni est déjà associé à un autre compte.',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Échec de l\'inscription',
            text: errorMessage,
            confirmButtonText: 'OK',
          });
        }
      },
    });
  }
}  