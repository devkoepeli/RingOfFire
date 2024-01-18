import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Game } from '../../models/game';
import { GameService } from '../firebase-services/game.service';
import { GameErrorComponent } from '../game-error/game-error.component';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule, GameErrorComponent],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  game!: Game;

  constructor(
    private router: Router,
    private gameService: GameService,
    public dialog: MatDialog
  ) { }

  async startGame() {
    this.game = new Game();
    const docRef = await this.gameService.addGame(this.setSimpleObject(this.game));
    if (docRef) {
      this.router.navigateByUrl('/game/' + docRef.id);
    } else {
      this.dialog.open(GameErrorComponent)
    }
  }

  // convert custom game object into a simple object because for firebase
  // data must be an object, but it was: a custom Game object
  setSimpleObject(game: Game) {
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
