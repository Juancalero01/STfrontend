import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { SupportHistoryService } from 'src/app/demo/api/services/support-history.service';

@Component({
  selector: 'app-support-history-form',
  templateUrl: './support-history-form.component.html',
})
export class SupportHistoryFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly supportHistoryService: SupportHistoryService
  ) {}

  public supportHistories: ISupportHistory[] = [];

  public ngOnInit(): void {
    this.config.data ? this.loadTable(this.config.data) : null;
  }

  private loadTable(id: number) {
    this.supportHistoryService.findByService(id).subscribe({
      next: (supportHistories: ISupportHistory[]) => {
        this.supportHistories = supportHistories;
      },
    });
  }
}
