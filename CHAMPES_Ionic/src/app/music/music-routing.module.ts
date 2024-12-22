import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicListPage } from './music-list/music-list.page';
import { MusicAddPage } from './music-add/music-add.page';
import { MusicEditPage } from './music-edit/music-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MusicListPage
  },
  {
    path: 'add',
    component: MusicAddPage
  },
  {
    path: 'edit/:id',
    component: MusicEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicPageRoutingModule {}
