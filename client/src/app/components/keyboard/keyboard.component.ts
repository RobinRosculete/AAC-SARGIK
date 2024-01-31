import { Component, ViewEncapsulation } from '@angular/core';
import Keyboard from 'simple-keyboard';
import { TextPredictionApiService } from 'src/app/services/text-prediction-api.service';
import {TypewiseAPIService} from '../../services/text_predict/typewise-api.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
// KeyboardComponent
@Component({
  selector: 'app-keyboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css'],
})
export class KeyboardComponent {
  keyboard!: Keyboard;
  userInput: string = '';
  ghostText: string = '';
  //constructor(private textPredictionApi: TextPredictionApiService) {}

  constructor(private typewise:TypewiseAPIService){}

  //Simple Function for text to speech
  speakText() {
    const speak = async () => {
      await TextToSpeech.speak({
        text: this.userInput,
        lang: 'en',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
    };
    speak();
  }
  //Function Used to get API response for GPT Text prediction
  CompletePrediction() {
        let predSentence = this.ghostText.split(' ')
        let prediction = predSentence[predSentence.length - 1];
        const words = this.userInput.split(' ');
        let joinWords;

        if (words){
          words[words.length - 1] = prediction;
          joinWords = words.join(' ');
          this.userInput = joinWords;
          this.keyboard.setInput(this.userInput);
        }
  }

  ngAfterViewInit(): void {
    this.keyboard = new Keyboard({
      onChange: (input) => this.onChange(input), //Any press on keyboard
      onKeyPress: (button) => this.onKeyPress(button), //Calls function to handle key commands
      theme: 'hg-theme-default hg-theme-ios',
      layout: {
        default: [
          'q w e r t y u i o p {bksp}',
          'a s d f g h j k l {enter}',
          '{shift} z x c v b n m , . {shift}',
          '{alt} {smileys} {space} {altright} {ABC}',
        ],
        shift: [
          'Q W E R T Y U I O P {bksp}',
          'A S D F G H J K L {enter}',
          '{shiftactivated} Z X C V B N M , . {shiftactivated}',
          '{alt} {smileys} {space} {altright} {ABC}',
        ],
        ABC: [
          'a b c d e f g h i j {bksp}',
          'k l m n o p q r s {enter}',
          '{shift} t u v w x y z , . {ABC_shift}',
          '{alt} {smileys} {space} {altright} {QWERTY}',
        ],
        ABC_shift: [
          'A B C D E F G H I J {bksp}',
          'K L M N O P Q R S {enter}',
          '{shiftactivated} T U V W X Y Z , . {ABC_shiftactivated}',
          '{alt} {smileys} {space} {altright} {QWERTY}',
        ],
        alt: [
          '1 2 3 4 5 6 7 8 9 0 {bksp}',
          `@ # $ & * ( ) ' " {enter}`,
          '{shift} % - + = / ; : ! ? {shift}',
          '{default} {smileys} {space} {back} {ABC}',
        ],
        smileys: [
          '😀 😊 😅 😂 🙂 😉 😍 😛 😠 😎 {bksp}',
          `😏 😬 😭 😓 😱 😪 😬 😴 😯 {enter}`,
          '😐 😇 🤣 😘 😚 😆 😡 😥 😓 🙄 {shift}',
          '{default} {smileys} {space} {altright} {ABC}',
        ],
      },
      display: {
        '{alt}': '.?123',
        '{smileys}': '\uD83D\uDE03',
        '{shift}': '⇧',
        '{ABC_shift}': '⇧',
        '{shiftactivated}': '⇧',
        '{ABC_shiftactivated}': '⇧',
        '{enter}': 'return',
        '{bksp}': '⌫',
        '{altright}': '.?123',
        '{ABC}': 'ABC Layout',
        '{space}': ' ',
        '{default}': 'ABC',
        '{back}': '⇦',
        '{QWERTY}': 'QWERTY'
      },
    });
  }

  //Handles any press on keyboard
  onChange = (input: string) => {
      this.ghostText = '';
      this.userInput = input;
      this.updateGhostText();
  };

  //Handles Key Commands
  onKeyPress = (button: string) => {
    /**
     * Handle toggles
     */
    if (button.includes('{') && button.includes('}')) {
      this.handleLayoutChange(button);
    }
    if (button.includes('{enter}')) {
      this.CompletePrediction();
    }
  };
  handleLayoutChange = (button: string) => {
    let currentLayout = this.keyboard.options.layoutName;
    let layoutName;

    switch (button) {
      case '{shift}':
      case '{shiftactivated}':
      case '{QWERTY}':
      case '{default}':
        layoutName = currentLayout === 'default' ? 'shift' : 'default';
        break;

      case '{alt}':
      case '{altright}':
        layoutName = currentLayout === 'alt' ? 'default' : 'alt';
        break;

      case '{smileys}':
        layoutName = currentLayout === 'smileys' ? 'default' : 'smileys';
        break;

      case '{ABC_shift}':
      case '{ABC_shiftactivated}':
      case '{ABC}':
        layoutName = currentLayout === 'ABC' ? 'ABC_shift' : 'ABC';
        break;

      

      default:
        break;
    }
    if (layoutName) {
      this.keyboard.setOptions({
        layoutName: layoutName,
      });
    }
  };
  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  };

  updateGhostText() {
    const words = this.userInput.split(' ');
    const lastWord = words[words.length - 1];

    
      this.typewise.getData(this.userInput).subscribe(
        (response: any) => {
          if (lastWord.length > 0 && lastWord != '') {
            let prediction = response.predictions[0].text;
    
            words[words.length - 1] = prediction;
            this.ghostText = words.join(' ');

          } else {
            this.ghostText = ''; // Clear ghost text when last word is longer than 1 character
          }
        },
        (error) => {
          console.error('Error making text prediction', error);
        }
      );
  }
}
