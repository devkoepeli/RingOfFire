import { Injectable, inject } from '@angular/core';
import { collection, Firestore, doc, documentId, onSnapshot, DocumentData, addDoc, updateDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  firestore: Firestore = inject(Firestore);

  unsubGame;

  game!: Game

  constructor() { 
    this.unsubGame = this.snapshotGame();
  }

  async addGame(game: Game) {
    await addDoc(this.getColRef(), game);
  }

  snapshotGame() {
    return onSnapshot(this.getColRef(), games => {
      games.forEach(game => {
        this.game = this.setGameObjectWithId(game.data(), game.id);
        console.log('new Snapshot taken :', this.game);
      });
    })
  }

  getColRef() {
    return collection(this.firestore, 'games');
  }

  getDocRef(docId: string) {
    return doc(this.firestore, 'notes', docId);
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
