import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'pagination',
})
export class PaginationPipe  implements PipeTransform {
  transform(data: Array<any>, currentPage: number, itemsPerPage: number): any[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

}
