import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CardsListService {
  firestore: Firestore = inject(Firestore);

  constructor() { }
}
