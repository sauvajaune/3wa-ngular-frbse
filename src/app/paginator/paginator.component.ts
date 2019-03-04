import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  protected _pages: number;      // Number of pages
  @Input() items: number;        // Number of items
  @Input() itemsPerPage: number; // Number of items per page
  @Input() currentPage: number;  // Number of current page
  @Output() switchPage: EventEmitter<number>;

  constructor() {
    this.switchPage = new EventEmitter();
  }

  ngOnChanges(): void {
    this._pages = Math.ceil(this.items / this.itemsPerPage);
  }

  next(): void {
    if(this.currentPage < this._pages) this.goto(this.currentPage + 1);
  }

  prev(): void {
    if(this.currentPage > 1) this.goto(this.currentPage - 1);
  }

  first(): void {
    this.goto(1);
  }

  last(): void {
    this.goto(this._pages);
  }

  goto(page: number): void {
    this.switchPage.emit(page);
  }

  counter(i: number): number[] {
    return new Array(i);
  }

}
