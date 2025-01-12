import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { ServiceBackService } from '../../service/service-back.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Joueur } from '../../../_model/joueur.model';
import { Platform } from '@angular/cdk/platform';
import Swal from 'sweetalert2';
import { FileHandle } from '../../../_model/file-handle.model';
import { AuthService } from '../../../frontOffice/service/auth.service';

@Component({
  selector: 'app-modif-joueur',
  standalone: true,
  imports: [HttpClientModule, RouterModule,
      FormsModule,MatGridListModule,
      CommonModule,ImageCropperComponent,
      ReactiveFormsModule ],
    providers: [ServiceBackService,AuthService],
  templateUrl: './modif-joueur.component.html',
  styleUrl: './modif-joueur.component.css'
})
export class ModifJoueurComponent implements OnInit{
  id:any;
  imageId:any;
  fieldChanges: boolean = false;
  newImage!: File;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imagesToShow :SafeUrl[]=[];
  currentDate!: Date;
  isEditable: { [key: string]: boolean } = {
    nom: false,
    prenom: false,
    datenaissance: false,
    telephone: false,
    categorie: false
   };
   isBrowser: boolean = false;


  joueur:Joueur={
    id:0,
    nom: "",
    prenom: "",
    datenaissance:"",
    telephone:"",
    categorie:"",
    images:[],
    
  }
  constructor(private r: Router, private http: ServiceBackService,private route:ActivatedRoute,
      private sanitizer: DomSanitizer,private formBuilder: FormBuilder,private platform: Platform){this.currentDate = new Date();}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isBrowser = this.platform.isBrowser;
    console.log(this.id);

    this.http.getJoueurById(this.id)
   .subscribe(data =>{
    this.joueur = this.mapDataToJoueur(data);

    console.log(this.joueur);

    
  }, error => console.log(error));

  }
  private mapDataToJoueur(data: any): Joueur {
      // Adaptation des données avant de les assigner au modèle Course
      const images: FileHandle[] = data.photoJoueur.map((image: any) => {
        this.imagesToShow[0] = this.sanitizer.bypassSecurityTrustUrl(`data:${image.type};base64,${image.imageData}`);
        return {
          file: new File([image.imageData], image.name, { type: image.type }),
          url: this.sanitizer.bypassSecurityTrustUrl(`data:${image.type};base64,${image.imageData}`)
          
        };
        
      });
    
      return {
        id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      datenaissance: data.datenaissance,
      telephone: data.telephone,
      categorie: data.categorie,
        images: images
      };
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

  update(){
 const { nom, prenom, datenaissance, telephone, categorie } = this.joueur;

 const userDetails = {
  nom,
  prenom,
  datenaissance,
  telephone,
  categorie
 };

    
    if (this.joueur.datenaissance>=this.currentDate.toISOString().slice(0, 10) ) {
      Swal.fire('Fail', 'unvalid Date', 'warning');

      return;
    }

    const joueurFormData = this.prepareFormData(this.joueur);
    console.log(this.joueur);

      this.http.updateJoueur(joueurFormData)
        .subscribe((response: HttpResponse<any>) => {
          console.log(response)

            Swal.fire('Hi', 'joueur ajouter avec succes !', 'success');
  
  this.r.navigate(["/admin/Joueurs"]);
  
          
        },
        (error: any) => {
          console.log(error)
          
  
            Swal.fire('Fail', 'Email already exists !', 'warning');
  
          }
  
          
  
  
      );
    
  }

  
  enableEdit(fieldName: string) {
    this.fieldChanges=true;
    this.isEditable[fieldName] = !this.isEditable[fieldName];
    if (this.fieldChanges) {
      window.onbeforeunload = (event) => {
          event.returnValue = 'The updated field will be lost !';
      };
      }
  }

  fileChangeEvent(event: Event): void {
    this.fieldChanges = true;
  
    // Ensure event is from an input element
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageChangedEvent = event; // Store the entire event if needed
  
      // Optional: If you only need the file itself
      const file = input.files[0];
      console.log('Selected file:', file.name);
  
      // Add a warning for unsaved changes
      if (this.fieldChanges) {
        window.onbeforeunload = (e: BeforeUnloadEvent) => {
          e.returnValue = 'The updated field will be lost!';
          return e.returnValue; // Required for most browsers
        };
      }
    } else {
      console.warn('No file selected.');
    }
  }
  
  imageCropped(event: ImageCroppedEvent): void {
    if (!event.objectUrl) {
      console.error('Cropped image URL is missing');
      return;
    }
  
    // Fetch the Blob from the cropped image URL
    fetch(event.objectUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a File object from the Blob
        this.newImage = new File([blob], 'croppedImage1.png', { type: 'image/png' });
  
        // Securely update the cropped image for preview
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  
        // Create a FileHandle object and add it to joueur.images
        const fileHandle: FileHandle = {
          file: this.newImage,
          url: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)),
        };
        this.joueur.images.push(fileHandle);
      })
      .catch((error) => {
        console.error('Error fetching blob from URL:', error);
        // Handle the error (e.g., show an alert or fallback behavior)
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
}

