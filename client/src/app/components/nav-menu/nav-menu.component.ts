import { Component } from '@angular/core';
import { VsdComponent } from '../vsd/vsd.component';
import { MatDialog,MatDialogRef, MatDialogConfig } from '@angular/material/dialog'


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  title = 'modal';
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(private dialog: MatDialog){}

    openDialog(){

      if (this.dialogRef && this.dialogRef.componentInstance) {
        return;
      }
      const dialogConfig = new MatDialogConfig();

      this.dialogRef = this.dialog.open(VsdComponent, {
        height: '400px',
        width: '600px',
        panelClass: 'custom-dialog'
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogRef = null;
      });

    }
   
}
