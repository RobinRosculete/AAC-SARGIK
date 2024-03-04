import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

//Service used to Guard against accessing routes when not authenticated
export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //Calling is Authenticated to check if JWT token is available
  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirect to login page
    router.navigate(['/login']);
    return false;
  }
};
