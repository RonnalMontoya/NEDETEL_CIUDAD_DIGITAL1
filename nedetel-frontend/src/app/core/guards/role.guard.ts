import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService, Role } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const user = this.auth.user;

    if (!user) {
      this.router.navigateByUrl('/login');
      return false;
    }

    const allowedRoles = route.data?.['roles'] as Role[] | undefined;

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    return false;
  }
}