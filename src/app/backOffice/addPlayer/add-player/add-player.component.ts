import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Joueur } from '../../../_model/joueur.model';
import { ReactiveFormsModule,FormControl, FormGroup, FormsModule,FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { ServiceBackService } from '../../service/service-back.service';
import { DomSanitizer } from '@angular/platform-browser';
import {  ImageCroppedEvent, LoadedImage, ImageCropperComponent, OutputFormat } from 'ngx-image-cropper';
import { FileHandle } from '../../../_model/file-handle.model';
import { Platform } from '@angular/cdk/platform';
import { AuthService } from '../../../frontOffice/service/auth.service';

@Component({
  selector: 'app-add-player',
  standalone: true,
  imports: [HttpClientModule, RouterModule,
    FormsModule,MatGridListModule,
    CommonModule,ImageCropperComponent,
    ReactiveFormsModule ],
  providers: [ServiceBackService,AuthService],
  templateUrl: './add-player.component.html',
  styleUrl: './add-player.component.css'
})
export class AddPlayerComponent implements OnInit {
  email!: string;
  cropperFormat: OutputFormat = 'png'; // Default format is 'png'

  //joueur!: Joueur[];
  joueur: Joueur = {
      id: 0,
      nom: '',
      prenom: '',
      datenaissance: '',
      telephone: '',
      categorie: '',
      images: [],
    };
  //newUser = new Joueur();
  RegForm!: FormGroup;
  currentDate!: Date;
  showPassword: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;
  newImage!: File;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isBrowser: boolean = false;

  constructor(private r: Router, private http: ServiceBackService,
    private sanitizer: DomSanitizer,private formBuilder: FormBuilder,private platform: Platform,private authservice:AuthService) {}
  
ngOnInit(): void {
  this.isBrowser = this.platform.isBrowser;

  this.RegForm = this.formBuilder.group({
    nom: new FormControl(''),
    prenom: new FormControl(''),
    datenaissance: new FormControl(''),
    telephone: new FormControl(''),
    categorie: new FormControl(''),
  });



}
successNotification() {
  Swal.fire('Hi', 'Mail verification Sent !', 'success');
}


fileChangeEvent(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      console.error('Unsupported file type:', file.type);
      alert('Please upload a valid image file (JPEG, PNG, GIF, BMP, WEBP).');
      return;
    }

    // Validate file size (optional, e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('File is too large:', file.size);
      alert('File size should not exceed 5MB.');
      return;
    }

    // Set the cropper format dynamically
    this.cropperFormat = file.type === 'image/jpeg' ? 'jpeg' : 'png';

    // Assign the event for the cropper
    this.imageChangedEvent = event;
  } else {
    console.error('No file selected or file list is empty.');
  }
}



  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      fetch(event.objectUrl as string)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "croppedImage.png", { type: "image/png" });
          const fileHandle: FileHandle = {
            file: file,
            url: this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(blob)
            ),
          };
  
          this.joueur.images.push(fileHandle);
        })
        .catch((error) => {
          console.error("Error fetching blob from URL:", error);
        });
    }
  }
 
imageLoaded(image: LoadedImage) {
  // show cropper
}
cropperReady() {
  // cropper ready
}
loadImageFailed() {
  // show message
}
 
prepareFormData(joueur:Joueur): FormData{
    const formData =new FormData();
    formData.append(
      'joueur',
      new Blob([JSON.stringify(joueur)],{type: 'application/json'})
    );

    for (var i= 0;i<joueur.images.length;i++){
      formData.append(
        'file', 
        joueur.images[i].file,
        joueur.images[i].file.name
      );
    }
    return formData;
  }
  
  userCreate() {

   if (!this.RegForm.value.nom || !this.RegForm.value.prenom ||
     !this.RegForm.value.datenaissance || !this.RegForm.value.telephone ||
     !this.RegForm.value.categorie) {

      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


      return;
    }


    
    if (this.RegForm.value.birthdate>=this.currentDate ) {
      Swal.fire('Fail', 'unvalid Date', 'warning');

      return;
    }

    this.joueur.nom=this.RegForm.value.nom;
    this.joueur.prenom=this.RegForm.value.prenom;
    this.joueur.datenaissance=this.RegForm.value.datenaissance;
    this.joueur.telephone=this.RegForm.value.telephone;
    this.joueur.categorie=this.RegForm.value.categorie;

    const joueurFormData = this.prepareFormData(this.joueur);
    console.log(this.joueur);

    this.http.addJoueur(joueurFormData).subscribe((response: HttpResponse<any>) => {
        


          
          if (response.status==201 || response.status==200) {
  
  
            Swal.fire('Hi', 'Joueur ajouter avec succees !', 'success');

          this.r.navigate(["admin/Joueurs"]);
  
          }
          else  {
  
            Swal.fire('Fail', 'ERREUR !', 'warning');
  
          }
        
      },
      (error: any) => {

        if (error.status==201 || error.status==200) {
  
  
          Swal.fire('Hi', 'Joueur ajouter avec succees !', 'success');

        this.r.navigate(["admin/Joueurs"]);

        }
        else  {

          Swal.fire('Fail', 'ERREUR !', 'warning');

        }


        

        }


    );


  }
}

