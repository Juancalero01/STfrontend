import { NgModule } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { DataViewModule } from 'primeng/dataview';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { PasswordModule } from 'primeng/password';

@NgModule({
  imports: [
    ButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    DataViewModule,
    DynamicDialogModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    InputTextModule,
    KeyFilterModule,
    MenubarModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
    TableModule,
    ToastModule,
    TooltipModule,
    DividerModule,
    TabViewModule,
    TagModule,
    ChipModule,
    BadgeModule,
    PasswordModule,
  ],
  exports: [
    ButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    DataViewModule,
    DynamicDialogModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    InputTextModule,
    KeyFilterModule,
    MenubarModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
    TableModule,
    ToastModule,
    TooltipModule,
    DividerModule,
    TabViewModule,
    TagModule,
    ChipModule,
    BadgeModule,
    PasswordModule,
  ],
  providers: [ConfirmationService, DialogService, MessageService],
})
export class PrimengModule {}
