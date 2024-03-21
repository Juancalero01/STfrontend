import { Component } from '@angular/core';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { ISupport, ISupportMain } from '../../api/interfaces/support.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private readonly supportService: SupportService) {}

  public supports: ISupport[] = [];
  public supportMain: ISupportMain = {} as ISupportMain;

  ngOnInit() {
    this.getDetailSupports();
    this.getAllSupportsMain();
  }

  /**
   * Carga los detalles de soportes desde el servicio principal y los asigna a la propiedad 'clients' para su visualización en la tabla.
   */
  private getDetailSupports() {
    this.supportService.getServiceMain().subscribe({
      next: (supportMain: ISupportMain) => {
        this.supportMain = supportMain;
      },
    });
  }

  /**
   * Carga los soportes activos desde el servicio principal y los asigna a la propiedad 'supports' para su visualización en la tabla.
   */
  private getAllSupportsMain() {
    this.supportService.findAllActiveServices().subscribe({
      next: (supports: ISupport[]) => {
        this.supports = supports;
      },
    });
  }
}
