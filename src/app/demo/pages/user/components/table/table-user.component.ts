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

  //Inicializador de funciones.
  ngOnInit() {
    this.getUsers();
  }

  //Obtiene todos lo usuarios para visualizarlo en la tabla.
  private getUsers(): void {
    this.userService.findAll().subscribe({
      next: (users: IUser[]) => {
        this.users = users;
      },
    });
  }

  //Abre el formulario para registrar o actualizar el usuario
  public openUserForm(user?: IUser): void {
    const header = user
      ? 'FORMULARIO DE ACTUALIZACIÓN DE USUARIO'
      : 'FORMULARIO DE REGISTRO DE USUARIO';

    this.ref = this.dialogService.open(UserFormComponent, {
      header: header,
      width: '60%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: user,
    });
    this.ref.onClose.subscribe(() => {
      this.getUsers();
    });
  }

  //Elimina los filtros (Tabla(Paginación, Filtros de columna) Buscador)
  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }

  //Verifica para que solamente el superadmin pueda actualizar todo, y en otros roles pueden actualizar a oto rol.
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
