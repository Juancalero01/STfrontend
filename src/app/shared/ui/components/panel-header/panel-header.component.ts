import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panel-header',
  template: `
    <header>
      <h2 class="font-medium">{{ title }}</h2>
      <p class="text-gray-600 font-medium">{{ subtitle }}</p>
    </header>
  `,
})
export class PanelHeaderComponent {
  @Input() title?: string;
  @Input() subtitle?: string;

  ngOnInit() {}
}
