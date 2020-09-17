import { Pipe, PipeTransform } from '@angular/core';
import { LocalizedLazyDataService } from '../../core/data/localized-lazy-data.service';
import { I18nNameLazy } from '../../model/common/i18n-name-lazy';

@Pipe({
  name: 'statusName',
})
export class StatusNamePipe implements PipeTransform {
  constructor(private readonly l12n: LocalizedLazyDataService) {}

  transform(id: number): I18nNameLazy {
    return this.l12n.getStatus(id);
  }
}
