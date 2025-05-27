import { Routes } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { BooksListComponent } from './books-list/books-list.component';

export const routes: Routes = [

  { path: 'first', component: FirstComponent, canActivate: [AuthGuard] },
  { path: 'buecherverwaltung', component: BooksListComponent, canActivate: [AuthGuard] },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'login', component: LoginComponent },
];