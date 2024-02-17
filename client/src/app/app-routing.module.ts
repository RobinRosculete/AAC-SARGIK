import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', component: KeyboardComponent, canActivate: [MsalGuard] }, // Route for KeyboardComponent with MsalGuard
  { path: 'gallery', component: GalleryComponent, canActivate: [MsalGuard] }, // Route for GalleryComponent with MsalGuard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
