import { CommonModule, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, NgStyle, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit{
  pickCardAnimation = false;
  game: Game;
  currentCard: string = '';

  constructor() {
    this.game = new Game();
  }

  ngOnInit() {
  }

  newGame() {
  }

  takeCard() {
    const lastCard = this.game.stack.pop();
    if (!this.pickCardAnimation && lastCard != undefined) {
      this.currentCard = lastCard;
      this.pickCardAnimation = true;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }
}
