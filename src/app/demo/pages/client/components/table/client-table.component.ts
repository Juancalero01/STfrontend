import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientFormComponent } from '../form/client-form.component';
import { ClientService } from '../../../../api/services/client.service';
import { IClient } from '../../../../api/interfaces/client.interface';

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
})
export class ClientTableComponent {
  constructor(
    private readonly clientService: ClientService,
    private readonly dialogService: DialogService
  ) {}

  public clients: IClient[] = [];
  public dialogRef: DynamicDialogRef = new DynamicDialogRef();

  ngOnInit(): void {
    this.getClients();
  }

  /**
   * Carga los clientes desde el servicio de clientes y los asigna a la propiedad 'clients' para su visualización en la tabla.
   */
  private getClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => {
        this.clients = clients;
      },
    });
  }

  /**
   * Abre un formulario para guardar o actualizar la información de un cliente.
   * @param clientData Datos del cliente a editar. Si no se proporciona, se abre un formulario para registrar un nuevo cliente.
   */
  public openClientDialog(clientData?: IClient) {
    const header = clientData ? 'ACTUALIZAR CLIENTE' : 'REGISTRAR CLIENTE';

    this.dialogRef = this.dialogService.open(ClientFormComponent, {
      header: header,
      width: '80%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: clientData,
    });

    this.dialogRef.onClose.subscribe(() => {
      this.getClients();
    });
  }

  /**
   * Elimina los filtros de búsqueda o paginación en una tabla.
   * @param table La tabla (Table) de PrimeNG de la que se eliminarán los filtros.
   * @param filter El filtro de búsqueda o paginación que se reiniciará.
   */
  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
