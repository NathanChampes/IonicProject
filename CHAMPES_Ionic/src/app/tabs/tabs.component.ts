import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  navigateToAccount() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['/account']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}