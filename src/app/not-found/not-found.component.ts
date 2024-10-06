import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  sentences = [
    'Oups, on dirait que cette page a pris un raccourci... vers nulle part.',
    'Vous êtes perdu... mais au moins vous êtes sur internet.',
    "Cette page est aussi introuvable qu'un Wi-Fi gratuit dans un café.",
    'Désolé, la page que vous cherchez est partie en vacances sans vous prévenir.',
    '404 – La page que vous cherchez est aussi introuvable que vos clés le matin.',
    'Vous avez trouvé un portail vers... le néant. Retour en sécurité ?',
  ];

  randomSentence: string = '';

  router: Router = new Router();

  ngOnInit(): void {
    this.getRandomSentence();
  }

  getRandomSentence(): void {
    const randomIndex = Math.floor(Math.random() * this.sentences.length);
    this.randomSentence = this.sentences[randomIndex];
  }
}
