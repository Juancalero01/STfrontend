import { Component } from '@angular/core';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { SupportHistoryService } from 'src/app/demo/api/services/support-history.service';
import { SupportService } from 'src/app/demo/api/services/support.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly supportHistoryService: SupportHistoryService
  ) {}

  public services: number = 0;
  public servicesActive: number = 0;
  public servicesRepair: number = 0;
  public servicesWithOutRepair: number = 0;
  public activities: ISupportHistory[] = [];

  public ngOnInit() {
    this.countAllServices();
    this.findActivities();
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

  private findActivities() {
    this.supportHistoryService.findActivitiesForLastThreeDays().subscribe({
      next: (supportHistories: ISupportHistory[]) => {
        this.activities = supportHistories;
      },
    });
  }
}
