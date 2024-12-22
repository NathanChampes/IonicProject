import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicEditPage } from './music-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MusicEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicEditPageRoutingModule {}
