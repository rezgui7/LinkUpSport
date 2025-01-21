import { Routes } from '@angular/router';
import { AllTemplateAdminComponent } from './backOffice/all-template-admin/all-template-admin/all-template-admin.component';
import { AddAcademyComponent } from './backOffice/addAcademy/add-academy/add-academy.component';
import { AllTemplateUserComponent } from './frontOffice/allTemplateUser/all-template-user/all-template-user.component';
import { AcademiesComponent } from './backOffice/academies/academies/academies.component';
import { ModifAcademyComponent } from './backOffice/modifAcademy/modif-academy/modif-academy.component';
import { AddPlayerComponent } from './backOffice/addPlayer/add-player/add-player.component';
import { JoueursComponent } from './backOffice/joueurs/joueurs/joueurs.component';
import { ModifJoueurComponent } from './backOffice/modifJoueur/modif-joueur/modif-joueur.component';
import { LoginComponent } from './frontOffice/auth/login/login/login.component';
import { RegisterComponent } from './frontOffice/auth/register/register/register.component';
import { RoleselectionComponent } from './frontOffice/auth/RolesSelection/roleselection/roleselection.component';
import { AuthGuardService } from './frontOffice/service/auth-guard.service';
import { OrganisationTournoiComponent } from './backOffice/tournoi/organisation-tournoi/organisation-tournoi.component';
import { TournoisComponent } from './backOffice/tournoisList/tournois/tournois.component';

export const routes: Routes = [
    {
        path:'admin',
        component:AllTemplateAdminComponent,
       
        children:[
          
            {
                path:'AddAcademy',
                component:AddAcademyComponent
            },
            {
                path:'Academies',
                component:AcademiesComponent
            },
            {
                path:'ModifierAcademie/:id', title: "ModifierAcademie",
                component:ModifAcademyComponent
            },
            {
                path:'addPlayer',
                component:AddPlayerComponent
            },
            {
                path:'Joueurs',
                component:JoueursComponent
            },
            {
                path:'ModifierJoueur/:id', title: "ModifierJoueur",
                component:ModifJoueurComponent
            },
            {
                path:'Tournoi', title: "Tournoi",
                component:OrganisationTournoiComponent
            },
            {
                path:'TournoiList', title: "TournoiList",
                component:TournoisComponent
            },
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
  { path: '', redirectTo: '/user/login', pathMatch: 'full' }
  // Nouvelle route pour Login
  
  // Route de redirection par défaut si l'URL ne correspond à aucune route
];
