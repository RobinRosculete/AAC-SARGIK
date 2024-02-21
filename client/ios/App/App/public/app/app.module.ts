// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavmenuComponent } from './components/nav-menu/nav-menu.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { HomeComponent } from './components/home/home.component';
import { IonicModule } from '@ionic/angular';
import { FeaturesComponent } from './components/features/features.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavmenuComponent,
    KeyboardComponent,
    GalleryComponent,
    FeaturesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    IonicModule,
    IonicModule.forRoot({}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
