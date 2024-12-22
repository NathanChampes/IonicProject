import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicService } from '../../services/music.service';
import { Music } from '../../models/music.model';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-music-edit',
  templateUrl: './music-edit.page.html',
  styleUrls: ['./music-edit.page.scss'],
})
export class MusicEditPage implements OnInit {
  music: Music = new Music('', '', '', 0, '', 0, 0, '');
  musicId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private router: Router,
    private toastController: ToastController,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.showNotification('Merci de vous connecter', 'warning');
        this.router.navigate(['/login']);
      } else {
        this.musicId = this.route.snapshot.paramMap.get('id');
        if (this.musicId) {
          this.loadMusicDetails(this.musicId);
        }
      }
    });
  }

  loadMusicDetails(id: string) {
    this.musicService.getMusicById(id).subscribe((music: Music) => {
      this.music = music;
    });
  }

  updateMusic() {
    if (this.musicId) {
      this.musicService.updateMusic(this.musicId, this.music).subscribe(() => {
        this.showNotification('Musique mise à jour avec succès !', 'success');
        this.router.navigate(['/music']);
      }, error => {
        console.error('Erreur lors de la mise à jour de la musique :', error);
        this.showNotification('Erreur lors de la mise à jour de la musique', 'danger');
      });
    }
  }

  async showNotification(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}