import { Component, OnInit } from '@angular/core';
import { ServiceBackService } from '../../service/service-back.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-joueurs',
  standalone: true,
  imports: [MatCardModule,
      MatFormFieldModule, CommonModule,
      MatInputModule,MatTableModule, 
      MatSortModule, HttpClientModule,
      MatPaginatorModule ],
  templateUrl: './joueurs.component.html',
  providers: [ServiceBackService],
  styleUrl: './joueurs.component.css',
  host: {
    '[attr.ngSkipHydration]': 'true',  // Add ngSkipHydration to the host element
  }
})
export class JoueursComponent implements OnInit {
  
  
  joueursList: any[] = []; 

    constructor(private r: Router, private http: ServiceBackService) {}
  
    ngOnInit(): void {
      
      // Fetch data
      this.http.getAllJoueurs().subscribe(
        (data) => {
          this.joueursList = data;
        },
        (error) => {
          console.error('Error fetching academies:', error);
        }
      );
    }

  
    




  UpdateProject(id:any){
    this.r.navigate(['/admin/updateProject',{id:id}]);
  }
  CreateProject(id:any){
    this.r.navigate(['admin/createSProject',{id:id}]);
  }
  viewDetails(id:any){
    this.r.navigate(['admin/projectDetails',{id:id}]);
  }
  delete(id:any){
    this.http.deleteJoueur(id).subscribe(data=>console.log(data));
    location.reload();
  }
  
  
  
}
