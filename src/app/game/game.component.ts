import { CommonModule, NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, NgStyle],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

}
