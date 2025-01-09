import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../../models/User';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';import { CommonModule } from '@angular/common';
import { HeaderUserComponent } from '../../../header/header-user/header-user.component';
import { FooterUserComponent } from '../../../footer/footer-user/footer-user.component';

@Component({
  selector: 'app-register',
  standalone: true,  // Déclarez que le composant est autonome
  imports: [FormsModule, CommonModule, HttpClientModule],  // Ajouter HttpClientModule ici
  providers:[AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: User = {
    username: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    role: 'ROLE_ORGANISATEUR', // Par défaut
    pictureUrl: '', // Optionnel, peut être laissé vide
  };

  constructor(private authService: AuthService, private router: Router) {}
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  
  register(): void {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You can now log in!',
          confirmButtonText: 'OK',
        }).then(() => this.router.navigate(['/login']));
      },
      error: (error) => {
        const errorMessage =
          error.error?.message || 'Failed to register. Please try again.';
        console.error('Registration error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: errorMessage,
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
