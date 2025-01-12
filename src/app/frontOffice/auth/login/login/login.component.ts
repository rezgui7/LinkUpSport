import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule
import { AuthService } from '../../../service/auth.service'; // Assurez-vous que l'importation du service est correcte
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importer Swal
import { CommonModule, } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,  // Déclarez que le composant est autonome
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule, 
    
  ],
  providers:[AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Correction ici: styleUrls au lieu de styleUrl
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        sessionStorage.setItem('user-role', response.role);
        sessionStorage.setItem('auth-token', response.token);

        Swal.fire({
          title: 'Connexion réussie!',
          text: 'Bienvenue à nouveau!',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        if (response.role === 'ROLE_RESPONSABLE' || response.role === 'ROLE_ORGANISATEUR') {
          this.router.navigate(['/admin']);
        } else if (response.role === 'ROLE_SUPERVISEUR') {
          this.router.navigate(['/user']);
        } else {
          Swal.fire({
            title: 'Accès non autorisé',
            text: 'Vous n\'avez pas l\'autorisation d\'accéder à cette application.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Échec de la connexion',
          text: err.error || 'Email ou mot de passe invalide.',
          icon: 'error',
          confirmButtonText: 'Réessayer'
        });
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/user/role']);
  }
}