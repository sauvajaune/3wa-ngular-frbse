import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Album } from '../album';
import { AlbumList } from '../albumList';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent {

  albumList: AlbumList;
  trackSelected: number;
  @Input() album: Album;
  @Output() playAlbumEvent: EventEmitter<Album>;

  constructor(private albumService: AlbumService) {
    this.playAlbumEvent = new EventEmitter();
    this.albumService.subjectTrack.subscribe(album => {
      this.trackSelected = album.currentTrackPlayed;
    });
  }

  ngOnChanges(): void {
    if (this.album) {
      this.albumList = this.albumService.getAlbumList(this.album.id);
      this.trackSelected = (this.album.currentTrackPlayed ? this.album.currentTrackPlayed : 1);
    }
  }

  onPlayAlbum(album: Album): void {
    this.trackSelected = 1;
    this.playAlbumEvent.emit(album);
  }

  onSelectTrackToPlay(trackId: number): void {
    this.trackSelected = trackId;
    this.albumService.selectTrackToPlay(this.album, this.trackSelected);
  }

}
