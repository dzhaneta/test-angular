import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() total: number = 0;
  @Input() limit: number = 0;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];

  ngOnChanges(): void {
    this.rangePages();
  }

  rangePages() {
    const pagesCount = Math.ceil(this.total / this.limit);
    this.pages = [...Array(pagesCount).keys()].map((el) => el + 1);
  }
}
