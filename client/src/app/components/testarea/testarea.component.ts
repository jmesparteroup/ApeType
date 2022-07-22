import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  faArrowRight,
  faRotateRight,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/models/game';
import { Test, TestData, TestResult } from 'src/app/models/test';
import { TestConfig } from 'src/app/models/test-config';
import { TestWord, TestWordStatus } from 'src/app/models/test-word';
import { Login, LoginState } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { ScoresService } from 'src/app/services/scores.service';
import { TestConfigService } from 'src/app/services/test-config.service';
import { UsersService } from 'src/app/services/users.service';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-testarea',
  templateUrl: './testarea.component.html',
  styleUrls: ['./testarea.component.css'],
})
export class TestareaComponent implements OnInit {
  @Input() multiplayer: boolean = false;
  @Input() activeType: string = '';
  @Input() activeLevel: number = 0;
  @Input() set setPlayers(val: Player[]) {
    this.players = val;
    this.longestNameLength = Math.floor(
      1.2 * Math.max(...this.players.map((player) => player.nickname.length))
    );
  }
  public players: Player[] = [];
  @Input() gameId!: string;
  @Input() testcase!: string[];
  @Input() rankings!: Player[];
  @Output() goToLobby = new EventEmitter<any>();

  @ViewChild('inputText') inputText: any;
  @ViewChildren('words', { read: ElementRef }) words: any;

  private defaultConfig: TestConfig = {
    type: 'words',
    level: 0,
  };

  private testParams: any = {
    words: 'numWords',
    quote: 'quoteLength',
    time: 'time',
  };

  private levels: any = {
    words: [10, 25, 50, 100],
    time: [15, 30, 60, 120],
    quote: [10, 25, 50, 100],
  };

  private loginDetails!: Login;

  private canGoBackToPrevWord: boolean = false;
  private numOfIncorrectWords: number = 0;
  private prevWord!: TestWord;

  public testData: TestData[] = [];
  public needToLogin: boolean = true;

  public blurTestArea: boolean = false;

  // used only in multiplayer mode
  public resultTabIndex: number = 0;
  public longestNameLength: number = 0;

  public restartIcon: IconDefinition = faRotateRight;
  public nextIcon: IconDefinition = faArrowRight;

  public testConfig!: TestConfig;
  public test!: Test;

  public active: number = 0;
  public testStart: boolean = false;
  public done: boolean = false;

  public currentTyped!: string;
  public countOfCharTyped: number = 0;
  public countOfCorrect: number = 0;
  public countOfIncorrect: number = 0;

  public wpm: number = 0;
  public netwpm: number = 0;
  public accuracy: number = 0;

  public time: number = 0;
  public timeCountdown: number = 0;
  public play: boolean = false;
  public interval: any;
  public intervalCountdown: any;
  public focusListener: any;
  public timeLeft = 0;
  public math: any = Math;

  public submitWord = false;

  public configSubscription!: Subscription;

  constructor(
    private testService: TestService,
    private testConfigService: TestConfigService,
    private scoresService: ScoresService,
    private authService: AuthService,
    private gameService: GameService
  ) {
    this.authService.authStream$.subscribe((login: Login) => {
      this.loginDetails = login;
      this.needToLogin = false;
    });
  }

  ngOnInit(): void {
    this.testConfig = this.defaultConfig;
    this.configSubscription =
      this.testConfigService.testConfigStream$.subscribe(
        (config: TestConfig) => {
          if (!this.multiplayer) {
            this.testConfig = config || this.defaultConfig;
            this.restart();
            this.getTest();
          }
        }
      );

    if (this.multiplayer) {
      this.startCountdown();
    }

    this.inputFocusListener();
  }

  blurTestAreaHandler(val: boolean): void {
    this.blurTestArea = val;
  }

  getTest(): void {
    this.testService
      .getTest(
        this.testConfig.type,
        this.testParams[this.testConfig.type],
        this.testConfig.level
      )
      .subscribe((test: Test) => {
        this.test = test;
        this.testcase = test.testcase.split(' ');
        console.log(test);
      });
  }

  onChange(newValue: string): void {
    if (!this.testStart && !this.multiplayer) {
      this.startTimer();
      this.testStart = true;
    }
    this.currentTyped = newValue.trim();
    ++this.countOfCharTyped;

    if (this.active === this.testcase.length - 1) {
      if (this.currentTyped.length === this.testcase[this.active].length) {
        this.finishTest();
      }
    }
  }

  focusOnInputField() {
    this.inputText?.nativeElement?.focus();
  }

  logWPM(): void {
    this.wpm = Math.round(this.countOfCharTyped / 5 / (this.time / 60));

    // filter out the words that are not touched

    this.netwpm = Math.round(
      this.wpm - this.numOfIncorrectWords / (this.time / 60)
    );
    // console.log(`WPM : ${this.wpm}`);
    // console.log(`NETWPM : ${this.netwpm}`, this.numOfIncorrectWords);
  }

  logAccuracy(): void {
    this.accuracy = Math.round(
      (this.countOfCorrect / this.countOfCharTyped) * 100
    );
    console.log(
      `Correct/Total : ${this.countOfCorrect}/${this.countOfCharTyped}`
    );
  }

