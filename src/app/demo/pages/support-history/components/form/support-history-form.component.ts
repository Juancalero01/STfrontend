import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IFailureType } from 'src/app/demo/api/interfaces/failure-type.interface';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';

@Component({
  selector: 'app-support-history-form',
  templateUrl: './support-history-form.component.html',
})
export class SupportHistoryFormComponent {
  constructor(private readonly config: DynamicDialogConfig) {}
  public supports: ISupport = {} as ISupport;

  public ngOnInit(): void {
    if (this.config.data) {
      this.loadTable();
    }
  }

  private loadTable(): void {
    this.supports = this.config.data;
  }

  public getTagSeverity(stateId: number): string {
    if (stateId === 11) {
      return 'success';
    } else {
      return 'warning';
    }
  }
}
