export class Music {
  id?: string; 
  title: string;
  artist: string;
  album: string;
  duration: number; 
  genre: string;
  year: number;
  trackNumber: number;
  coverArtUrl: string;
  audioUrl?: string;
  userId?: string; 

  constructor(
    title: string,
    artist: string,
    album: string,
    duration: number,
    genre: string,
    year: number,
    trackNumber: number,
    coverArtUrl: string,
    audioUrl?: string,
    userId?: string, 
    id?: string 
  ) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.duration = duration;
    this.genre = genre;
    this.year = year;
    this.trackNumber = trackNumber;
    this.coverArtUrl = coverArtUrl;
    if (audioUrl) {
      this.audioUrl = audioUrl;
    }
    if (userId) {
      this.userId = userId;
    }
    if (id) {
      this.id = id;
    }
  }
}