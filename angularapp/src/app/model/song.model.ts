// song.model.ts

export interface Song {
    id?: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    releaseDate: string;
    duration: number; // in seconds
  }