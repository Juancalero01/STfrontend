import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportHistoryService } from 'src/app/demo/api/services/support-history.service';
import { SupportService } from 'src/app/demo/api/services/support.service';

@Component({
  selector: 'app-support-history-form',
  templateUrl: './support-history-form.component.html',
})
export class SupportHistoryFormComponent {
  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly supportHistoryService: SupportHistoryService,
    private readonly supportService: SupportService
  ) {}

  public supportHistories: ISupportHistory[] = [];
  public supports!: ISupport;

  public ngOnInit(): void {
    this.config.data ? this.loadTable(this.config.data.id) : null;
    this.loadService(this.config.data.id);
  }

  private loadTable(id: number) {
    this.supportHistoryService.findByService(id).subscribe({
      next: (supportHistories: ISupportHistory[]) => {
        this.supportHistories = supportHistories;
      },
    });
  }

  public loadService(id: number) {
    this.supportService.findOne(id).subscribe({
      next: (supports: ISupport) => {
        this.supports = supports;
        console.log('data', this.supports);
      },
    });
  }
}
