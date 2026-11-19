import { Pipe, PipeTransform } from '@angular/core';

/** Shortens text to `limit` characters and appends an ellipsis. */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 40, suffix: string = '…'): string {
    if (!value || value.length <= limit) {
      return value;
    }
    return value.substring(0, limit).trim() + suffix;
  }
}
