import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DJSETPageRoutingModule } from './djset-routing.module';

import { DJSETPage } from './djset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DJSETPageRoutingModule
  ],
  declarations: [DJSETPage]
})
export class DJSETPageModule {}
