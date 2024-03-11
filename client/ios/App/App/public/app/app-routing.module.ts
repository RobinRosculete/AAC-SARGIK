import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { authGuardGuard } from './services/auth/auth-guard.guard';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: KeyboardComponent,
    canActivate: [authGuardGuard],
  },

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
