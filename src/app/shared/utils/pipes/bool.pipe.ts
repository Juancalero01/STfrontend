import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bool',
})
export class BooleanPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'ACTIVO' : 'INACTIVO';
  }
}
