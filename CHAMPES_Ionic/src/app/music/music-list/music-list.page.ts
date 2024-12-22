import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Music } from '../../models/music.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.page.html',
  styleUrls: ['./music-list.page.scss'],
})
export class MusicListPage implements OnInit {
  musicList: Music[] = [];
  editMode: boolean = false;
  selectedMusic?: Music;

  constructor(
    private musicService: MusicService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.loadMusicList();
      } else {
        this.showNotification('Merci de vous connecter', 'warning');
        this.router.navigate(['/login']);
      }
    });
  }

  loadMusicList() {
    this.musicService.getMusic().subscribe((music: Music[]) => {
      this.musicList = music;
    });
  }

  selectMusic(music: Music) { 
    this.selectedMusic = music;
    this.router.navigate(['/djset'], { queryParams: { id: music.id } }); 
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  editMusic(music: Music) {
    this.router.navigate(['/music/edit', music.id]);
  }

  deleteMusic(music: Music) {
    if(confirm('Êtes vous sur de vouloir supprimer cette musique ?') && music.id !== undefined) {
      this.musicService.deleteMusic(music.id.toString()).subscribe(() => {
        this.loadMusicList();
        if (this.selectedMusic && this.selectedMusic.id === music.id) {
          this.selectedMusic = undefined; 
        }
      });
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
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