import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';

const routes: Routes = [
  { path: '', component: KeyboardComponent }, // Route for KeyboardComponent with MsalGuard
  { path: 'gallery', component: GalleryComponent }, // Route for GalleryComponent with MsalGuard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
