import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <main class="min-h-screen">
      <nav class="w-full min-h-full">
        <app-topbar />
      </nav>
      <section class="w-full min-h-full p-4">
        <router-outlet />
      </section>
    </main>
  `,
})
export class AppLayoutComponent {}
