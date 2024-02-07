import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  constructor(private router:Router){}

  goToPage(pageName:string):void{
    this.router.navigate([`${pageName}`]);
  }
}
