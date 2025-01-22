import { Component, HostListener, OnInit } from '@angular/core';
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
import { FileHandle } from '../../../_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
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
 
  academie: Academie = {
    id: 0,
    nom: '',
    adresse: '',
    nomproprietaire: '',
    telephone: '',
    email: '',
    images: [],
    Joueur:[]
  };
  academie2: Academie = {
    id: 0,
    nom: '',
    adresse: '',
    nomproprietaire: '',
    telephone: '',
    email: '',
    images: [],
    Joueur:[]
  };
  joueurs: Joueur[] = [];
  academies: Academie[] = [];
  timers: { [key: number]: { timer: string; intervalId?: any; remainingTime: number } } = {};
  selectedAcademieId: number | null = null;
  selectedJoueur: Joueur | null = null;
  selectedAcademie: Academie | null = null;
  selectedMatch: match | null = null;  // Track the currently selected match for goal button
  selectedMatchId: number | null = null;
  selectedJoueurId: number | null = null;
  equipe1:any;
  equipe2:any;
  academiesLeft: Academie[] = []; // Add this property
  academiesRight: Academie[] = []; // Add this property
  constructor(
    private matchService: ServiceFrontService,
    private router: Router,private sanitizer: DomSanitizer,
    private serviceBackService: ServiceBackService
  ) {}

  ngOnInit(): void {
    this.loadMatches();
    
  }
  
  
  img:FileHandle={
    file:new File(["file content"], "example.txt", { type: "text/plain" }),
     url:"any"
   }
 
   private mapDataToAcademie(data: any): Academie {
    // Adaptation des données avant de les assigner au modèle Course
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
      Joueur:[]
    };
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
  
        // Clear existing academies arrays
        this.academiesLeft = [];
        this.academiesRight = [];
  
        matches.forEach((match) => {
          console.log('Match Object:', match); // Log the full match object
  
          // Ensure academies exist and map them
          if (match.academies && match.academies.length >= 2) {
            const mappedAcademieLeft = this.mapDataToAcademie(match.academies[0]);
            const mappedAcademieRight = this.mapDataToAcademie(match.academies[1]);
  
            // Push academies into their respective arrays
            this.academiesLeft.push(mappedAcademieLeft);
            this.academiesRight.push(mappedAcademieRight);
  
            // Log mapped academies
            console.log('Mapped Academie Left:', this.academiesLeft);
            console.log('Mapped Academie Right:', mappedAcademieRight);
          } else {
            console.warn(`Match with ID ${match.id} has incomplete academy data.`);
          }
  
          // Initialize the timer for each match
          this.timers[match.id] = { timer: '00:00', remainingTime: 0 };
        });
  
        // Log final arrays of academies
        console.log('All Mapped Academies Left:', this.academiesLeft);
        console.log('All Mapped Academies Right:', this.academiesRight);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matchs:', error);
  
        // Display error notification
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