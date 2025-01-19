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
          this.matchDetails = match;
          console.log('Match récupéré:', this.matchDetails);
  
          this.timers[match.id] = { timer: '00:00', remainingTime: 0 };
  
          // Charger les joueurs par académie
          match.academies.forEach((academy) => {
            this.getJoueursParAcademie(academy.id);
          });
  
          // Charger les buts marqués depuis le localStorage
          const butsMarques = JSON.parse(localStorage.getItem(`butsMarques_${this.matchId}`) || '[]');
          this.butsMarques = butsMarques;
  
          // Charger les joueurs avec cartons depuis le localStorage
          const joueursAvecCartons = JSON.parse(localStorage.getItem(`joueursAvecCartons_${this.matchId}`) || '[]');
          this.joueursAvecCartons = joueursAvecCartons;
  
          console.log('Joueurs avec cartons récupérés:', this.joueursAvecCartons);
  
          // Filtrer les joueurs avec cartons
          this.filteredJoueurs = this.joueursAvecCartons.map(carton => ({
            ...carton.joueur,
            tempsCarton: carton.temps, // Ajout du temps du carton
          }));
  
          console.log('Joueurs filtrés avec cartons:', this.filteredJoueurs);
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
          if (joueur) {
            // Récupérer ou initialiser les cartons du joueur
            let cartonsJoueur = JSON.parse(localStorage.getItem(`cartons_${joueur.id}_${this.matchId}`) || '[]');
            // Ajouter un objet avec la couleur du carton et le temps
            cartonsJoueur.push({ couleur: this.selectedCartonColor, temps: currentTimer });
            localStorage.setItem(`cartons_${joueur.id}_${this.matchId}`, JSON.stringify(cartonsJoueur));
    
            // Ajouter à joueursAvecCartons avec le temps et la couleur
            this.joueursAvecCartons.push({ joueur, temps: currentTimer });
            localStorage.setItem(`joueursAvecCartons_${this.matchId}`, JSON.stringify(this.joueursAvecCartons));  // Sauvegarder dans le localStorage
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
  
  
  getJoueursParAcademie(academieId: number): void {
    this.serviceBackService.getJoueursByAcademie(academieId).subscribe({
      next: (data: Joueur[]) => {
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

  
  loadButsFromLocalStorage(): void {
    if (this.matchId !== null) {
      const storedButs = localStorage.getItem(`butsMarques_${this.matchId}`);
      if (storedButs) {
        this.butsMarques = JSON.parse(storedButs);
       
      }
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
