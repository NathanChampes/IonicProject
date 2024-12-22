import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DJSETPage } from './djset.page';

const routes: Routes = [
  {
    path: '',
    component: DJSETPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DJSETPageRoutingModule {}
