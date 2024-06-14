import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filter',
})
export class FilterPipe  implements PipeTransform {
  transform(array: Array<Object>, filterKey: string, filterValue: string): any[] {
    console.log('filter pipe start', array, filterKey, filterValue);
    if (filterValue === 'Not selected') {
      return array;
    } else {
      return this.recursiveFilter(array, filterKey, filterValue);
    }
  }

  recursiveFilter(array: Array<any>, filterKey: string, filterValue: string): any[] {
    return array.filter(item => {
      if (item[filterKey] === filterValue) {
        return true;
      } else if (typeof item[filterKey] === 'object') {
        return Object.values(item[filterKey]).some((subItem: any) => this.recursiveFilter(subItem, filterKey, filterValue));
      } else if (Array.isArray(item)) {
        return item.some(subItem => this.recursiveFilter(subItem, filterKey, filterValue));
      } else {
        return false;
      }
    });
  }
}
