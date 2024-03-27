import { Component, ViewEncapsulation } from '@angular/core';
import Keyboard from 'simple-keyboard';
import { TextPredictionApiService } from 'src/app/services/text_prediction_custom/text-prediction-api.service';
import { TypewiseAPIService } from '../../services/text_predict_typwise/typewise-api.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import * as emojiMap from '../../../assets/emojis/emojiMap.json';

// KeyboardComponent
@Component({
  selector: 'app-keyboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css'],
})
export class KeyboardComponent {
  private keyboard!: Keyboard;
  protected userInput: string = '';
  protected suggestions: string[] = [];
  protected suggestionSet = new Set<string>();
  // Define the emojiMap property
  emojiMap: { [key: string]: string } = emojiMap;

  //constructor(private textPredictionApi: TextPredictionApiService) {}

  constructor(
    private typewise: TypewiseAPIService,
    private gpt: TextPredictionApiService
  ) {}

  suggestion: string = 'great weekend!';

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
          '{ABC_shift} t u v w x y z , . {ABC_shift}',
          '{alt} {smileys} {space} {altright} {QWERTY}',
        ],
        ABC_shift: [
          'A B C D E F G H I J {bksp}',
          'K L M N O P Q R S {enter}',
          '{ABC_shiftactivated} T U V W X Y Z , . {ABC_shiftactivated}',
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
        '{QWERTY}': 'QWERTY',
      },
    });
  }

  clearInput() {
    this.userInput = '';
    this.clearSuggestions();
    this.keyboard.setInput(''); // Clear the input on the keyboard
  }
  //Handles any press on keyboard
  onChange = (input: string) => {
    this.userInput = input;
    this.updateSuggestions();
  };
  //Funciton to complete prediciton to update real text
  CompletePrediction(suggestion: any) {
    let words = this.userInput.split(' ');
    words[words.length - 1] = suggestion;
    this.userInput = words.join(' ');
    this.keyboard.setInput(this.userInput);
    //this.clearSuggestions;
  }
  //Handles Key Commands
  onKeyPress = (button: string) => {
    /**
     * Handle toggles
     */
    if (button.includes('{') && button.includes('}')) {
      this.handleLayoutChange(button);
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

  updateSuggestions() {
    let predIndex = 0;
    let suggestionIndex = 0;
    let numberOfSuggestions = 0;
    let maxPredictions = 5;

    if (this.userInput.length != 0) {
      this.typewise.getData(this.userInput).subscribe(
        (response: any) => {
          while (numberOfSuggestions < 3 && predIndex < maxPredictions) {
            if (!this.suggestionSet.has(response.predictions[predIndex].text)) {
              this.suggestionSet.add(response.predictions[predIndex].text);
              numberOfSuggestions++;
            }
            predIndex++;
          }

          //this.suggestions = Array.from(this.suggestionSet);

          for (let suggestion of this.suggestionSet) {
            this.suggestions[suggestionIndex] = suggestion;
            suggestionIndex++;
          }

          this.suggestionSet.clear();
        },
        (error) => console.error('Error making text prediction', error)
      );
    } else {
      this.clearSuggestions();
    }
  }

  clearSuggestions() {
    for (let i = 0; i < this.suggestions.length; i++) {
      this.suggestions.pop();
    }
  }
}
