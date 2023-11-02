import { Pipe } from '@angular/core';

@Pipe({
  name: 'null',
})
export class NullPipe {
  transform(value: any, ...args: any[]): any {
    return value === null || value === undefined || value === ''
      ? 'N/A'
      : value;
  }
}
