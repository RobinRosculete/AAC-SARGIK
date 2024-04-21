import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor() { }

  speakText(text: string): void {
    const speak = async () => {
      await TextToSpeech.speak({
        text: text,
        lang: 'en',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
    };
    speak();
  }
}
