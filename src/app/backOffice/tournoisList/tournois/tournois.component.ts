import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServiceBackService } from '../../service/service-back.service';
import { AuthService } from '../../../frontOffice/service/auth.service';

@Component({
  selector: 'app-tournois',
  standalone: true,
  imports: [MatCardModule,
      MatFormFieldModule, CommonModule,
      MatInputModule,MatTableModule, 
      MatSortModule, HttpClientModule,
      MatPaginatorModule],
  providers: [ServiceBackService,AuthService],
      
  templateUrl: './tournois.component.html',
  styleUrl: './tournois.component.css'
})
export class TournoisComponent implements OnInit {
  
  
  tournoiList: any[] = []; 

    constructor(private r: Router, private http: ServiceBackService) {}
  
    ngOnInit(): void {
      
      // Fetch data
      this.http.getAllTournoi().subscribe(
        (data) => {
          this.tournoiList = data;
        },
        (error) => {
          console.error('Error fetching academies:', error);
        }
      );
    }

  
    
  delete(id:any){
    this.http.deleteTournoi(id).subscribe(data=>console.log(data));
    location.reload();
  }
  
  
  
}
