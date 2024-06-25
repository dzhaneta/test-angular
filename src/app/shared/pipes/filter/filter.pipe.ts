import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filter',
})
export class FilterPipe  implements PipeTransform {
  transform(array: Array<Object>, filterKey: string, filterValue: string): any[] {
    if (filterValue === 'Not selected') {
      return array;
    } else {
      return this.recursiveFilter(array, filterKey, filterValue);
    }
  }

  recursiveFilter(array: Array<any>, filterKey: string, filterValue: string): any[] {
    return array.filter(item => {

      if (item.hasOwnProperty(filterKey) && item[filterKey].toString() === filterValue) {
        return true;
      }

      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const value = item[key];

          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              for (const arrayItem of value) {
                if (this.recursiveFilter([arrayItem], filterKey, filterValue).length > 0) {
                  return true;
                }
              }
            } else if (this.recursiveFilter([value], filterKey, filterValue).length > 0) {
              return true;
            }
          }
        }
      }

      return false;
    });
  }

}
