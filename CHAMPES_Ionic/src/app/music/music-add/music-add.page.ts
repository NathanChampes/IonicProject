import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Music } from '../../models/music.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { parseBlob } from 'music-metadata-browser';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-music-add',
  templateUrl: './music-add.page.html',
  styleUrls: ['./music-add.page.scss'],
})
export class MusicAddPage implements OnInit {
  music: Music = new Music('', '', '', 0, '', 0, 0, '');
  file: File | null = null;
  uploadProgress: number = 0;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private musicService: MusicService,
    private router: Router,
    private toastController: ToastController 
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.showNotification('Merci de vous connecter', 'warning');
        this.router.navigate(['/login']);
      }
    });
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.extractMetadata(this.file);
    }
  }

  async extractMetadata(file: File) {
    try {
      const metadata = await parseBlob(file);
      const common = metadata.common;
      const format = metadata.format;

      this.music.title = common.title || '';
      this.music.artist = common.artist || '';
      this.music.album = common.album || '';
      this.music.duration = Math.floor(format.duration || 0);
      this.music.genre = common.genre ? common.genre[0] : '';
      this.music.year = common.year || 0;
      this.music.trackNumber = common.track?.no || 0;

      if (common.picture && common.picture.length > 0) {
        this.music.coverArtUrl = this.createCoverArtUrl(common.picture[0]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'extraction des métadonnées :', error);
      this.showNotification('Erreur lors de l\'extraction des métadonnées', 'danger');
    }
  }

  createCoverArtUrl(picture: any): string {
    const base64String = picture.data.reduce((data: string, byte: number) => data + String.fromCharCode(byte), '');
    return `data:${picture.format};base64,${window.btoa(base64String)}`;
  }

  uploadFileAndSaveMetadata() {
    if (this.file) {
      const filePath = `music/${Date.now()}_${this.file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);
  
      task.percentageChanges().subscribe(progress => {
        this.uploadProgress = progress || 0;
      });
  
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.music.audioUrl = url; 
              this.saveMetadataToFirestore(this.music);
            });
          })
        )
        .subscribe();
    }
  }
  

  saveMetadataToFirestore(music: Music) {
    this.musicService.saveNewMusic(music).subscribe(() => {
      this.showNotification('Musique ajoutée avec succès !', 'success');
      this.router.navigate(['/music']); 
    }, error => {
      console.error('Erreur lors de l\'ajout des métadonnées :', error);
      this.showNotification('Erreur lors de l\'ajout des métadonnées', 'danger');
    });
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