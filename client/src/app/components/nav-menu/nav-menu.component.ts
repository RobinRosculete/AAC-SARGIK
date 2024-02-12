import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-navmenu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavmenuComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false; // Corrected variable name
  userName?: string = '';
  private readonly _destroy = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadCastService: MsalBroadcastService,
    private authService: MsalService
  ) {}

  ngOnInit(): void {
    this.msalBroadCastService.inProgress$
      .pipe(
        filter(
          (interactionStatus: InteractionStatus) =>
            interactionStatus == InteractionStatus.None
        ),
        takeUntil(this._destroy)
      )
      .subscribe((x) => {
        this.isUserLoggedIn =
          this.authService.instance.getAllAccounts().length > 0;

        if (this.isUserLoggedIn) {
          this.userName = this.authService.instance.getAllAccounts()[0].name;
        }
      });
  }
  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.postLogoutUrl,
    });
  }
}
