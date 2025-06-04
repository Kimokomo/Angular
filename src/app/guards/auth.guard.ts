import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.auth.getUserRole();
    const allowedRoles = route.data['roles'] as Array<string> | undefined;

    if (!allowedRoles || allowedRoles.length === 0) {
      // Wenn keine Rollen definiert, dann erlauben (z.B. öffentliche Seiten)
      return true;
    }

    // Rolle ist bekannt und erlaubt
    if (userRole !== null && allowedRoles.includes(userRole)) {
      return true;
    }


    // Unbekannte Rolle oder nicht erlaubt
    //this.router.navigate(['/unauthorized']);
    return false;
  }

}
