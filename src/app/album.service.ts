import { Injectable } from '@angular/core';
import { Album } from './album';
import { AlbumList } from './albumList';
import { ALBUMS, ALBUM_LISTS } from './mock-albums';
import { sortBy } from 'sort-by-typescript';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  subjectAlbum: Subject<Album>;
  subjectTrack: Subject<Album>;
  private _albums: Album[];
  private _albumLists: AlbumList[];

  constructor() {
    this.subjectAlbum = new Subject<Album>();
    this.subjectTrack = new Subject<Album>();
    this._albums = ALBUMS;
    this._albumLists = ALBUM_LISTS;
  }

  count(): number {
    return this._albums.length;
  }

  getAlbums(): Album[] {
    // return this._albums.sort((a, b) => { return b.duration - a.duration }); // ORDER BY duration DESC
    return this._albums.sort(sortBy('-duration'));
  }

  getAlbum(id: string): Album {
    return this._albums.find(album => album.id === id);
  }

  getAlbumList(id: string): AlbumList {
    return this._albumLists.find(albumlist => albumlist.id === id);
  }

  search(input: string): Album[] {
    let keywords: string[] = this.parseGoogleSearch(input);
    let albums: Album[] = [];
    this.getAlbums().forEach(album => {
      keywords.forEach(keyword => {
        if (album.name.toLowerCase().includes(keyword)) {
          if (!albums.includes(album)) albums.push(album);
        }
      });
    });
    return albums;
  }

  parseSearch(input: string): string[] {
    return input
      .replace(new RegExp(',,,','g'), ',')
      .replace(new RegExp(',,','g'),  ',')
      .replace(new RegExp(', ','g'),  ',')
      .replace(new RegExp(' ,','g'),  ',')
      .toLowerCase()
      .split(",")
    ;
  }

  parseGoogleSearch(input: string): string[] {
    let groups = input.match(new RegExp('"(.*?)"','gi'));
    if (groups) {
      groups.forEach(group => {
        input = input.replace(group, '');
      });
    }
    input = this._trim(input
      .replace(new RegExp('[.,:;"\']','g'), ' ')
      .toLowerCase()
    );
    let words = (input.length ? input.split(' ') : []);
    if(groups) {
      groups.forEach(group => {
        group = group.slice(1,-1).toLowerCase().trim();
        words.push(group);
      });
    }
    return words;
  }

  private _trim(string: string): string {
    return string.replace(new RegExp('   ','g'), ' ').replace(new RegExp('  ','g'), ' ').trim();
  }

  paginate(albums: Album[], page: number): Album[] {
    let i: number = this.getAlbumsPerPage() * (page - 1);
    let o: number = i + this.getAlbumsPerPage();
    return albums.slice(i, o);
  }

  getAlbumsPerPage(): number {
    if (typeof environment.albumsPerPage == 'undefined') throw "Albums paginate is undefined";
    return environment.albumsPerPage;
  }

  switchOn(album: Album): void {
    album.status = 'on';
    this.subjectAlbum.next(album);
  }

  switchOff(album: Album): void {
    album.status = 'off';
    this.subjectAlbum.next(album);
  }

  selectTrackToPlay(album: Album, trackId: number): void {
    album.currentTrackPlayed = trackId;
    this.subjectTrack.next(album);
  }

}
