import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Album } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  animations: [
    trigger('played', [
      state('on', style({ backgroundColor: 'rgb(246, 243, 211)' })),
      state('off', style({ backgroundColor: 'white' })),
      transition('on => off', animate('250ms')),
      transition('off => on', animate('250ms')),
    ])
  ]
})
export class AlbumsComponent implements OnInit {

  titlePage: string;
  albums: Album[];
  albumSelected: Album;
  currentPage: number;

  constructor(private albumService: AlbumService) {
    this.titlePage = "Albums";
    this.currentPage = 1;
  }

  ngOnInit(): void {
    this.albums = this.albumService.getAlbums();
    this.albumSelected = this.albums[0];
  }

  onSelectAlbum(album: Album): void {
    if (this.albumSelected) this.albumService.switchOff(this.albumSelected);
    this.albumSelected = album;
  }

  onPlayAlbum(album: Album): void {
    if(album.status === 'on') {
      this.albumService.switchOff(album);
    } else {
      this.albumService.switchOn(album);
    }
  }

  onSearchAlbum(albums: Album[]): void {
    this.albums = albums;
    this.switchPage(1);
  }

  switchPage(page: number): void {
    this.currentPage = page;
  }

}
