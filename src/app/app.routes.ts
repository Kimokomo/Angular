import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { BuecherverwaltungComponent } from './buecherverwaltung/buecherverwaltung.component';

export const routes: Routes = [

  { path: '', component: LoginComponent },

  { path: 'buecherverwaltung', component: BuecherverwaltungComponent, canActivate: [AuthGuard] },

  { path: 'aboutus', component: AboutusComponent, canActivate: [AuthGuard] },

  { path: 'login', component: LoginComponent },
];