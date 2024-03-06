import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { VsdComponent } from './components/vsd/vsd.component';

import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'keyboard', component: KeyboardComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'vsd', component: VsdComponent },
  { path: '', component: KeyboardComponent }, // Route for KeyboardComponent with MsalGuard
  { path: 'gallery', component: GalleryComponent }, // Route for GalleryComponent with MsalGuard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
