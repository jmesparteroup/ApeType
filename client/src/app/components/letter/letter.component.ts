import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { LetterData } from 'src/app/models/letter-data';
import { LetterState } from 'src/app/models/letter-states';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css']
})
export class LetterComponent implements OnInit {
private defaultLetterData: LetterData = {
  state: LetterState.WAITING,
  letter: ""
};

  // letterData: LetterData = this.defaultLetterData;
  @Input() letter!: string;

//   @Input() set changeLetterData(letterData: LetterData) {
//    this.letterData = letterData || this.defaultLetterData;
//  }

   @Input() letterData: LetterData = this.defaultLetterData;


  constructor() { }

  ngOnInit(): void {
  }

}
