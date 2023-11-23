import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { IUser } from 'src/app/demo/api/interfaces/user.interface';
import { UserService } from 'src/app/demo/api/services/user.service';
import { UserFormComponent } from '../form/user-form.component';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
})
export class TableUserComponent {
  constructor(
    private readonly userService: UserService,
    private readonly dialogService: DialogService
  ) {}

  public users: IUser[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit() {
    this.getUsers();
  }

  public ngDestroy() {
    this.ref ? this.ref.close() : null;
  }

  private getUsers(): void {
    this.userService.findAll().subscribe({
      next: (user: IUser[]) => (this.users = user),
    });
  }

  public openUserForm(user?: IUser): void {
    const header = user
      ? 'FORMULARIO DE ACTUALIZACIÓN DE USUARIO'
      : 'FORMULARIO DE REGISTRO DE USUARIO';

    this.ref = this.dialogService.open(UserFormComponent, {
      header: header,
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: user,
    });
    this.ref.onClose.subscribe(() => this.getUsers());
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
