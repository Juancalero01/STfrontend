import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { SupportHistoryFormComponent } from '../form/support-history-form.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-support-history-table',
  templateUrl: './support-history-table.component.html',
})
export class SupportHistoryTableComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly messageService: MessageService
  ) {}

  public supports: ISupport[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();
  public reclaim!: string;
  public showFilters: boolean = true;
  public showSearch: boolean = false;
  public showCleanFilters: boolean = false;

  public historyForm: FormGroup = this.buildForm();

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.reclaim = params.get('s') || '';
    });

    if (this.reclaim) {
      this.searchReclaimService(this.reclaim);
      this.showFilters = false;
      this.showSearch = true;
    }

    this.historyForm.valueChanges.subscribe({
      next: ({ reclaim, serial }) => {
        const reclaimControl = this.historyForm.get('reclaim');
        const serialControl = this.historyForm.get('serial');
        if (reclaim && reclaim.trim() !== '') {
          if (serialControl?.enabled) {
            serialControl?.disable({ emitEvent: false });
            serialControl.removeValidators(Validators.required);
            serialControl.updateValueAndValidity();
          }
        } else {
          if (serialControl?.disabled) {
            serialControl?.enable({ emitEvent: false });
            serialControl.addValidators(Validators.required);
            serialControl.updateValueAndValidity();
          }
        }
        if (serial && serial.trim() !== '') {
          if (reclaimControl?.enabled) {
            reclaimControl?.disable({ emitEvent: false });
            reclaimControl.removeValidators(Validators.required);
            reclaimControl.updateValueAndValidity();
          }
        } else {
          if (reclaimControl?.disabled) {
            reclaimControl?.enable({ emitEvent: false });
            reclaimControl.addValidators(Validators.required);
            reclaimControl.updateValueAndValidity();
          }
        }
      },
    });
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      reclaim: [
        null,
        [Validators.required, Validators.pattern(/^CNET-\d{8}-\d+$/)],
      ],
      serial: [
        null,
        [Validators.required, Validators.pattern(/^\d{1,4}(-\d{4,5})?$/)],
      ],
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
    const reclaimValue = this.historyForm.get('reclaim')?.value;
    const serialValue = this.historyForm.get('serial')?.value;
    if (reclaimValue && reclaimValue.trim() !== '') {
      this.searchReclaimService(reclaimValue);
    } else if (serialValue && serialValue.trim() !== '') {
      this.searchSerialProduct(serialValue);
    }
    this.showSearch = true;
    this.showCleanFilters = true;
  }

  public searchReclaimService(reclaim: string): void {
    this.supportService.getServiceByReclaim(reclaim).subscribe({
      next: (supports: ISupport[]) => {
        if (supports.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Operación',
            detail: 'Sin resultados',
          });
        }
        this.supports = supports;
      },
    });
  }

  public searchSerialProduct(serial: string): void {
    this.supportService.getServicesByProductSerial(serial).subscribe({
      next: (supports: ISupport[]) => {
        if (supports.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Operación',
            detail: 'Sin resultados',
          });
          this.showSearch = false;
        }
        this.supports = supports;
      },
    });
  }

  public getChangesToUpdate(): boolean {
    return !this.historyForm.pristine;
  }

  public cleanFormAndSearch() {
    this.historyForm.reset();
    this.messageService.add({
      severity: 'info',
      summary: 'Operación',
      detail: 'Filtros reseteados',
    });
    this.showSearch = false;
    this.showCleanFilters = false;
  }
}
