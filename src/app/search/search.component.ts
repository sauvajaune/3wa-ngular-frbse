import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Album } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  isSubmit: boolean;
  keywords: string;
  searchResult: Album[];
  @Output() searchEvent: EventEmitter<Album[]>;

  constructor(private albumService: AlbumService) {
    this.isSubmit = false;
    this.keywords = '';
    this.searchResult = [];
    this.searchEvent = new EventEmitter();
  }

  onSubmit(form: NgForm): void {
    this.isSubmit = true;
    this.keywords = form.value['keywords'];
    this.searchResult = this.albumService.search(this.keywords);
    this.searchEvent.emit(this.searchResult);
  }

  clearSearch(): void {
    this.isSubmit = false;
    this.keywords = '';
    this.searchEvent.emit(this.albumService.getAlbums());
  }

}
