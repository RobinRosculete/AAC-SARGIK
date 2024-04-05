import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { VsdComponent } from './components/vsd/vsd.component';
import { LoginComponent } from './components/login/login.component';
import { authGuardGuard } from './services/auth/auth-guard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'vsd', component: VsdComponent, canActivate: [authGuardGuard] },
  { path: '', component: KeyboardComponent, canActivate: [authGuardGuard] },

  {
    path: 'gallery',
    component: GalleryComponent,
    canActivate: [authGuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
