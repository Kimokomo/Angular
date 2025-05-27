import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { BooksListComponent } from './books-list/books-list.component';

export const routes: Routes = [

  { path: 'buecherverwaltung', component: BooksListComponent, canActivate: [AuthGuard] },
  { path: 'aboutus', component: AboutusComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
];