import { Injectable, inject } from '@angular/core';
import { collection, Firestore, doc, documentId, onSnapshot, DocumentData, addDoc, updateDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  firestore: Firestore = inject(Firestore);

  private gameSubject = new BehaviorSubject<Game | null>(null);
  game$ = this.gameSubject.asObservable();

  constructor() { 
  }

  async addGame(game: Game) {
    await addDoc(this.getColRef(), game);
  }

  snapshotCurrentGame(docId: string) {
    return onSnapshot(this.getDocRef(docId), game => {
        console.log('Snapshot updated: ', game.data());
        const updatedGame = this.setGameObjectWithId(game.data(), docId);
        this.gameSubject.next(updatedGame);
    });
  }

  getColRef() {
    return collection(this.firestore, 'games');
  }

  getDocRef(docId: string) {
    return doc(this.firestore, 'games', docId);
  }

  setGameObjectWithId(game: any, gameId: string): Game {
    return {
      id: gameId,
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer
    }
  }

  async updateDoc(game: Game, gameId: string) {
    if (gameId != undefined) {
      const docRef = this.getDocRef(gameId);    
      await updateDoc(docRef, this.getGameObjectWithoutId(game));
    }
  }

  getGameObjectWithoutId(game: Game) {
    return {
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer
    }
  }

  // TODO unsubscribe
  // TODO error handling
}
