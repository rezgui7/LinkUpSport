import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ServiceBackService } from '../../service/service-back.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-academies',
  standalone: true,
  imports: [MatCardModule,
    MatFormFieldModule, CommonModule,
    MatInputModule,MatTableModule, 
    MatSortModule, HttpClientModule,
    MatPaginatorModule ],
  templateUrl: './academies.component.html',
  providers: [ServiceBackService],
  styleUrls: ['./academies.component.css'],
  host: {
    '[attr.ngSkipHydration]': 'true',  // Add ngSkipHydration to the host element
  }
})
export class AcademiesComponent implements OnInit {
  
  
  academieList: any[] = []; 

    constructor(private r: Router, private http: ServiceBackService) {}
  
    ngOnInit(): void {
      
      // Fetch data
      this.http.getAllAcademies().subscribe(
        (data) => {
          this.academieList = data;
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
    this.http.deleteAcademie(id).subscribe(data=>console.log(data));
    location.reload();
  }
  
  
  
}
