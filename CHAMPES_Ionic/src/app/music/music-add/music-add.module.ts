import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicAddPageRoutingModule } from './music-add-routing.module';

import { MusicAddPage } from './music-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicAddPageRoutingModule
  ],
  declarations: []
})
export class MusicAddPageModule {}
