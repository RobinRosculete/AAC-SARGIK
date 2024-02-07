import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
const routes: Routes = [
  //{path:"",component:NavMenuComponent},
  { path: '', component: KeyboardComponent },
  { path: 'gallery', component: GalleryComponent },
];
//const routes: Routes = [{path:"gallery",component:GalleryComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
