import { Component, OnInit } from '@angular/core';
import { Academie } from '../../../_model/academie.model';
import { FileHandle } from '../../../_model/file-handle.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceBackService } from '../../service/service-back.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../frontOffice/service/auth.service';

@Component({
  selector: 'app-modif-academy',
  standalone: true,
  imports: [HttpClientModule,FormsModule,MatGridListModule,CommonModule ],
  providers: [ServiceBackService,AuthService],
  templateUrl: './modif-academy.component.html',
  styleUrl: './modif-academy.component.css'
})
export class ModifAcademyComponent implements OnInit {
  id:any;

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

  img:FileHandle={
    file:new File(["file content"], "example.txt", { type: "text/plain" }),
    url:"any"
  }

  constructor(      private route:ActivatedRoute,
    private router:Router,
    private http:ServiceBackService ,private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
   console.log(this.id);

   this.http.getAcademieById(this.id)
   .subscribe(data =>{
    console.log(data);
    this.academie = this.mapDataToAcademie(data);
    console.log(this.academie);

  }, error => console.log(error));
  
  }
  updateAcademie(academieForm : NgForm){
    const academieFormData = this.prepareFormData(this.academie);
    academieForm.reset();

        this.academie.images=[];
    this.http.updateAcademie(academieFormData).subscribe(
      (res:Academie)=>{
        
        console.log(res);
      },
      (error: HttpErrorResponse)=>{
        console.log(error);
      }
    );
    console.log(this.academie);
    
  }
  
goToAcademieList(){
 this.router.navigate(['admin/dashboard']);
}



  delete(id:any){
    this.http.deleteAcademie(id).subscribe(data=>console.log(data));
    location.reload();
  }
  prepareFormData(academie:any): FormData{
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
    console.log(event);
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
  clear(academieForm:NgForm){
    academieForm.reset();
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

}
