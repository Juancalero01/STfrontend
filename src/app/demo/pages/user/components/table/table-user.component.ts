import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { IUser } from 'src/app/demo/api/interfaces/user.interface';
import { UserService } from 'src/app/demo/api/services/user.service';
import { UserFormComponent } from '../form/user-form.component';
import { TokenService } from 'src/app/demo/api/services/token.service';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
})
export class TableUserComponent {
  constructor(
    private readonly userService: UserService,
    private readonly dialogService: DialogService,
    private readonly tokenService: TokenService
  ) {}

  public users: IUser[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  ngOnInit() {
    this.getUsers();
  }

  /**
   * Carga los usuarios desde el servicio de usuarios y los asigna a la propiedad 'users' para su visualización en la tabla.
   */
  private getUsers(): void {
    this.userService.findAll().subscribe({
      next: (users: IUser[]) => {
        this.users = users;
      },
    });
  }

  /**
   * Abre un formulario para guardar o actualizar la información de un usuario.
   * @param clientData Datos del usuario a editar. Si no se proporciona, se abre un formulario para registrar un nuevo usuario.
   */
  public openUserForm(userData?: IUser): void {
    const header = userData ? 'ACTUALIZAR USUARIO' : 'REGISTRAR USUARIO';

    this.ref = this.dialogService.open(UserFormComponent, {
      header: header,
      width: '60%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: userData,
    });
    this.ref.onClose.subscribe(() => {
      this.getUsers();
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

  /**
   * Determina si el botón debe estar desactivado según el usuario actual y el usuario proporcionado.
   * @param user El usuario para el cual se evalúa si el botón debe estar desactivado.
   * @returns Verdadero si el botón debe estar desactivado; falso en caso contrario.
   */
  public isDisabledButton(user: IUser): boolean {
    const currentUserId = this.tokenService.getUserId();
    const currentUsername = this.tokenService.getUserFullname();

    return this.tokenService.isAdmin()
      ? (currentUsername === 'CONTROLNET' && currentUserId === `${user.id}`) ||
          (currentUsername !== 'CONTROLNET' &&
            user.role.name === 'ADMINISTRADOR')
      : true;
  }
}
