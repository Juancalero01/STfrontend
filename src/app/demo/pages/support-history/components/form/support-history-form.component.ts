import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';

@Component({
  selector: 'app-support-history-form',
  templateUrl: './support-history-form.component.html',
})
export class SupportHistoryFormComponent {
  constructor(private readonly config: DynamicDialogConfig) {}
  public supports: ISupport = {} as ISupport;
  public supportHistories: ISupportHistory[] = [];

  public ngOnInit(): void {
    if (this.config.data) {
      this.loadTable();
    }
  }

  private loadTable(): void {
    this.supports = this.config.data;
    this.supportHistories = this.config.data.serviceHistory;
  }

  public getTagSeverity(stateId: number): string {
    if (stateId === 12) {
      return 'success';
    } else {
      return 'warning';
    }
  }
}
