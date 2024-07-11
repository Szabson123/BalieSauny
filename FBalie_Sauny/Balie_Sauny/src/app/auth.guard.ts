import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isManager.pipe(
      take(1),  // Take the latest value and complete the observable
      map(isManager => {
        const currentUser = this.authService.currentUserValue;

        console.log('AuthGuard: currentUser:', currentUser);
        console.log('AuthGuard: isManager:', isManager);

        if (currentUser) {
          const roles = route.data['roles'] as boolean[];
          console.log('AuthGuard: roles:', roles);

          if (roles && roles.length > 0 && !roles.includes(isManager)) {
            console.log('AuthGuard: User does not have the required role, redirecting...');
            this.router.navigate(['/']);
            return false;
          }
          return true;
        }

        console.log('AuthGuard: User not logged in, redirecting to login...');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      })
    );
  }
}
