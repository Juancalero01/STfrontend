import { NgModule } from '@angular/core';
import { PrimengModule } from './primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NullPipe } from './utils/pipes/null.pipe';
import { ExcelService } from './utils/services/excel.service';
import { RouterModule } from '@angular/router';
import { BooleanPipe } from './utils/pipes/bool.pipe';
import { ActivePipe } from './utils/pipes/active.pipe';

@NgModule({
  declarations: [NullPipe, BooleanPipe, ActivePipe],
  imports: [PrimengModule, ReactiveFormsModule, FormsModule, RouterModule],
  exports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    NullPipe,
    BooleanPipe,
    ActivePipe,
    RouterModule,
  ],
  providers: [ExcelService],
})
export class SharedModule {}
