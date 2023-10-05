import { Component } from '@angular/core';

@Component({
  selector: 'app-notfound',
  template: `
    <div class="min-h-screen flex justify-content-center align-items-center">
      <div
        class="px-2 py-3 flex flex-column justify-content-center align-items-center gap-2"
      >
        <h1 class="text-8xl">404</h1>
        <p class="text-gray-400">Esta página no existe</p>
      </div>
    </div>
  `,
  styles: [],
})
export class NotfoundComponent {}
