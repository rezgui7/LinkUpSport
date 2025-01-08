import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceBackService {
  userUrl="http://localhost:8085/";

  constructor(private http:HttpClient) { }
}
