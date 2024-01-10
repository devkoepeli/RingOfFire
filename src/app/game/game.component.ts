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
  game: Game;
  currentCard: string = '';
  hasStarted = false;

  constructor(public dialog: MatDialog) {
    this.game = new Game();
  }

  ngOnInit() {
  }

  newGame() {
  }

  takeCard() {
    const lastCard = this.game.stack.pop();
    if (!this.pickCardAnimation && lastCard != undefined) {
      this.hasStarted = true;
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
      this.game.players.push(name);
    });
  }

  incrementCurrentPlayer() {
    if (this.game.currentPlayer < (this.game.players.length - 1)) {
      this.game.currentPlayer++;
    } else {
      this.game.currentPlayer = 0;
    }
  }
}
