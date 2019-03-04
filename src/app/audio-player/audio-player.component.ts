import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Album } from '../album';
import { AlbumList } from '../albumList';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {

  album: Album;
  albumList: AlbumList;
  currentTrack: number;
  timerAlbum: string;
  timerTrack: string;
  timePerTrack: number;
  ratioAlbum: number; // Size of album's progressbar (%)
  ratioTrack: number; // Size of track's progressbar (%)
  isShow: boolean;
  state: string; // State of player (play|pause|stop)

  private _timerEvent: Observable<number>;
  private _timerEventPipe: Observable<number>;
  private _timerListener: any;
  private _timerCurrentValue: number;

  constructor(private albumService: AlbumService) {
    this.isShow = false;
  }

  ngOnInit(): void {
    this.subscribeAlbumEvent();
    this.subscribeTrackEvent();
  }

  subscribeAlbumEvent(): void {
    this.albumService.subjectAlbum.subscribe(album => {
      this.album = album;
      this.albumList = this.albumService.getAlbumList(this.album.id);
      this.init();
      this.album.status === 'on' ? this.show() : this.hide();
    });
  }

  subscribeTrackEvent(): void {
    this.albumService.subjectTrack.subscribe(album => {
      if (album.currentTrackPlayed != this.currentTrack) {
        this.pause();
        this.currentTrack = this.album.currentTrackPlayed;
        this._timerCurrentValue = this.timePerTrack * (this.currentTrack - 1);
        this.ratioAlbum = Math.ceil(this._timerCurrentValue * 100 / this.album.duration);
        this.timerAlbum = this.formatTimeCode(this._timerCurrentValue) + ' / ' + this.formatTimeCode(this.album.duration);
        this.ratioTrack = 0;
        this.timerTrack = '00:00 / ' + this.formatTimeCode(this.timePerTrack);
        this.play();
      }
    });
  }

  show(): void {
    this.isShow = true;
    this.play();
  }

  hide(): void {
    this.isShow = false;
    if (this.state && this.state != 'stop') {
      this.stop(); // STOP only if already PLAY and if not already STOP
    }
  }

  init(): void {
    this._timerCurrentValue = 0;
    this.currentTrack = 1;
    this.timerAlbum = '00:00 / ' + this.formatTimeCode(this.album.duration);
    this.ratioAlbum = 0;
    this.timePerTrack = Math.ceil(this.album.duration / this.albumList.list.length);
    this.timerTrack = '00:00 / ' + this.formatTimeCode(this.timePerTrack);
    this.ratioTrack = 0;
  }

  play(): void {
    this.state = 'play';
    this._fakerStreaming();
  }

  pause(): void {
    this.state = 'pause';
    this._timerListener.unsubscribe();
  }

  stop(): void {
    this.state = 'stop';
    this._timerListener.unsubscribe();
    this.albumService.switchOff(this.album);
  }

  prev(): void {
    let prevTrack = this.currentTrack - 1;
    if (prevTrack > 0) this.albumService.selectTrackToPlay(this.album, prevTrack);
  }

  next(): void {
    let nextTrack = this.currentTrack + 1;
    if (nextTrack <= this.albumList.list.length) this.albumService.selectTrackToPlay(this.album, nextTrack);
  }

  pressButton(action: string): void {
    switch(action) {
      case 'play':
      case 'resume': this.play();  break;
      case 'pause':  this.pause(); break;
      case 'stop':   this.stop();  break;
      case 'prev':   this.prev();  break;
      case 'next':   this.next();  break;
    }
  }

  formatTimeCode(seconds: number): string {
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  }

  private _fakerStreaming():void {
    // Create a loop on each seconds
    this._timerEvent = Observable.create((observer: any) => {
      let count: number = 1;
      const interval = setInterval(() => {
        observer.next(count);
        count++;
      }, 1000);
      return () => { 
        this._timerCurrentValue += count - 1;
        clearInterval(interval)
      };
    });
    // Custom loop to resume reading
    this._timerEventPipe = this._timerEvent.pipe(
      map((count: number): number => { 
        return (this._timerCurrentValue ? this._timerCurrentValue + count : count);
      })
    );
    // Set data
    this._timerListener = this._timerEventPipe.subscribe((count: number) => {
      this.timerAlbum = this.formatTimeCode(count) + ' / ' + this.formatTimeCode(this.album.duration);
      this.ratioAlbum = Math.round(count * 100 / this.album.duration * 10) / 10;
      let tmp = this.currentTrack;
      this.currentTrack = Math.ceil(count / this.timePerTrack);
      if (!this.currentTrack) this.currentTrack = 1;
      if (this.currentTrack > this.albumList.list.length) this.stop();
      if (this.currentTrack != tmp) this.albumService.selectTrackToPlay(this.album, this.currentTrack);
      let countTrack = count - (this.timePerTrack * (this.currentTrack - 1));
      this.timerTrack = this.formatTimeCode(countTrack) + ' / ' + this.formatTimeCode(this.timePerTrack);
      this.ratioTrack = Math.round(countTrack * 100 / this.timePerTrack * 10) / 10;
    });
  }

}
