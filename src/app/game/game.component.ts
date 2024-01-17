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
import { ActivatedRoute } from '@angular/router';
import { Unsubscribe } from '@angular/fire/firestore';


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
  gameId: string = '';

  unsubGame!: Unsubscribe;

  constructor(
    public dialog: MatDialog,
    private gameService: GameService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.game = new Game();
    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.gameId = params['id'];
      // only after this we activate the realtime listener
      this.unsubGame = this.gameService.snapshotCurrentGame(params['id']);
      this.gameService.game$.subscribe(game => {
        if (game) {
          this.game = game;
        }
      });
    });
    // this.addGameObject(this.game);
  }

  ngOnDestroy() {
    if (this.unsubGame) {
      this.unsubGame();
    }
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
        this.gameService.updateDoc(this.game, this.gameId);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name) {
        this.game.players.push(name);
        this.gameService.updateDoc(this.game, this.gameId);
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
