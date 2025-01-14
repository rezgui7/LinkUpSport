import { Component, OnInit } from '@angular/core';
import { ServiceFrontService } from '../../../frontOffice/service/service-front.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../frontOffice/service/auth.service';
import { Router ,RouterModule} from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceBackService } from '../../service/service-back.service';
import { Joueur } from '../../../_model/joueur.model';
import { Academie } from '../../../_model/academie.model';
import { match } from '../../../_model/match';

@Component({
  selector: 'app-displaymatch',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterModule],
  providers: [ServiceFrontService, AuthService, ServiceBackService],
  templateUrl: './displaymatch.component.html',
  styleUrls: ['./displaymatch.component.css'],
})
export class DisplaymatchComponent implements OnInit {
  matches: match[] = [];
  joueurs: Joueur[] = [];
  academies: Academie[] = [];
  timers: { [key: number]: { timer: string; intervalId?: any; remainingTime: number } } = {};
  selectedAcademieId: number | null = null;
  selectedJoueur: Joueur | null = null;
  selectedAcademie: Academie | null = null;
  selectedMatch: match | null = null;  // Track the currently selected match for goal button
  selectedMatchId: number | null = null;
  selectedJoueurId: number | null = null;
  constructor(
    private matchService: ServiceFrontService,
    private router: Router,
    private serviceBackService: ServiceBackService
  ) {}

  ngOnInit(): void {
    this.loadMatches();
  }
  
 
  
  

  
  getJoueursParAcademie(academieId: number): void {
    this.serviceBackService.getJoueursByAcademie(academieId).subscribe({
      next: (data: Joueur[]) => {
        // Assign players to the corresponding academy
        const academy = this.academies.find((a) => a.id === academieId);
        if (academy) {
          academy.Joueur = data; // Assuming the `Academie` model has a `joueurs` field
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des joueurs:', error);
      },
    });
  }

  getacademiebymatch(matchId: number, academieId: number): void {
    this.matchService.getAcademyById(matchId, academieId).subscribe({
      next: (data: Academie | null) => {
        if (data && data.Joueur) {
          this.joueurs = data.Joueur; // Utilise correctement la propriété Joueur
          console.log('Joueurs récupérés:', this.joueurs);
        } else {
          console.log('Aucune académie ou joueurs trouvés pour cet ID.');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des joueurs:', error);
      },
    });
  }
  

  loadMatches(): void {
    this.matchService.getAllMatches().subscribe({
      next: (matches) => {
        this.matches = matches;
        matches.forEach((match) => {
          this.timers[match.id] = { timer: '00:00', remainingTime: 0 };
          // Load players for each academy in the match
          match.academies.forEach((academy) => {
            this.getJoueursParAcademie(academy.id);
          });
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matchs:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Un problème est survenu lors du chargement des matchs.',
        });
      },
    });
  }

  deleteMatch(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.matchService.deleteMatch(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Match supprimé avec succès !',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => this.loadMatches());
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors de la suppression du match.',
            });
            console.error('Erreur lors de la suppression du match', error);
          },
        });
      }
    });
  }

  navigateToUpdateMatch(matchId: number): void {
    this.router.navigate(['admin/UpdateMatch', matchId]);
  }

 
}