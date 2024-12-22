import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicEditPageRoutingModule } from './music-edit-routing.module';

import { MusicEditPage } from './music-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicEditPageRoutingModule
  ],
  declarations: []
})
export class MusicEditPageModule {}
