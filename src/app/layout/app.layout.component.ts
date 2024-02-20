import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <main id="app" class="w-full">
      <nav class="w-full z-5">
        <app-topbar />
      </nav>
      <section class="py-4 px-3 w-full overflow-y-auto">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrls: ['./app.layout.component.css'],
})
export class AppLayoutComponent {}
