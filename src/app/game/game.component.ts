import { CommonModule, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from './player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { InstructionComponent } from './instruction/instruction.component';
import { GameService } from '../firebase-services/game.service';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    NgStyle,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DialogAddPlayerComponent,
    InstructionComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game!: Game;
  currentCard: string = '';

  constructor(public dialog: MatDialog, private gameService: GameService) {
  }
  
  ngOnInit() {
    this.game = new Game();
    this.addGameObject(this.game);
  }

  // convert custom game object into a simple object because for firebase
  // data must be an object, but it was: a custom Game object
  addGameObject(game: Game) {
    const cleanGame: Game = {
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer
    }
    this.gameService.addGame(cleanGame);
  }

  takeCard() {
    const lastCard = this.game.stack.pop();
    if (!this.pickCardAnimation && lastCard != undefined) {
      this.currentCard = lastCard;
      this.pickCardAnimation = true;
      this.incrementCurrentPlayer();

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name) {
        this.game.players.push(name);
      }
    });
  }

  incrementCurrentPlayer() {
    if (this.game.players.length > 0) {
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    }
  }
}
