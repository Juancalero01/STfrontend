import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <main class="min-h-screen">
      <nav>
        <app-topbar />
      </nav>
      <section class="p-4" style="height: calc(100vh - 63px);">
        <router-outlet />
      </section>
    </main>
  `,
})
export class AppLayoutComponent {}
