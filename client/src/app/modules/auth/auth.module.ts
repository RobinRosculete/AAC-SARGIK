// auth.module.ts
import { NgModule } from '@angular/core';
import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { environment } from 'src/environments/environment.development';

@NgModule({
  imports: [
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.clientId,
          authority: environment.authorities.signUpSignIn.authority,
          redirectUri: environment.redirectUri,
          knownAuthorities: [environment.authorityDomain],
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false,
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['openid'],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          [environment.endpoint, environment.endpointScopes],
        ]),
      }
    ),
  ],
  exports: [MsalModule],
})
export class AuthModule {}
