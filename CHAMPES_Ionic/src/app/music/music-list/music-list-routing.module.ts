import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicListPage } from './music-list.page';

const routes: Routes = [
  {
    path: '',
    component: MusicListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicListPageRoutingModule {}
