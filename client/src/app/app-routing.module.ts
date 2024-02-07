import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeyboardComponent } from './components/keyboard/keyboard.component';

const routes: Routes = [
  { path: '', component: KeyboardComponent },
  { path: '', component: KeyboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
