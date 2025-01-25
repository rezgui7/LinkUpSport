import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceFrontService } from '../../../frontOffice/service/service-front.service';
import { AuthService } from '../../../frontOffice/service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceBackService } from '../../service/service-back.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-addmatch',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  providers: [ServiceFrontService, AuthService, ServiceBackService],
  templateUrl: './addmatch.component.html',
  styleUrls: ['./addmatch.component.css'] // Correction ici
})
export class AddmatchComponent {
  matchForm: FormGroup;
  academies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private matchService: ServiceFrontService,
    private http: ServiceBackService,
    private router:Router
  ) {
    // Initialisation du formulaire
    this.matchForm = this.fb.group({
      nbrmitemps: [0, Validators.required],
      duree_mitemps: [0, Validators.required],
      datetime: ['', Validators.required], // Un champ pour la date et l'heure combinées
      academieIds: [[], [Validators.required, Validators.minLength(2)]], // Minimum 2 académies sélectionnées
      score: ['-', Validators.required] 
    });
  }

  ngOnInit() {
    this.loadAcademies();
  }

  // Charger les académies disponibles depuis le backend
  loadAcademies() {
    this.http.getAllAcademies().subscribe({
      next: (response: any[]) => (this.academies = response),
      error: (error) =>
        console.error('Erreur lors du chargement des académies', error),
    });
  }

  // Ajouter un match
  addMatch() {
    if (this.matchForm.valid) {
      const matchData = this.matchForm.value;
      this.matchService.addMatch(matchData, matchData.academieIds).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Match ajouté avec succès !',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            // Rediriger après succès
            this.router.navigate(['admin/DisplayMatches']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de l\'ajout du match.',
          });
          console.error('Erreur lors de l\'ajout du match', error);
        },
      });
    }
  }
}
