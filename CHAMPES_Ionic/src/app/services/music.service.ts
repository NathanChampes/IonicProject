import { Injectable } from '@angular/core';
import { Music } from '../models/music.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private dbPath = '/music';
  private musicCollection: AngularFirestoreCollection<Music>;

  constructor(
    private firestore: AngularFirestore, 
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth
  ) {
    this.musicCollection = this.firestore.collection<Music>(this.dbPath);
  }

  getMusic(): Observable<Music[]> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection<Music>(this.dbPath, ref => ref.where('userId', '==', user.uid)).snapshotChanges().pipe(
            map(actions =>
              actions.map(a => {
                const data = a.payload.doc.data() as Music;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
        } else {
          return [];
        }
      })
    );
  }

  getMusicById(id: string): Observable<Music> {
    return new Observable((obs) => {
      this.musicCollection
        .doc(id)
        .get()
        .subscribe((snapshot) => {
          if (snapshot.exists) {
            obs.next({ id: snapshot.id, ...snapshot.data() } as Music);
            obs.complete();
          } else {
            obs.error('No music found with this ID');
          }
        });
    });
  }

  saveNewMusic(music: Music): Observable<void> {
    return new Observable((obs) => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          music.userId = user.uid;
          this.musicCollection
            .add({ ...music })
            .then(() => {
              obs.next();
              obs.complete();
            })
            .catch((error) => obs.error(error));
        } else {
          obs.error('User not authenticated');
        }
      });
    });
  }

  updateMusic(id: string, data: Partial<Music>): Observable<void> {
    return new Observable((obs) => {
      this.musicCollection
        .doc(id)
        .update(data)
        .then(() => {
          obs.next();
          obs.complete();
        })
        .catch((error) => obs.error(error));
    });
  }

  deleteMusic(id: string): Observable<void> {
    return new Observable((obs) => {
      this.musicCollection
        .doc(id)
        .delete()
        .then(() => {
          obs.next();
          obs.complete();
        })
        .catch((error) => obs.error(error));
    });
  }
}