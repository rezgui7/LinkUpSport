import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../../../../_model/file-handle.model';

@Component({
  selector: 'app-detailsmatch',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  providers: [ServiceFrontService, AuthService, ServiceBackService],
  templateUrl: './detailsmatch.component.html',
  styleUrls: ['./detailsmatch.component.css'],
})
export class DetailsmatchComponent implements OnInit, OnDestroy {
  matches: match[] = [];
  joueurs: Joueur[] = [];
  filteredJoueurs: Joueur[] = [];
  academies: Academie[] = [];
  timers: {
    [key: number]: {
      timer: string;
      intervalId?: any;
      remainingTime: number;
      currentMiTemps: number; // Ajout de la propriété
    };
  } = {};
    selectedAcademieId: number | null = null;
  selectedJoueurId: number | null = null;
  matchId: any;
  matchDetails: match | null = null;
  academiesLeft: Academie[] = [];
  academiesRight: Academie[] = [];
  selectedCartonType: 'jaune' | 'rouge' | null = null;
  isLoading = false;
  isModalOpen = false;
  joueursAvecCartons: any[] = []; // Liste des joueurs avec cartons
  joueursAvecCartonsJaune: string[] = []; // List of players with yellow cards
  joueursAvecCartonsRouge: string[] = []; // List of players with red cards
  
  isCartonModalOpen = false;

  buteurs: { joueurId: number, temps: string }[] = [];
cartonsJaunes: { joueurId: number, temps: string }[] = [];
cartonsRouges: { joueurId: number, temps: string }[] = [];

  constructor(
    private matchService: ServiceFrontService,
    private serviceBackService: ServiceBackService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.matchId = +this.route.snapshot.paramMap.get('id')!;
    if (this.matchId) {
      this.loadMatchDetails();
      
    
    }
  }

  ngOnDestroy(): void {
    Object.values(this.timers).forEach((timer) => {
      if (timer.intervalId) {
        clearInterval(timer.intervalId);
      }
    });
  }

  img: FileHandle = {
    file: new File(["file content"], "example.txt", { type: "text/plain" }),
    url: "any"
  }

  private mapDataToAcademie(data: any): Academie {
    const images: FileHandle[] = data.logoacademie.map((image: any) => {
      return {
        file: new File([image.imageData], image.name, { type: image.type }),
        url: this.sanitizer.bypassSecurityTrustUrl(`data:${image.type};base64,${image.imageData}`)
      };
    });

    return {
      id: data.id,
      nom: data.nom,
      adresse: data.adresse,
      nomproprietaire: data.nomproprietaire,
      telephone: data.telephone,
      email: data.email,
      images: images,
      Joueur: []
    };
  }
  openCartonModal(): void {
    this.isCartonModalOpen = true;
  }
  closeCartonModal(): void {
    this.isCartonModalOpen = false;
  }
  
  openModal(): void {
    this.isModalOpen = true;
  
   
  }
  
  
  addAction(): void {
    if (this.selectedAcademieId && this.selectedJoueurId && this.matchDetails) {
      
        // Ajouter un but
        this.ajouterBut();
      }
     else {
      Swal.fire('Erreur', 'Veuillez sélectionner un joueur et une académie.', 'error');
    }
  }
  
  
  
  closeModal(): void {
    this.isModalOpen = false;
  }
  
  
  loadMatchDetails(): void {
    this.matchService.getMatchById(this.matchId!).subscribe({
      next: (match) => {
        this.academiesLeft = [];
        this.academiesRight = [];
        this.matchDetails = match;
        console.log('Match details:', match);
    console.log('Cartons jaunes:', match.carton_jaune);
    console.log('Cartons rouges:', match.carton_rouge);
    this.getJoueursAvecCartons();  // Assurez-vous que cette méthode est appelée

  
    if (match && match.id) {
      this.timers[match.id] = {
        timer: '00:00',
        remainingTime: 0,
        currentMiTemps: 1, // Initialisation de la mi-temps à 1
      };
  
          if (match.academies && match.academies.length >= 2) {
            const mappedAcademieLeft = this.mapDataToAcademie(match.academies[0]);
            const mappedAcademieRight = this.mapDataToAcademie(match.academies[1]);
  
            this.academiesLeft.push(mappedAcademieLeft);
            this.academiesRight.push(mappedAcademieRight);
  
            console.log('Mapped Academie Left:', mappedAcademieLeft);
            console.log('Mapped Academie Right:', mappedAcademieRight);
          } else {
            console.warn(`Match with ID ${match.id} has incomplete academy data.`);
          }
  
          // Charger les joueurs avec cartons
          this.getJoueursAvecCartons();
  
          console.log('Match Object:', match);
          console.log('All Mapped Academies Left:', this.academiesLeft);
          console.log('All Mapped Academies Right:', this.academiesRight);
        } else {
          console.warn('Match data is incomplete or invalid.');
        }
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de récupérer les détails du match.', 'error');
      },
    });
  }
  

 

