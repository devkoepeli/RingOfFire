import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-17c84","appId":"1:918645326418:web:f83276d22bac3dca22d58b","storageBucket":"ring-of-fire-17c84.appspot.com","apiKey":"AIzaSyAMjO44EH8AeDRrB76pJFOYg5-Tw2-Drfs","authDomain":"ring-of-fire-17c84.firebaseapp.com","messagingSenderId":"918645326418"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
