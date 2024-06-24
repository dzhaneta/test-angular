import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'sort'
})
export class ArraySortPipe  implements PipeTransform {
  transform(array: Array<Object>, sortField: string, sortOrder: 'asc' | 'desc'): any[] {
    return  this.recursiveSort(array, sortField, sortOrder);
  }

  recursiveSort(array: Array<any>, sortField: string, sortOrder: 'asc' | 'desc'): any[] {
    const newArr = array.sort((a: any, b: any) => {
        // default comparison
        if (sortOrder === 'asc') {
          return a[sortField] < b[sortField]
            ? -1
            : a[sortField] > b[sortField]
              ? 1
              : 0;
        } else {
          return a[sortField] > b[sortField]
            ? -1
            : a[sortField] < b[sortField]
              ? 1
              : 0;
        }
      }
    );

    return [...newArr];
  }
}
