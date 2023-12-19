import { Component } from '@angular/core';

@Component({
  selector: 'app-main-statistic',
  templateUrl: './main-statistic.component.html',
  styles: [],
})
export class MainStatisticComponent {
  data: any;

  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
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
      },
    };
  }
}

// A NIVEL GENERAL OBTENER EL PROMEDIO DE TIEMPO DE RETENCION POR TODOS LOS SERVICIOS
// A NIVEL GENERAL OBTENER EL PROMEDIO DE TIEMPO DE REPARACIÓN POR TODOS LOS SERVICIOS

//?Repreguntar: Esto son estadisticas distintas o son las mismas?
// A NIVEL GENERAL MOSTRAR LA TASA DE FALLA POR TODOS LOS SERVICIOS
// A NIVEL GENERAL MOSTRAR LOS TIPOS DE FALLAS POR TODOS LOS SERVICIOS
