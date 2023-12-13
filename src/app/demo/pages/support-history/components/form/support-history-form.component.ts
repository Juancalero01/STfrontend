import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IFailureType } from 'src/app/demo/api/interfaces/failure-type.interface';
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
    private readonly supportHistoryService: SupportHistoryService
  ) {}

  public supportHistories: ISupportHistory[] = [];
  public supports: ISupport = {} as ISupport;
  public failureTypes: IFailureType[] = [];

  public ngOnInit(): void {
    this.config.data ? this.loadTable(this.config.data.id) : null;
  }

  private loadTable(id: number) {
    this.supportHistoryService.findByService(id).subscribe({
      next: (supportHistories: ISupportHistory[]) => {
        this.supportHistories = supportHistories;
        this.supports = this.config.data;
        this.failureTypes = this.config.data.failureTypes;
      },
    });
  }
}