  onAcademieChange(): void {
    if (this.selectedAcademieId) {
      this.serviceBackService.getJoueursByAcademie(this.selectedAcademieId).subscribe({
        next: (data) => {
          this.joueurs = data;
          this.filteredJoueurs = data;
          
        },
        error: () => {
          Swal.fire('Erreur', 'Impossible de charger les joueurs pour cette académie.', 'error');
        },
      });
    }
  }

 
 

  
  

  addCarton(): void {
    if (this.selectedJoueurId && this.selectedAcademieId && this.selectedCartonType && this.matchDetails) {
      const joueurId = this.selectedJoueurId;
      const academieId = this.selectedAcademieId;
      const couleurCarton = this.selectedCartonType;
  
      this.matchService.addCarton(this.matchId!, academieId, joueurId, couleurCarton).subscribe({
        next: () => {
          Swal.fire('Succès', 'Carton ajouté avec succès.', 'success');
          this.loadMatchDetails();
          this.closeCartonModal();
         
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du carton:', err);
          Swal.fire('Erreur', 'Impossible d\'ajouter le carton.', 'error');
        },
      });
    } else {
      Swal.fire('Erreur', 'Veuillez sélectionner un joueur, une académie et un type de carton.', 'error');
    }
  }

  getJoueursAvecCartons(): void {
    if (this.matchId) {
      this.matchService.getJoueursAvecCartons(this.matchId!).subscribe({
        next: (cartons: { cartonsRouges: string[], cartonsJaunes: string[] }) => {
          console.log('Cartons:', cartons); // Log the response for debugging
  
          // Assign the values from the backend response
          this.joueursAvecCartonsRouge = cartons.cartonsRouges;
          this.joueursAvecCartonsJaune = cartons.cartonsJaunes;

          console.log('Cartons:', this.joueursAvecCartonsJaune); // Log the response for debugging
          console.log('Cartons:', this.joueursAvecCartonsRouge); // Log the response for debugging

        },
        error: (err) => {
          console.error('Erreur lors de la récupération des joueurs avec cartons:', err);
          Swal.fire('Erreur', 'Impossible de récupérer les joueurs avec des cartons.', 'error');
        },
      });
    }
  }
  
  
  
  
  
  
  ajouterBut(): void {
    if (this.selectedJoueurId && this.selectedAcademieId && this.matchDetails) {
      const joueurId = Number(this.selectedJoueurId);
      const academieId = Number(this.selectedAcademieId);
  
      if (isNaN(joueurId) || isNaN(academieId)) {
        Swal.fire('Erreur', 'ID du joueur ou de l\'académie invalide.', 'error');
        return;
      }
  
      // Vérification si le joueur a un carton rouge
      const joueurAvecCartonRouge = this.joueursAvecCartons.find(
        (joueur: any) => joueur.id === joueurId && joueur.couleurCarton === 'rouge'
      );
  
      if (joueurAvecCartonRouge) {
        Swal.fire('Interdit', 'Vous ne pouvez pas ajouter un but pour un joueur ayant un carton rouge.', 'error');
        return;
      }
  
      // Récupérer le temps actuel du match
      const tempsActuel = this.timers[this.matchId].timer;
  
      this.matchService.updateMatchScore(this.matchId!, academieId, joueurId).subscribe({
        next: (response) => {
          console.log('Score mis à jour:', response);
          Swal.fire('Succès', 'But ajouté avec succès.', 'success');
          
          // Ajouter le buteur à la liste avec le temps
          this.buteurs.push({ joueurId, temps: tempsActuel });
  
          this.loadMatchDetails();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du score:', err);
          const messageErreur = err.error?.message || 'Erreur inconnue';
          Swal.fire('Erreur', messageErreur, 'error');
        },
      });
    } else {
      Swal.fire('Erreur', 'Veuillez sélectionner un joueur et une académie.', 'error');
    }
  }
  
  startTimer(matchId: number, duree_mitemps: number, nbrmitemps: number): void {
  if (!this.timers[matchId]) {
    this.timers[matchId] = {
      intervalId: null,
      timer: '00:00',
      remainingTime: 0,
      currentMiTemps: 1, // Initialisation de la mi-temps
    };
  }

  const currentMiTemps = this.timers[matchId].currentMiTemps;

  if (currentMiTemps > nbrmitemps) {
    Swal.fire('Match terminé', 'Toutes les mi-temps sont terminées.', 'info');
    return;
  }

  if (this.timers[matchId]?.intervalId) {
    clearInterval(this.timers[matchId].intervalId);
  }

  let seconds = this.timers[matchId].remainingTime;

  const intervalId = setInterval(() => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.timers[matchId].timer = `${this.formatTime(minutes)}:${this.formatTime(secs)}`;

    if (seconds >= duree_mitemps * 60) {
      clearInterval(intervalId); // Arrêter le timer à la fin de la mi-temps
      this.timers[matchId].intervalId = null; // Réinitialiser l'intervalId
      this.timers[matchId].remainingTime = 0; // Réinitialiser le temps restant
      Swal.fire(
        'Mi-temps terminée',
        `La mi-temps ${currentMiTemps} est terminée. Cliquez sur "Start" pour commencer la prochaine mi-temps.`,
        'info'
      );
      this.timers[matchId].currentMiTemps++; // Préparer la prochaine mi-temps
      return;
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
}

formatTime(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

  
}