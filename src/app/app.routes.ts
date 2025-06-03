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

 

  { path: 'superadmin/buecherverwaltung', component: BuecherverwaltungComponent, canActivate: [AuthGuard] },

  { path: 'aboutus', component: AboutusComponent },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterUserLoginFormComponent },

  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },

  { path: 'terminbuchung', component: TerminBuchungComponent, canActivate: [AuthGuard] },

  { path: 'admin/terminuebersicht', component: TerminUebersichtComponent, canActivate: [AuthGuard] },

  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '/login' },
  { path: '', redirectTo: '/login', pathMatch: 'full' }



];