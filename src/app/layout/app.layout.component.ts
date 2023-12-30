import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <main>
      <nav>
        <app-topbar />
      </nav>
      <section class="p-4">
        <router-outlet />
      </section>
    </main>
  `,
})
export class AppLayoutComponent {}
