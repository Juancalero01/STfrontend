import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientFormComponent } from '../form/client-form.component';
import { ClientService } from '../../../../api/services/client.service';
import { IClient } from '../../../../api/interfaces/client.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
})
export class ClientTableComponent {
  constructor(
    private readonly clientService: ClientService,
    private readonly dialogService: DialogService
  ) {}

  public clientData: IClient[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit(): void {
    this.loadClients();
  }

  public ngDestroy(): void {
    if (this.ref) this.ref.close();
  }

  private loadClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => {
        this.clientData = clients;
      },
      error: () => {},
      complete: () => {},
    });
  }

  public openClientForm(client?: IClient) {
    const header = client
      ? 'FORMULARIO DE ACTUALIZACIÓN DE CLIENTE'
      : 'FORMULARIO DE REGISTRO DE CLIENTE';

    this.ref = this.dialogService.open(ClientFormComponent, {
      header: header,
      width: '80%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: client,
    });

    this.ref.onClose.subscribe(() => {
      this.loadClients();
    });
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
