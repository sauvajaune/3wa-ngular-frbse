import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { AlbumDescriptionComponent } from './album-description/album-description.component';
import { SearchComponent } from './search/search.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { LoginComponent } from './login/login.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

const routes: Routes = [
  { path: 'albums', component: AlbumsComponent },
  { path: 'album/:id', component: AlbumDescriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/albums', pathMatch: 'full' },
  { path: '**', redirectTo: '/albums', pathMatch: 'full' } // 404 - Not Found
];

@NgModule({
  declarations: [
    AppComponent,
    AlbumsComponent,
    AlbumDetailsComponent,
    AlbumDescriptionComponent,
    SearchComponent,
    PaginatorComponent,
    LoginComponent,
    AudioPlayerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(routes, { enableTracing: false }) // Disabled route log in console
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
