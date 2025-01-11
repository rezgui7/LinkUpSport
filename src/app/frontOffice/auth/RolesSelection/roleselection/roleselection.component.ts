import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../models/User';
import { AuthService } from '../../../service/auth.service';

import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-roleselection',
  standalone: true,
  imports: [HttpClientModule],
    providers: [AuthService],
  templateUrl: './roleselection.component.html',
  styleUrl: './roleselection.component.css'
})
export class RoleselectionComponent {
  constructor(private router: Router,private authService: AuthService, ) {}
user: User = {
    username: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    role: '',
    pictureUrl: '',
  };

  selectRole(role: string): void {
    // Naviguer vers la page d'inscription avec le rôle sélectionné
    this.router.navigate(['user/register'], { queryParams: { role } });
  }

}
