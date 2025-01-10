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
  roles = [
    { name: 'Superviseur', value: 'ROLE_SUPERVISEUR', description: 'Gère les opérations globales.' },
    { name: 'Organisateur', value: 'ROLE_ORGANISATEUR', description: 'Planifie et organise les événements.' },
    { name: 'Responsable', value: 'ROLE_RESPONSABLE', description: 'Supervise les activités spécifiques.' },
  ];

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
    private route: ActivatedRoute // Inject ActivatedRoute here
  ) {}

  ngOnInit(): void {
    // Récupérer le rôle sélectionné depuis les query params
    this.route.queryParams.subscribe((params) => {
      this.user.role = params['role'] || ''; // Pré-remplir le rôle si présent
    });
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.user.role = role;
  }

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
