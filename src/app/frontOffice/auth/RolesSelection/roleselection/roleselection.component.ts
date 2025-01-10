import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-roleselection',
  standalone: true,
  imports: [],
  templateUrl: './roleselection.component.html',
  styleUrl: './roleselection.component.css'
})
export class RoleselectionComponent {
  constructor(private router: Router) {}

  selectRole(role: string): void {
    // Naviguer vers la page d'inscription avec le rôle sélectionné
    this.router.navigate(['/register'], { queryParams: { role } });
  }

}
