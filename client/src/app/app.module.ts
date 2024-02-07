import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FeaturesComponent } from './components/features/features.component';

@NgModule({
  declarations: [AppComponent, NavMenuComponent, KeyboardComponent, FeaturesComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
