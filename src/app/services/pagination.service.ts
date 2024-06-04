import { Injectable } from '@angular/core';

@Injectable()
export class PaginationService {
  paginateData(data: any[], currentPage: number, itemsPerPage: number): any[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }
}
