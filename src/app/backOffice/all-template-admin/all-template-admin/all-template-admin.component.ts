import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header/header.component";
import { SideComponent } from "../../side/side/side.component";
import { FooterComponent } from "../../footer/footer/footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-template-admin',
  standalone: true,
  imports: [HeaderComponent, SideComponent, FooterComponent,RouterModule],
  templateUrl: './all-template-admin.component.html',
  styleUrl: './all-template-admin.component.css'
})
export class AllTemplateAdminComponent {

}
