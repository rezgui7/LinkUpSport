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
import {  ImageCroppedEvent, LoadedImage, ImageCropperComponent } from 'ngx-image-cropper';
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
    private sanitizer: DomSanitizer,private formBuilder: FormBuilder,private platform: Platform) {}
  
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
  this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
  // Fetch the blob from the URL
  fetch(event.objectUrl as string)
  .then(response => response.blob())
  .then(blob => {
      // Create a File object from the Blob
      this.newImage = new File([blob], "croppedImage.png", { type: "image/png" });

      // Optionally, update the croppedImage property for preview
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            const fileHandle:FileHandle ={
              file: this.newImage,
              url: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
            }
            this.joueur.images.push(fileHandle);

  })
  .catch(error => {
      console.error('Error fetching blob from URL:', error);
      // Handle the error appropriately
  });
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
    console.log(this.RegForm)

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
        


          Swal.fire('Hi', 'Joueur ajouter avec succees !', 'success');

          this.r.navigate(["Verification/"+this.email]);

        
      },
      (error: any) => {

        

          Swal.fire('Fail', 'Email already exists !', 'warning');

        

        }


    );


  }
}

