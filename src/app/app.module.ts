import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/pages/notfound/notfound.component';
import { PrimeNGConfig } from 'primeng/api';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptorInterceptor } from './demo/pages/auth/interceptors/jwt-interceptor.interceptor';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [AppRoutingModule, AppLayoutModule, HttpClientModule],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private readonly primeNGConfig: PrimeNGConfig,
    private readonly httpClient: HttpClient
  ) {
    this.loadTranslations();
  }

  private loadTranslations() {
    this.httpClient
      .get('../assets/translate/primeng.json')
      .subscribe((translations) => {
        this.primeNGConfig.setTranslation(translations);
      });
  }
}
