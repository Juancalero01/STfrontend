import { Component, Inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-indicator-form',
  templateUrl: './indicator-form.component.html',
})
export class IndicatorFormComponent {
  constructor(
    private readonly config: DynamicDialogConfig,
    @Inject(DOCUMENT) private document: Document
  ) {}
  public supports: ISupport[] = [];

  public ngOnInit(): void {
    if (this.config.data) {
      this.loadTable(this.config.data);
    }
  }

  private loadTable(supports: ISupport[]): void {
    this.supports = supports;
  }

  getSupportHistoryUrl(reclaim: string): string {
    return `${this.document.baseURI}cnet/support/history?s=${reclaim}`;
  }
}
