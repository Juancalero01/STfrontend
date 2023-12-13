import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'active',
})
export class ActivePipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'ACTIVO' : 'INACTIVO';
  }
}
