import { Component, HostListener, OnInit } from '@angular/core';
import { Academie } from '../../../_model/academie.model';
import { FileHandle } from '../../../_model/file-handle.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceBackService } from '../../service/service-back.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../frontOffice/service/auth.service';
import Swal from 'sweetalert2';

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
  windowWidth: number;
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
    private http:ServiceBackService ,private sanitizer: DomSanitizer){
      this.windowWidth = window.innerWidth;
    }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
   this.updateWindowSize();
   this.http.getAcademieById(this.id)
   .subscribe(data =>{
    this.academie = this.mapDataToAcademie(data);

  }, error => console.log(error));
  
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Update the window size whenever the window is resized
    this.updateWindowSize();
  }

  private updateWindowSize(): void {
    // Set the window width property
    this.windowWidth = window.innerWidth;
  }
  
  updateAcademie(academieForm : NgForm){
    const academieFormData = this.prepareFormData(this.academie);
    academieForm.reset();

        this.academie.images=[];
    this.http.updateAcademie(academieFormData).subscribe(
      (response: HttpResponse<any>)=>{
              
              if (response.status==201 || response.status==200) {
                
                
                          Swal.fire('Hi', 'Academie ajouter avec succees !', 'success');
              
                        this.router.navigate(["admin/Academies"]);
                
                        }
                        else  {
                
                          Swal.fire('Fail', 'ERREUR !', 'warning');
                
                        }
            },
            (error: any)=>{
              if (error.status==201 || error.status==200) {
                
                
                        Swal.fire('Hi', 'Academie ajouter avec succees !', 'success');
              
                      this.router.navigate(["admin/Academies"]);
              
                      }
                      else  {
              
                        Swal.fire('Fail', 'ERREUR !', 'warning');
              
                      }
            }
    );
    
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
