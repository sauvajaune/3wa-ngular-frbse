import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-description',
  templateUrl: './album-description.component.html',
  styleUrls: ['./album-description.component.scss']
})
export class AlbumDescriptionComponent implements OnInit {

  titlePage: string;
  album: Album;

  constructor(private route: ActivatedRoute, private albumService: AlbumService) {
    this.titlePage = "Album";
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.album = this.albumService.getAlbum(id);
  }

}
