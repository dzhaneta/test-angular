import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaginationComponent } from "./pagination.component";
import { CommonModule } from "@angular/common";

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let componentEl: HTMLElement;
  let fixture: ComponentFixture<PaginationComponent>;

  const testCases = [
    {total: 10, limit: 3, pages: [1, 2, 3, 4]},
    {total: 10, limit: 5, pages: [1, 2]},
    {total: 10, limit: 10, pages: [1]},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [PaginationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  describe('rangePages method', () => {

    it('should generate 4 pages when items = 10 & perPage = 3', () => {
      component.total = testCases[0].total;
      component.limit = testCases[0].limit;
      component.ngOnChanges();
      expect(component.pages).toEqual(testCases[0].pages);
    });

    it('should generate 2 pages when items = 10 & perPage = 5', () => {
      component.total = testCases[1].total;
      component.limit = testCases[1].limit;
      component.ngOnChanges();
      expect(component.pages).toEqual(testCases[1].pages);
    });

    it('should generate 1 page when items = 10 & perPage = 10', () => {
      component.total = testCases[2].total;
      component.limit = testCases[2].limit;
      component.ngOnChanges();
      expect(component.pages).toEqual(testCases[2].pages);
    });
  });

  it('should render pages list correctly', () => {
    component.total = testCases[0].total;
    component.limit = testCases[0].limit;
    component.ngOnChanges();

    fixture.detectChanges();
    componentEl = fixture.debugElement.nativeElement;
    const pagesEls = componentEl.querySelectorAll('li');
    expect(pagesEls.length).toEqual(component.pages.length);

    pagesEls.forEach((pageEl, index) => {
      const spanEl = pageEl.querySelector('span');
      if (spanEl) {
        expect(spanEl.textContent).toEqual(component.pages[index].toString());
      } else {
        fail(`span element not found in page ${component.pages[index]}`);
      }
    });
  });

  it('should apply active class to current page', () => {
    component.total = testCases[0].total;
    component.limit = testCases[0].limit;
    component.currentPage = 2;
    component.ngOnChanges();

    fixture.detectChanges();
    componentEl = fixture.debugElement.nativeElement;
    const activePageEl = componentEl.querySelector('.page-item.active span');

    if (activePageEl) {
      expect(activePageEl.textContent).toEqual(component.currentPage.toString());
    } else {
      fail('active page element not found');
    }
  });

  it('should emit correct page number on page click', () => {
    component.total = testCases[0].total;
    component.limit = testCases[0].limit;
    component.ngOnChanges();
    fixture.detectChanges();

    const changePageSpy = jest.spyOn(component.changePage, 'emit');
    componentEl = fixture.debugElement.nativeElement;
    const clickedPageEl = componentEl.querySelectorAll('li')[1];
    clickedPageEl.click();
    expect(changePageSpy).toHaveBeenCalledWith(2);
  });

});