  onCorrect(val: number): void {
    this.countOfCorrect += val;
  }

  onIncorrect(val: number): void {
    this.countOfIncorrect += val;
  }

  goToNextWord(event: any): void {
    // console.log(event);
    --this.countOfCharTyped;
    this.currentTyped = '';
    // look for the active div in the children of the div with id 'words'
    ++this.active;

    if (this.active >= this.testcase.length) {
      this.finishTest();
    }

    let activeDiv = this.words.toArray()[this.active];
    activeDiv.nativeElement.scrollIntoView({ block: 'center' });
  }

  goToPrevWord(): void {
    console.log('PREV WORD!!!!');
    this.canGoBackToPrevWord = false;
    this.numOfIncorrectWords--;
    this.currentTyped = '';
    --this.active;
    this.inputText.nativeElement.value = this.prevWord.endState;
  }

  finishTest(): void {
    setTimeout(() => {
      this.play = false;
      this.done = true;
      clearInterval(this.interval);
      this.logWPM();
      this.logAccuracy();
      const lastDataPoint: TestData = {
        time: Math.round(this.time * 10) / 10,
        wpm: this.wpm,
        netwpm: this.netwpm,
        progressIndex: this.testcase.length,
      };
      if (this.testConfig.type !== 'time') this.testData.push(lastDataPoint);
      this.gameService.updateProgress(lastDataPoint, this.gameId);
      this.submitTestResult();
    }, 100);
  }

  submitTestResult(): void {
    if (this.loginDetails?.state === LoginState.LOGGED_OUT) {
      this.needToLogin = true;
      return;
    }

    const testResult: TestResult = {
      userID: this.loginDetails?.user || '',
      type: this.testConfig.type,
      wpm: this.netwpm,
      accuracy: this.accuracy,
      level: this.levels[this.testConfig.type][this.testConfig.level],
    };

    if (!this.multiplayer) {
      this.scoresService.recoredScore(testResult).subscribe((res) => {
        console.log(res);
      });
    }

    if (this.multiplayer) {
      this.gameService.finishPlayer(
        this.gameId,
        testResult.wpm,
        testResult.accuracy
      );
    }
  }

  restart(): void {
    this.active = 0;
    this.countOfCharTyped = 0;
    this.countOfCorrect = 0;
    this.countOfIncorrect = 0;
    this.currentTyped = '';
    this.time = 0;
    this.testData = [];
    this.play = false;
    this.done = false;
    this.testStart = false;
    this.timeLeft = this.levels[this.testConfig.type][this.testConfig.level];
    this.getTest();
    clearInterval(this.interval);
  }

  onBackspace(): void {
    if (this.currentTyped.length === 0 && this.canGoBackToPrevWord) {
      console.log('backspace');
      this.goToPrevWord();
    }
  }

  startTimer(): void {
    this.play = true;
    let count = 0;
    const intervalInc = 0.1;
    this.interval = setInterval(() => {
      this.time += intervalInc;
      this.logWPM();

      if (this.testConfig.type === 'time' || this.activeType === 'time') {
        this.timeLeft -= intervalInc;
        if (this.multiplayer) {
          if (this.time >= this.levels[this.activeType][this.activeLevel]) {
            clearInterval(this.interval);
            this.finishTest();
          }
        } else {
          if (
            this.time >=
            this.levels[this.testConfig.type][this.testConfig.level]
          ) {
            clearInterval(this.interval);
            this.finishTest();
          }
        }
      }
      if (count % (1 / intervalInc) === 0) {
        const currTestData: TestData = {
          time: Math.round(this.time),
          wpm: count === 0 ? 0 : this.wpm,
          netwpm: count === 0 ? 0 : this.netwpm,
          progressIndex: this.active,
        };

        this.testData.push(currTestData);
        this.gameService.updateProgress(currTestData, this.gameId);
      }
      count++;
    }, intervalInc * 1000);
  }

  inputFocusListener(): void {
    this.focusListener = setInterval(() => {
      // check if input field has input
      if (this.inputText?.nativeElement === document.activeElement) {
        this.blurTestAreaHandler(false);
      } else {
        this.blurTestAreaHandler(true);
      }
    }, 500);
  }

  harvestWordStatus(wordStatus: TestWord): void {
    if (wordStatus.status === TestWordStatus.INCORRECT) {
      this.prevWord = wordStatus;
      this.numOfIncorrectWords++;
      this.canGoBackToPrevWord = true;
    }
  }

  startCountdown(): void {
    this.timeCountdown = 5;
    console.log(this.activeType, this.activeLevel)
    this.timeLeft = this.levels[this.activeType][this.activeLevel];
    const intervalInc = 0.1;
    this.intervalCountdown = setInterval(() => {
      this.timeCountdown -= intervalInc;
      if (this.timeCountdown <= 0) {
        clearInterval(this.intervalCountdown);
        clearInterval(this.interval);
        this.startTimer();
        this.testStart = true;
        setTimeout(() => {
          this.focusOnInputField();
        }, 50);
      }
    }, intervalInc * 1000);
  }

  nextTab(): void {
    this.resultTabIndex++;
    if (this.resultTabIndex > 1) {
      this.resultTabIndex = 0;
      this.goToLobby.emit(true);
    }
  }
}
