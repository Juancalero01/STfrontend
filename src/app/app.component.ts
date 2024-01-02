import { Component, HostListener } from '@angular/core';
import { TokenService } from './demo/api/services/token.service';

@Component({
  selector: 'app-root',
  template: ` <router-outlet />`,
})
export class AppComponent {
  constructor(private authService: TokenService) {}

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any) {
    this.authService.deleteToken();
  }
}
