import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage, OutputFormat } from 'ngx-image-cropper';
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
  cropperFormat: OutputFormat = 'png'; // Default format is 'png'


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

  
  enableEdit(fieldName: string) {
    this.fieldChanges=true;
    this.isEditable[fieldName] = !this.isEditable[fieldName];
    if (this.fieldChanges) {
      window.onbeforeunload = (event) => {
          event.returnValue = 'The updated field will be lost !';
      };
      }
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
}

