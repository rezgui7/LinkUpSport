import { Routes } from '@angular/router';
import { AllTemplateAdminComponent } from './backOffice/all-template-admin/all-template-admin/all-template-admin.component';
import { AddAcademyComponent } from './backOffice/addAcademy/add-academy/add-academy.component';
import { AllTemplateUserComponent } from './frontOffice/allTemplateUser/all-template-user/all-template-user.component';

export const routes: Routes = [
    {
        path:'admin',
        component:AllTemplateAdminComponent,
        children:[
            {
                path:'addEvent',
                component:AddAcademyComponent
            }
        ]
      },
      {
        path:'user',
        component:AllTemplateUserComponent,
        children:[
            {
                path:'addEvent',
                component:AddAcademyComponent
            }
        ]
      }
];
