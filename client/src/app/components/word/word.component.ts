import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Input } from '@angular/core';
import { LetterData } from 'src/app/models/letter-data';
import { LetterState } from 'src/app/models/letter-states';
import { TestWord, TestWordStatus } from 'src/app/models/test-word';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css'],
})
export class WordComponent implements OnInit {
  @Output() correct = new EventEmitter<number>();
  @Output() incorrect = new EventEmitter<number>();
  @Output() submitWord = new EventEmitter<TestWord>();

  @Input() word!: string;
  @Input() id!: number;

  @Input() set letterClear(play: boolean) {
    if (!play) {
      this.letterStates = [];
    }
  }

  public state: string = 'inactive';
  public currentIndex: number = 0;
  public letterStates: LetterData[] = [];
  private currentActive: number = 0;

  @Input() set active(val: number) {
    this.currentActive = val;

    if (this.currentActive == this.id) {
      this.state = 'active';
    } else {

      if (this.state === 'active' && this.currentActive > this.id) {
        this.state = 'inactive';
        const skippedLetter: LetterData = {
          state: LetterState.INCORRECT,
          letter: '#',
        };
        const numSkipped = this.word.length - this.letterStates.length;

        // append skipped letter to the letter states array
        for (let i = 0; i < numSkipped; i++) {
          this.letterStates.push(skippedLetter);
        }

        // get all the letters typed in the letterstates array
        const typedLetters: string = this.letterStates
          .map((letter: LetterData) => letter.letter)
          .join('');

        // count number of incorrect in letterstates

        // check if the typed letters are equal to the word
        let wordStatus = TestWordStatus.INCORRECT;
        if (typedLetters === this.word)
          wordStatus = TestWordStatus.CORRECT;

        // create TestWord object
        const testWord: TestWord = {
          id: this.id,
          status: wordStatus,
          endState: typedLetters,
        };

        this.submitWord.emit(testWord);
      }
      this.state = 'inactive';
    }
  }

  @Input()
  set currentTyped(val: string) {
    if (this.letterStates.length > 0 && this.id > this.currentActive) {
      this.letterStates = [];
      return;
    }

    if (this.state !== 'active') return;

    this.currentIndex = val.length - 1;
    this.letterStates = this.letterStates.slice(0, this.currentIndex);

    if (val.length > 0) {
      let currentLetterState: LetterState;

      // check if the last type is equal to the corresponding index of the word
      if (val[val.length - 1] === this.word[this.currentIndex]) {
        currentLetterState = LetterState.CORRECT;
        this.correct.emit(1);
      }
      // check if the last type is not equal to the corresponding index of the word
      else {
        currentLetterState = LetterState.INCORRECT;
        this.incorrect.emit(1);
      }
      // add the letter state to the letter states array
      this.letterStates.push({
        state: currentLetterState,
        letter: val[val.length - 1],
      });
    }
  }

  constructor() {}

  ngOnInit(): void {
    if (this.id === 0) {
      this.state = 'active';
    }
  }
}
