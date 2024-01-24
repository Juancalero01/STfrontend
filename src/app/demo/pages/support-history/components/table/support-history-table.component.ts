import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { SupportHistoryFormComponent } from '../form/support-history-form.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-support-history-table',
  templateUrl: './support-history-table.component.html',
})
export class SupportHistoryTableComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  public supports: ISupport[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();
  public reclaim!: string;
  public showFilters: boolean = true;
  public historyForm: FormGroup = this.buildForm();

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.reclaim = params.get('s') || '';
    });

    if (this.reclaim) {
      this.showFilters = false;
      this.searchReclaimService(this.reclaim);
    }
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      reclaim: [null],
      serial: [null],
    });
  }

  public loadSupports(): void {
    this.supportService.findAll().subscribe({
      next: (supports: ISupport[]) => {
        this.supports = supports;
      },
    });
  }

  public cleanFilters(table: Table, filter: any): void {
    table.clear();
    filter.value = '';
  }

  public openSupportHistoryForm(support?: ISupport): void {
    this.ref = this.dialogService.open(SupportHistoryFormComponent, {
      header: `INFORMACIÓN DEL SERVICIO`,
      width: '80%',
      height: '80%',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      maximizable: true,
      position: 'center',
      data: support,
    });
  }

  public getTagSeverity(stateId: number): string {
    if (stateId === 12) {
      return 'success';
    } else {
      return 'warning';
    }
  }

  public searchHistory() {
    //Testeo con reclaim
    // this.searchReclaimService(this.historyForm.get('reclaim')?.value);
    this.searchSerialProduct(this.historyForm.get('serial')?.value);
  }

  private getDataForm(): void {
    return this.historyForm.getRawValue();
  }

  public searchReclaimService(reclaim: string): void {
    this.supportService.getServiceByReclaim(reclaim).subscribe({
      next: (supports: ISupport[]) => {
        this.supports = supports;
      },
    });
  }

  public searchSerialProduct(serial: string): void {
    this.supportService.getServicesByProductSerial(serial).subscribe({
      next: (supports: ISupport[]) => {
        this.supports = supports;
      },
    });
  }
}
