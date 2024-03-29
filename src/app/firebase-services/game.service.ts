import { Injectable, inject } from '@angular/core';
import { collection, Firestore, doc, documentId, onSnapshot, DocumentData, addDoc, updateDoc, DocumentReference } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  firestore: Firestore = inject(Firestore);

  gameSubject = new BehaviorSubject<Game | null>(null);
  game$ = this.gameSubject.asObservable();

  constructor() { 
  }

  async addGame(game: Game): Promise<DocumentReference<DocumentData, DocumentData>> {
    return await addDoc(this.getColRef(), game);
  }

  snapshotCurrentGame(docId: string) {
    return onSnapshot(this.getDocRef(docId),
        (game) => {
        const updatedGame = this.setGameObjectWithId(game.data(), docId);
        this.gameSubject.next(updatedGame);
    }, (error) => {
        alert('Current Error in saving the game status, other players may not see the current game status');
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
      currentPlayer: game.currentPlayer,
      pickCardAnimation: game.pickCardAnimation,
      currentCard: game.currentCard
    }
  }

  async updateDoc(game: Game, gameId: string) {
    if (gameId != undefined) {
      try {
        const docRef = this.getDocRef(gameId);    
        await updateDoc(docRef, this.getGameObjectWithoutId(game));
      } catch(e) {
        console.error('Current game status could not have been saved in the server: ', e);
      }
    }
  }

  getGameObjectWithoutId(game: Game) {
    return {
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer,
      pickCardAnimation: game.pickCardAnimation,
      currentCard: game.currentCard
    }
  }
}
