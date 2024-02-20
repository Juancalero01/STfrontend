import { Component } from '@angular/core';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { ISupport } from '../../api/interfaces/support.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private readonly supportService: SupportService) {}

  public services: number = 0;
  public servicesActive: number = 0;
  public servicesRepair: number = 0;
  public servicesWithOutRepair: number = 0;
  public supports: ISupport[] = [];

  //Inicializador de funciones
  ngOnInit() {
    this.countAllServices();
    this.loadSupportsMain();
  }

  //Cuenta todos los servicios (En total, Activos, Reparados y No reparados), este es por año actual.
  private countAllServices() {
    this.supportService.getServiceMain().subscribe({
      next: (supports: any) => {
        this.services = supports.services;
        this.servicesActive = supports.servicesActive;
        this.servicesRepair = supports.servicesRepair;
        this.servicesWithOutRepair = supports.servicesWithOutRepair;
      },
    });
  }

  //Carga de servicios activos.
  private loadSupportsMain() {
    this.supportService.findAllActiveServices().subscribe({
      next: (supports: ISupport[]) => {
        this.supports = supports;
      },
    });
  }
}
