import { Component } from '@angular/core';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportHistoryService } from 'src/app/demo/api/services/support-history.service';
import { SupportService } from 'src/app/demo/api/services/support.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
})
export class MainStatisticComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly supportHistoryService: SupportHistoryService
  ) {}

  public generalServices: number = 0;
  public activeServices: number = 0;
  public repairServices: number = 0;
  public withOutServices: number = 0;
  public activities: ISupportHistory[] = [];

  public ngOnInit() {
    this.countAllServices();
    this.countActiveServices();
    this.countRepairServices();
    this.countWithOutRepairServices();
    this.findActivities();
  }

  private countAllServices() {
    this.supportService.findAllWithoutCancel().subscribe({
      next: (supports: number) => {
        this.generalServices = supports;
      },
    });
  }

  private countActiveServices() {
    this.supportService.findAllActiveServices().subscribe({
      next: (supports: ISupport[]) => {
        this.activeServices = supports.length;
      },
    });
  }

  private countRepairServices() {
    this.supportService.findAllWithRepair().subscribe({
      next: (supports: number) => {
        this.repairServices = supports;
      },
    });
  }

  private countWithOutRepairServices() {
    this.supportService.findAllWithoutRepair().subscribe({
      next: (supports: number) => {
        this.withOutServices = supports;
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
