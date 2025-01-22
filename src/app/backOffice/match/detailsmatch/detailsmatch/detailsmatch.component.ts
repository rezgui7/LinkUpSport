import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceFrontService } from '../../../../frontOffice/service/service-front.service';
import { ServiceBackService } from '../../../service/service-back.service';
import { match } from '../../../../_model/match';
import { Joueur } from '../../../../_model/joueur.model';
import { Academie } from '../../../../_model/academie.model';
import { AuthService } from '../../../../frontOffice/service/auth.service';

@Component({
  selector: 'app-detailsmatch',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule,],
  providers: [ServiceFrontService, AuthService, ServiceBackService],
  templateUrl: './detailsmatch.component.html',
  styleUrls: ['./detailsmatch.component.css'],
})
export class DetailsmatchComponent implements OnInit {
  matches: match[] = [];
  joueurs: Joueur[] = [];
  academies: Academie[] = [];
  timers: { [key: number]: { timer: string; intervalId?: any; remainingTime: number } } = {};
  selectedAcademieId: number | null = null;
  selectedJoueur: Joueur | null = null;
  selectedAcademie: Academie | null = null;
  selectedMatch: match | null = null;
  selectedMatchId: number | null = null;
  selectedJoueurId: number | null = null;
  isGoalModalOpen: boolean = false;
  matchId: number | null = null;
  matchDetails: match | null = null;
  filteredJoueurs: any[] = [];
  butsMarques: { joueur: Joueur; temps: string }[] = [];
  joueursAvecCartons: { joueur: Joueur; temps: string }[] = [];
  selectedCartonColor: string = '';
 

  isCartonModalOpen: boolean = false;
  constructor(
    private matchService: ServiceFrontService,
    private router: Router,
    private serviceBackService: ServiceBackService,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.matchId = +this.route.snapshot.paramMap.get('id')!;

    this.loadMatchDetails();

  }
  
  loadMatchDetails(): void {
    if (this.matchId) {
        this.matchService.getMatchById(this.matchId).subscribe({
            next: (match) => {
                // Sauvegarde des détails du match dans la variable
                this.matchDetails = match;
                console.log('Match récupéré:', this.matchDetails);
                console.log(this.filteredJoueurs);

                // Initialisation du timer pour le match
                this.timers[match.id] = { timer: '00:00', remainingTime: 0 };

                // Charger les joueurs par académie
                match.academies.forEach((academy) => {
                    this.getJoueursParAcademie(academy.id);
                });

                // Charger les joueurs avec cartons sans utiliser localStorage
                this.joueursAvecCartons = [];  // Réinitialiser les joueurs avec cartons
                this.filteredJoueurs = this.joueursAvecCartons.map(carton => ({
                    ...carton.joueur,
                    tempsCarton: carton.temps, // Ajout du temps du carton
                }));
                console.log('Joueurs filtrés avec cartons:', this.filteredJoueurs);

                // Gestion des cartons jaunes et rouges
                if (Array.isArray(match.carton_jaune) && Array.isArray(match.carton_rouge)) {
                    // Vérification et traitement des cartons jaunes
                    let cartonJauneArray: number[] = match.carton_jaune.map((val: string) => parseInt(val.trim(), 10));
                    console.log('Cartons jaunes:', cartonJauneArray);

                    // Vérification et traitement des cartons rouges
                    let cartonRougeArray: number[] = match.carton_rouge.map((val: string) => parseInt(val.trim(), 10));
                    console.log('Cartons rouges:', cartonRougeArray);

                    // Assurez-vous que `this.joueurs` est disponible avant d'y accéder
                    if (this.joueurs && this.joueurs.length > 0) {
                        // Ajout des joueurs avec carton jaune
                        cartonJauneArray.forEach((temps, index) => {
                            if (this.joueurs[index]) {
                                this.filteredJoueurs.push({
                                    joueur: this.joueurs[index], // Associez chaque joueur à un carton jaune
                                    couleur: 'jaune',
                                    temps: temps // Temps associé au carton jaune
                                });
                            }
                        });

                        // Ajout des joueurs avec carton rouge
                        cartonRougeArray.forEach((temps, index) => {
                            if (this.joueurs[index]) {
                                this.filteredJoueurs.push({
                                    joueur: this.joueurs[index], // Associez chaque joueur à un carton rouge
                                    couleur: 'rouge',
                                    temps: temps // Temps associé au carton rouge
                                });
                            }
                        });
                    } else {
                        console.error('Liste des joueurs non disponible pour associer les cartons.');
                    }

                    console.log('Joueurs avec cartons jaunes et rouges:', this.filteredJoueurs);
                } else {
                    console.log('Pas de cartons jaunes ou rouges trouvés.');
                }
            },
            error: (error) => {
                console.error('Erreur lors de la récupération des détails du match:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Un problème est survenu lors de la récupération des détails du match.',
                });
            },
        });
    }
}

  
  
