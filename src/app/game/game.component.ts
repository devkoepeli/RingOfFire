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
import { Subscription } from 'rxjs';


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
  game!: Game;
  gameId: string = '';

  unsubGame!: Unsubscribe;
  paramsSubscription!: Subscription;

  constructor(
    public dialog: MatDialog,
    private gameService: GameService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.game = new Game();
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.gameId = params['id'];
      // only after this we activate the realtime listener
      this.unsubGame = this.gameService.snapshotCurrentGame(params['id']);
      this.gameService.game$.subscribe(game => {
        if (game) {
          this.game = game;
        } 
      });
    });
  }

  ngOnDestroy() {
    this.unsubGame();
    this.gameService.gameSubject.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }

  takeCard() {
    const lastCard = this.game.stack.pop();
    if (!this.game.pickCardAnimation && lastCard != undefined) {
      this.game.currentCard = lastCard;
      this.game.pickCardAnimation = true;
      this.incrementCurrentPlayer();
      this.gameService.updateDoc(this.game, this.gameId);

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.gameService.updateDoc(this.game, this.gameId);
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
