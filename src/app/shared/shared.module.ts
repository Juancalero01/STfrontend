import { NgModule } from '@angular/core';
import { PrimengModule } from './primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NullPipe } from './utils/pipes/null.pipe';
import { ExcelService } from './utils/services/excel.service';
import { RouterModule } from '@angular/router';
import { BooleanPipe } from './utils/pipes/bool.pipe';

@NgModule({
  declarations: [NullPipe, BooleanPipe],
  imports: [PrimengModule, ReactiveFormsModule, FormsModule, RouterModule],
  exports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    NullPipe,
    BooleanPipe,
    RouterModule,
  ],
  providers: [ExcelService],
})
export class SharedModule {}
