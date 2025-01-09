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
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Ajout de ce getter pour accéder facilement aux contrôles du formulaire
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
     // Store role in session storage
     const userRole = response.role; // Assuming the role is returned in the response
     sessionStorage.setItem('user-role', userRole);

     Swal.fire({
       title: 'Login Successful!',
       text: 'Welcome back!',
       icon: 'success',
       confirmButtonText: 'OK'
     });

     // Logic for redirection based on role
     if (userRole === 'ROLE_ORGANISATEUR') {
       this.router.navigate(['/admin']);
     } else {
       this.router.navigate(['/user']);
     }
   },
   error: (err) => {
     console.error(err);
     Swal.fire({
       title: 'Login Failed',
       text: err.error || 'Invalid email or password.',
       icon: 'error',
       confirmButtonText: 'Try Again'
     });
   }
 });

  }
}
