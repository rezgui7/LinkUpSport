import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServiceBackService } from '../../service/service-back.service';
import { HttpClientModule, HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
import { Academie } from '../../../_model/academie.model';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { FileHandle } from '../../../_model/file-handle.model';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../frontOffice/service/auth.service';

@Component({
  selector: 'app-add-academy',
  standalone: true,
  imports: [HttpClientModule, RouterModule,FormsModule,MatGridListModule,CommonModule ],
  providers: [ServiceBackService,AuthService],
  styleUrls: ['./add-academy.component.css'],
  templateUrl: './add-academy.component.html',
})
export class AddAcademyComponent {
  academieList: any;

  academie: Academie = {
    id: 0,
    nom: '',
    adresse: '',
    nomproprietaire: '',
    telephone: '',
    email: '',
    images: [],
    Joueur:[],
  };
  constructor(private r: Router, private http: ServiceBackService,private sanitizer: DomSanitizer) {}
  
  addAcademie(academieForm : NgForm){
    
    const academieFormData = this.prepareFormData(this.academie);

    academieForm.reset();

        this.academie.images=[];
    this.http.addAcademie(academieFormData).subscribe(
      (res:Academie)=>{
        
        console.log(res);
      },
      (error: HttpErrorResponse)=>{
        console.log(error);
      }
    );
  }

  prepareFormData(academie:Academie): FormData{
    const formData =new FormData();
    formData.append(
      'academie',
      new Blob([JSON.stringify(academie)],{type: 'application/json'})
    );

    for (var i= 0;i<academie.images.length;i++){
      formData.append(
        'file', 
        academie.images[i].file,
        academie.images[i].file.name
      );
    }
    return formData;
  }

  onFileSelected(event:any){
    if(event.target.files){
      const file=event.target.files[0];
      const fileHandle:FileHandle ={
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        )
      }

      this.academie.images.push(fileHandle);

    }
  }
  removeImages(i:number){
    this.academie.images.splice(i,1);
  }
  fileDropped(fileHandle: any) {
    this.academie.images.push(fileHandle);
  }
  clear(projectForm:NgForm){
    projectForm.reset();
  }
}
