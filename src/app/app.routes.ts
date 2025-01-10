import { Routes } from '@angular/router';
import { AllTemplateAdminComponent } from './backOffice/all-template-admin/all-template-admin/all-template-admin.component';
import { AddAcademyComponent } from './backOffice/addAcademy/add-academy/add-academy.component';
import { AllTemplateUserComponent } from './frontOffice/allTemplateUser/all-template-user/all-template-user.component';
import { LoginComponent } from './frontOffice/auth/login/login/login.component';  // Importation du LoginComponent
import { RegisterComponent } from './frontOffice/auth/register/register/register.component';
import { RoleselectionComponent } from './frontOffice/auth/RolesSelection/roleselection/roleselection.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AllTemplateAdminComponent,
    children: [
      {
        path: 'addEvent',
        component: AddAcademyComponent
      }
    ]
  },
  {
    path: 'user',
    component: AllTemplateUserComponent,
    children: [
      { path: 'login', component: LoginComponent },
  
  // Nouvelle route pour Register
  { path: 'register', component: RegisterComponent },
  { path: 'role', component: RoleselectionComponent },

    ]
  },
  // Nouvelle route pour Login
  
  // Route de redirection par défaut si l'URL ne correspond à aucune route
];
