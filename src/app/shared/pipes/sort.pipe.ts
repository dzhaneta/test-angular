import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'sort'
})
export class ArraySortPipe  implements PipeTransform {
  transform(array: Array<Object>, sortField: string, sortOrder: 'asc' | 'desc'): any[] {
    console.log('sort pipe start');
    const newArr = this.recursiveSort(array, sortField, sortOrder);
    console.log('sort pipe end', newArr);
    return newArr;
  }

  recursiveSort(array: Array<any>, sortField: string, sortOrder: 'asc' | 'desc'): any[] {
    return array.sort((a: any, b: any) => {
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
  }
}
