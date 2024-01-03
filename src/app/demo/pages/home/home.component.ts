import { Component } from '@angular/core';
import { SupportService } from 'src/app/demo/api/services/support.service';

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

  public ngOnInit() {
    this.countAllServices();
  }

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
}
