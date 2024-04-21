import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private openVSDModalSubject = new Subject<void>();

  openVSDModal$ = this.openVSDModalSubject.asObservable();

  constructor() { }

  openVSDModal() {
    this.openVSDModalSubject.next();
  }
}
