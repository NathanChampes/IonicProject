import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MusicListPage } from './music-list/music-list.page';
import { MusicAddPage } from './music-add/music-add.page';
import { MusicPageRoutingModule } from './music-routing.module';
import { MusicPage } from './music.page';
import { MusicEditPage } from './music-edit/music-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicPageRoutingModule
  ],
  declarations: [MusicListPage, MusicAddPage, MusicPage, MusicEditPage]
})
export class MusicPageModule {}
