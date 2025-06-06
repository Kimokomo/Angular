import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { BuecherverwaltungComponent } from './buecherverwaltung/buecherverwaltung.component';
import { RegisterUserLoginFormComponent } from './register-user-login-form/register-user-login-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TerminBuchungComponent } from './termin-buchung/termin-buchung.component';
import { TerminUebersichtComponent } from './termin-uebersicht/termin-uebersicht.component';

export const routes: Routes = [

  {
    path: 'superadmin/buecherverwaltung',
    component: BuecherverwaltungComponent,
    canActivate: [AuthGuard],
    data: { roles: ['superadmin'] }
  },

  {
    path: 'admin/terminuebersicht',
    component: TerminUebersichtComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'superadmin'] }
  },


  {
    path: 'member',
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin', 'superadmin'] },
    children: [
      {
        path: 'profile',
        component: UserProfileComponent
      },
      {
        path: 'terminbuchung',
        component: TerminBuchungComponent
      }
    ]
  },


  { path: 'aboutus', component: AboutusComponent },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterUserLoginFormComponent },

  // wenn der Pfad http://localhost:4200/ ist dan zu /login 
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // kein passender Pfad dann zu /login
  { path: '**', redirectTo: '/login' }

];