getJoueursParAcademie(academieId: number): void {
  this.serviceBackService.getJoueursByAcademie(academieId).subscribe({
    next: (data: Joueur[]) => {
      console.log(`Joueurs récupérés pour l'académie ${academieId}:`, data);

      if (data && data.length > 0) {
        const nouveauxJoueurs = data.filter(newJoueur =>
          !this.joueurs.some(j => j.id === newJoueur.id)
        );
        this.joueurs = [...this.joueurs, ...nouveauxJoueurs];

        const academy = this.academies.find(a => a.id === academieId);
        if (academy) {
          academy.Joueur = data; // Mise à jour de l'académie
        }
      } else {
        console.warn(`Aucun joueur trouvé pour l'académie ${academieId}`);
      }
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des joueurs:', error);
    },
  });
}

  
  
  
  
  openCartonModal(): void {
    this.isCartonModalOpen = true;
  }
  closeCartonModal(): void {
    this.isCartonModalOpen = false;
    this.selectedAcademieId = null;
    this.selectedJoueurId = null;
    this.selectedCartonColor = '';
  }
  addCarton(): void {
    if (this.selectedAcademieId && this.selectedJoueurId && this.selectedCartonColor && this.matchId) {
        const currentTimer = this.timers[this.matchId]?.timer || '00:00';  // Obtenez le temps actuel du timer
        this.matchService.addCarton(this.matchId, this.selectedAcademieId, this.selectedJoueurId, this.selectedCartonColor).subscribe({
            next: () => {
                const joueur = this.joueurs.find(j => j.id === this.selectedJoueurId);
                console.log(joueur);
                if (joueur) {
                    // Retirer la gestion du localStorage
                    // Ajoutez le joueur à joueursAvecCartons sans l'utilisation du localStorage
                    this.joueursAvecCartons.push({ joueur, temps: currentTimer });
                    console.log('Carton ajouté:', { joueur, couleur: this.selectedCartonColor, temps: currentTimer });
                }
                Swal.fire('Succès', `Carton ${this.selectedCartonColor} ajouté avec succès.`, 'success');
                this.loadMatchDetails();  // Recharger les détails du match et les joueurs filtrés
                this.closeCartonModal();
            },
            error: (error) => {
                console.error('Erreur lors de l\'ajout du carton:', error);
                Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout du carton.', 'error');
            },
        });
    } else {
        Swal.fire('Attention', 'Veuillez sélectionner une académie, un joueur et la couleur du carton.', 'warning');
    }
}

  
  
  

  
 

  openGoalModal(matchId: number): void {
    this.isGoalModalOpen = true;
    this.selectedMatchId = matchId;
    this.joueurs = []; // Réinitialiser les joueurs
  }

  onAcademyChange(academieId: number): void {
    this.selectedAcademieId = academieId;
    this.joueurs = []; // Réinitialiser les joueurs avant de charger de nouveaux joueurs
    this.getJoueursParAcademie(academieId); // Charger les joueurs pour l'académie sélectionnée
  }

  addGoal(matchId: number): void {
    if (this.selectedAcademieId && this.selectedJoueurId && this.selectedMatchId) {
      const currentTimer = this.timers[this.selectedMatchId]?.timer || '00:00';
      const joueur = this.joueurs.find(j => j.id === Number(this.selectedJoueurId));

      if (joueur) {
        this.matchService.updateMatchScore(matchId, this.selectedAcademieId, this.selectedJoueurId).subscribe({
          next: () => {
            // Ajouter le but marqué
            this.butsMarques.push({ joueur, temps: currentTimer });

            // Sauvegarder les buts marqués dans localStorage pour ce match spécifique
            if (this.matchId !== null) {
              localStorage.setItem(`butsMarques_${this.matchId}`, JSON.stringify(this.butsMarques));
            }

            Swal.fire('Succès', 'Le score a été mis à jour avec succès.', 'success');
            this.loadMatchDetails(); // Recharger les détails du match
            this.closeGoalModal();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du score:', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du score.', 'error');
          }
        });
      } else {
        console.error('Erreur: Joueur non trouvé avec l\'ID:', this.selectedJoueurId);
        Swal.fire('Erreur', 'Le joueur sélectionné est introuvable.', 'error');
      }
    } else {
      Swal.fire('Attention', 'Veuillez sélectionner une académie et un joueur.', 'warning');
    }
  }

  closeGoalModal(): void {
    this.isGoalModalOpen = false;
    this.selectedAcademieId = null;
    this.selectedJoueurId = null;
  }

 
 
  startTimer(matchId: number, duration: number): void {
    const remainingTime = this.timers[matchId].remainingTime || 0;
    if (this.timers[matchId]?.intervalId) {
      clearInterval(this.timers[matchId].intervalId);
    }

    let seconds = remainingTime;
    const intervalId = setInterval(() => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      this.timers[matchId].timer = `${this.formatTime(minutes)}:${this.formatTime(secs)}`;

      if (seconds >= duration * 60) {
        clearInterval(intervalId);
        Swal.fire('Temps écoulé', `Le temps pour ce match est terminé !`, 'info');
      }
      seconds++;
      this.timers[matchId].remainingTime = seconds;
    }, 1000);

    this.timers[matchId].intervalId = intervalId;
  }

  stopTimer(matchId: number): void {
    if (this.timers[matchId]?.intervalId) {
      clearInterval(this.timers[matchId].intervalId);
      delete this.timers[matchId].intervalId;
    }
    const currentTimer = this.timers[matchId].timer;
    const [minutes, seconds] = currentTimer.split(':').map(Number);
    this.timers[matchId].remainingTime = minutes * 60 + seconds;
  }

  formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  updateScore(matchId: number): void {
    if (this.selectedAcademieId && this.selectedJoueurId) {
      this.matchService
        .updateMatchScore(matchId, this.selectedAcademieId, this.selectedJoueurId)
        .subscribe({
          next: (updatedMatch) => {
            Swal.fire('Succès', 'Le score a été mis à jour.', 'success');
            this.loadMatchDetails(); // Recharger les matchs pour refléter les modifications
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du score:', error);
            Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
          },
        });
    } else {
      Swal.fire('Attention', 'Veuillez sélectionner une académie et un joueur.', 'warning');
    }
  }
}
