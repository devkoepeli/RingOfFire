import { Injectable, inject } from '@angular/core';
import { collection, Firestore, doc, documentId, onSnapshot, DocumentData } from '@angular/fire/firestore';
import { Card } from '../interfaces/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardsListService {
  firestore: Firestore = inject(Firestore);

  unsubCardsStack;
  unsubCardsPlayed;

  cardsStack: Card[] = [];
  cardsPlayed: Card[] = [];

  constructor() { 
    this.unsubCardsStack = this.snapshotCardsStack();
    this.unsubCardsPlayed = this.snapshotCardsPlayed();
  }

  snapshotCardsStack() {
    return onSnapshot(this.getColRef('cardsStack'), cards => {
      this.cardsStack = [];
      cards.forEach(card => {
        this.cardsStack.push(this.setCardObject(card.data(), card.id))
      });
    });
  }

  snapshotCardsPlayed() {
    return onSnapshot(this.getColRef('cardsPlayed'), cards => {
      this.cardsPlayed = [];
      cards.forEach(card => {
        this.cardsPlayed.push(this.setCardObject(card.data(), card.id));
      });
    });
  }

  getColRef(colId: 'cardsStack' | 'cardsPlayed') {
    return collection(this.firestore, colId);
  }

  getDocRef(colId: 'cardsStack' | 'cardsPlayed', docId: string) {
    return doc(this.firestore, colId, docId);
  }

  setCardObject(cardSrc: any, cardId: string): Card {
    return {
      src: cardSrc,
      ID: cardId
    }
  }
}
