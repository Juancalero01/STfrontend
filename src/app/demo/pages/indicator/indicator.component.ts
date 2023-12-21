import { Component } from '@angular/core';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
})
export class IndicatorComponent {
  data: any;

  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['TEST A', 'TEST B', 'TEST C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [
            documentStyle.getPropertyValue('--cyan-700'),
            documentStyle.getPropertyValue('--cyan-500'),
            documentStyle.getPropertyValue('--cyan-200'),
          ],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
        title: {
          display: true,
          text: 'Custom Chart Test',
        },
      },
    };
  }
}
