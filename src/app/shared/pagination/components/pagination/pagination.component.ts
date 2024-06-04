import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Input() currentPage: number = 1;
  @Input() total: number = 0;
  @Input() limit: number = 0;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];
  private updateSubject = new Subject<void>();

  ngOnInit(): void {
    this.updateSubject
      .subscribe(() => {
      console.log('pagin new total', this.total);
      console.log('pagin new limit', this.limit);
      const pagesCount = Math.ceil(this.total / this.limit);
      this.pages = this.range(1, pagesCount);
      console.log('pages', this.pages);
    });

    this.updateSubject.next();
  }

  ngOnChanges(): void {
    this.updateSubject.next();
  }

  ngOnDestroy(): void {
    this.updateSubject.unsubscribe();
  }

  range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start);
  }
}
