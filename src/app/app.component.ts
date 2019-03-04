import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string;
  currentDate: string;
  currentTime: string;

  constructor() {
    this.title = 'Deezer';
    this.currentDate = '--/--/----';
    this.currentTime = '00:00:00';
  }

  ngOnInit(): void {
    const loop: Observable<number> = interval(1000);
    const time: Observable<Date> = loop.pipe(
      map(() => {
        let date = new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris" });
        return new Date(date);
      })
    );
    time.subscribe((date: Date) => {
      this.currentDate = date.toLocaleString().substr(0,10);
      this.currentTime = date.toLocaleString().substr(13,20);
    });
  }
  
}
