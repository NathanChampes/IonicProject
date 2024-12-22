import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'djset',
    loadChildren: () => import('./djset/djset.module').then(m => m.DJSETPageModule)
  },
  { path: 'music', loadChildren: () => import('./music/music.module').then(m => m.MusicPageModule), canActivate: [AuthGuard] },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  // {
  //   path: 'djset/:music',
  //   loadChildren: () => import('./djset/djset.module').then(m => m.DJSETPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: TabsComponent, 
        children: routes, 
      }], { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
