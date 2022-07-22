import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  faEllipsisVertical,
  faSquareCheck,
  faSquareXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Word } from 'src/app/models/words';

@Component({
  selector: 'app-test-source-word',
  templateUrl: './test-source-word.component.html',
  styleUrls: ['./test-source-word.component.css'],
})
export class TestSourceWordComponent implements OnInit {
  @Input() word!: Word;

  @Output() onWordUpdated = new EventEmitter<any>();
  @Output() onWordDeleted = new EventEmitter<Word>();
  @ViewChild('wordInput') editWord!: any;

  public showOnInputWord!: string;
  public editIcon = faEllipsisVertical;
  public checkMarkIcon = faSquareCheck;
  public trashIcon = faSquareXmark;

  public showEdit: boolean = false;

  constructor() {}

  ngOnInit(): void {}
  public onClickEdit(event: Event): void {
    this.showEdit = !this.showEdit;
    if (this.editWord) {
      this.editWord.nativeElement.disabled = !this.showEdit;
      this.editWord.nativeElement.focus();
    }
    this.showOnInputWord = this.word.word;
  }

  public onClickSave(event: Event): void {
    const data = [this.word.word, this.showOnInputWord];
    this.onWordUpdated.emit(data);
    this.showEdit = false;
    this.word.word = this.showOnInputWord;
  }

  public onClickDelete(event: Event): void {
    this.onWordDeleted.emit(this.word);
  }
}
