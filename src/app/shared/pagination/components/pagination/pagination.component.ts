import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currentPage: number = 1;
  @Input() total: number = 0;
  @Input() limit: number = 0;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];
  private updateSubject = new Subject<void>();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.updateSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const pagesCount = Math.ceil(this.total / this.limit);
        this.pages = this.range(1, pagesCount);
      });

    this.updateSubject.next();
  }

  ngOnChanges(): void {
    this.updateSubject.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start);
  }
}
