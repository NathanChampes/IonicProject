import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import { ActivatedRoute } from '@angular/router';
import { Music } from '../models/music.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Device } from '@capacitor/device';

@Component({
  selector: 'dj-set',
  templateUrl: 'djset.page.html',
  styleUrls: ['djset.page.scss'],
})
export class DJSETPage {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  source!: MediaElementAudioSourceNode;
  isPlaying: boolean = false;
  backgroundColor: string = 'white';
  
  selectedMusic?: Music;

  audioElement!: HTMLAudioElement;

  currentTime: number = 0;
  intervalId: any;

  isNew : boolean = true;
  isMobile: boolean = false;

  lastFlashTime: number = 0;
  flashCooldown: number = 100; // Minimum delay between flashes in milliseconds

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.route.queryParams.subscribe(params => {
      const musicId = params['id']; 
      if (musicId) {
        this.loadMusicDetails(musicId); 
      }
    });

    this.checkDevice();
  }

  async checkDevice() {
    const info = await Device.getInfo();
    this.isMobile = info.platform === 'ios' || info.platform === 'android';
  }

  loadMusicDetails(id: string) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.firestore.collection('music').doc(id).get().subscribe(snapshot => {
          this.isNew = true;
          if (snapshot.exists) {
            const musicData = snapshot.data() as Music;
            if (musicData.userId === user.uid) {
              this.selectedMusic = musicData;
            } else {
              console.error('Vous n\'êtes pas autorisé à accéder à cette musique.');
            }
          } else {
            console.error('Aucune chanson trouvée avec cet ID.');
          }
        });
      } else {
        console.error('Utilisateur non connecté.');
      }
    });
  }

  playSelectedMusic() {
    if (this.selectedMusic && this.selectedMusic.audioUrl) {
      this.resetAudioElement();
      this.isNew = false;
      this.audioElement = new Audio(this.selectedMusic.audioUrl);
      this.audioElement.crossOrigin = 'anonymous';
      const source = this.audioContext.createMediaElementSource(this.audioElement);
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.audioContext.resume().then(() => {
        this.audioElement.play()
          .then(() => {
            console.log('Lecture de la musique sélectionnée...' + this.selectedMusic?.title);
            this.isPlaying = true;
            this.visualizeMusic();
            if (this.isMobile) {
              this.flashWithMusic();
            }
            this.startTimer(this.audioElement);
          })
          .catch(err => {
            console.error('Erreur lors de la lecture audio :', err);
          });
      });
    } else {
      console.error('URL audio introuvable pour la musique sélectionnée.');
    }
  }

  resetAudioElement() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.src = '';
      this.isPlaying = false;
      clearInterval(this.intervalId);
    }
  }

  visualizeMusic() {
    if (!this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.dataArray);

    const energy = this.dataArray.reduce((a, b) => a + b, 0);
    const normalizedEnergy = Math.min(energy / (this.dataArray.length * 256), 1);

    const hue = Math.floor(normalizedEnergy * 360);
    this.backgroundColor = `hsl(${hue}, 100%, 50%)`;

    requestAnimationFrame(() => this.visualizeMusic());
  }

  flashWithMusic() {
    if (!this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    const average = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;
    const variance = this.dataArray.reduce((a, b) => a + Math.pow(b - average, 2), 0) / this.dataArray.length;
    const intensity = Math.min((average + variance) / 512, 1);

    const currentTime = performance.now();
    if (currentTime - this.lastFlashTime < this.flashCooldown) {
      requestAnimationFrame(() => this.flashWithMusic());
      return;
    }

    if (intensity > 0.5) {
      CapacitorFlash.switchOn({intensity:1});
      setTimeout(() => CapacitorFlash.switchOff(), 100);
      this.lastFlashTime = currentTime;
    } else if (intensity > 0.3) {
      CapacitorFlash.switchOn({intensity:1});
      setTimeout(() => CapacitorFlash.switchOff(), 200);
      this.lastFlashTime = currentTime;
    } else if (intensity > 0.1) {
      CapacitorFlash.switchOn({intensity:1});
      setTimeout(() => CapacitorFlash.switchOff(), 300);
      this.lastFlashTime = currentTime;
    } else {
      CapacitorFlash.switchOff();
    }

    requestAnimationFrame(() => this.flashWithMusic());
  }

  pauseMusic() {
    this.audioContext.suspend().then(() => {
      this.isPlaying = false;
      clearInterval(this.intervalId);
    });
  }

  resumeMusic() {
    this.audioContext.resume().then(() => {
      this.audioElement.play()
        .then(() => {
          this.isPlaying = true;
          this.visualizeMusic();
          if (this.isMobile) {
            this.flashWithMusic();
          }
          this.startTimer(this.audioElement);
        })
        .catch(err => {
          console.error('Erreur lors de la reprise audio :', err);
        });
    });
  }

  startTimer(audio: HTMLAudioElement) {
    this.intervalId = setInterval(() => {
      this.currentTime = audio.currentTime;
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}