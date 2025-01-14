import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';import { ServiceFrontService } from '../../../frontOffice/service/service-front.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule, HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
import { AuthService } from '../../../frontOffice/service/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
 // Import ajouté
import Swal from 'sweetalert2';
@Component({
  selector: 'app-updatematch',
  standalone: true,
  imports: [HttpClientModule,CommonModule,ReactiveFormsModule],
     providers: [ServiceFrontService,AuthService],
  
  templateUrl: './updatematch.component.html',
  styleUrl: './updatematch.component.css'
})
export class UpdatematchComponent {

  matchForm: FormGroup;
  matchId: number;

  constructor(
    private fb: FormBuilder,
    private matchService: ServiceFrontService,
    private route: ActivatedRoute,
    private router:Router

  ) {
    this.matchId = +this.route.snapshot.paramMap.get('id')!;
    this.matchForm = this.fb.group({
      nbrmitemps: [0, Validators.required],
      duree_mitemps: [0, Validators.required],
      datetime: ['', Validators.required], // Un champ pour la date et l'heure combinées
      score: ['', Validators.required],
    });

    this.loadMatchDetails();
  }

  loadMatchDetails() {
    this.matchService.getMatchById(this.matchId).subscribe({
      next: (matchData) => this.matchForm.patchValue(matchData),
      error: (error) => console.error('Erreur lors du chargement des détails du match', error),
    });
  }

  updateMatch() {
    if (this.matchForm.valid) {
      this.matchService.updateMatch(this.matchId, this.matchForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Match modifié avec succès !',
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
            text: 'Erreur lors de la modification du match.',
          });
          console.error('Erreur lors de la mise à jour du match', error);
        },
      });
    }
  }}