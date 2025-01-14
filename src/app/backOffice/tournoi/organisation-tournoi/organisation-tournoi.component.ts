import { Component, OnInit } from '@angular/core';
import { Tournoi } from '../../../_model/tournoi.model';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ServiceBackService } from '../../service/service-back.service';
import { AuthService } from '../../../frontOffice/service/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-organisation-tournoi',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatGridListModule,
    CommonModule,
    ImageCropperComponent,
    ReactiveFormsModule,
  ],
  providers: [ServiceBackService, AuthService],
  templateUrl: './organisation-tournoi.component.html',
  styleUrls: ['./organisation-tournoi.component.css'],
})
export class OrganisationTournoiComponent implements OnInit {
  

  tournamentForm!: FormGroup;
  selectedAcademies: any[] = []; // Stores selected academies
  academieList: any[] = [];
  images: File[] = [];
  tournamentTypes = ['Championship', 'Cup'];

  constructor(
    private fb: FormBuilder,
    private httpService: ServiceBackService,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.tournamentForm = this.fb.group({
      nom: '',
      dateDebut: '',
      dateFin: '',
      lieu: '',
      nbrpoule: '',
      type: '',
      academies: [[]], // Initialize as an empty array
    });

    // Fetch academies
  this.httpService.getAllAcademies().subscribe(
    (data) => {
      this.academieList = data;
      console.log(this.academieList)
    },
    (error) => {
      console.error('Error fetching academies:', error);
    }
  );

  // Sync selected academies with form changes
  this.tournamentForm.get('academies')?.valueChanges.subscribe((academies: number[]) => {
    this.selectedAcademies = academies;
  });
  }

  get academiesControl(): FormControl {
    return this.tournamentForm.get('academies') as FormControl;
  }
  

  toggleAcademySelection(id: number): void {
    const index = this.selectedAcademies.indexOf(id);
    if (index > -1) {
      this.selectedAcademies.splice(index, 1); // Remove the academy if already selected
    } else {
      this.selectedAcademies.push(id); // Add the academy if not selected
    }
  
    // Update academies in the form group
    this.tournamentForm.patchValue({
      academies: this.selectedAcademies,
    });
  }

  isAcademySelected(id: number): boolean {
    return this.selectedAcademies.includes(id);
  }

  // Handle file selection for images
  onFileSelected(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.images.push(files[i]);
    }
  }

  // Remove selected image
  removeImage(image: File): void {
    this.images = this.images.filter((img) => img !== image);
  }

  // Submit tournament form
  submitTournament(): void {
    const formData = new FormData();
    const formValue = this.tournamentForm.value;
  
    // Create the tournoi object
    const tournoi = {
      nom: formValue.nom,
      dateDebut: formValue.dateDebut,
      dateFin: formValue.dateFin,
      lieu: formValue.lieu,
      nbrpoule: formValue.nbrpoule,
      type: formValue.type,
      academies: formValue.academies,
    };
  
    // Append tournoi as a JSON string
    formData.append('tournoi', new Blob([JSON.stringify(tournoi)], { type: 'application/json' }));
  
    // Append selected images
    this.images.forEach((file) => formData.append('file', file));
  
    // Append academy IDs
    formValue.academies.forEach((academyId: number) => {
      formData.append('academyIds', academyId.toString());
    });
  
    console.log("Tournoi", JSON.stringify(this.tournamentForm.value, null, 2)); // Pretty-print JSON
console.log("Images", this.images.map((file) => file.name)); // Log the names of the uploaded files
console.log("Selected Academies", this.selectedAcademies); // This is already a simple array

    // Call backend service
    this.httpService.createTournament(formData).subscribe(
      (response) => {
        console.log('Tournament created successfully:', response);
        this.router.navigate(['/tournaments']);
      },
      (error) => {
        console.error('Error creating tournament:', error);
      }
    );
  }
  
}
