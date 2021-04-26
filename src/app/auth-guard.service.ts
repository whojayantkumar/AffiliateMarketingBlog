import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean| UrlTree> | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(map(user => {
      const authUser =  !!user;
      if(authUser){
        return true;
      }
      return this.router.createUrlTree(['/login']);
    
  }))
}

}
