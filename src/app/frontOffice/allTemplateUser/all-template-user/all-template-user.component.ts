import { Component } from '@angular/core';
import { FooterUserComponent } from "../../footer/footer-user/footer-user.component";
import { HeaderUserComponent } from "../../header/header-user/header-user.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-all-template-user',
  standalone: true,
  imports: [HeaderUserComponent, FooterUserComponent, HeaderUserComponent,RouterOutlet],
  templateUrl: './all-template-user.component.html',
  styleUrl: './all-template-user.component.css'
})
export class AllTemplateUserComponent {

}
