import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserFormComponent } from './components/form/user-form.component';
import { TableUserComponent } from './components/table/table-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    UserComponent,
    UserFormComponent,
    TableUserComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
