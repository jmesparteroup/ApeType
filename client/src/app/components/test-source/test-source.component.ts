import { Component, OnInit } from '@angular/core';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { Word } from 'src/app/models/words';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-test-source',
  templateUrl: './test-source.component.html',
  styleUrls: ['./test-source.component.css'],
})
export class TestSourceComponent implements OnInit {
  public newWordInput: string = '';

  public checkMarkIcon = faSquareCheck;

  public words: Word[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllWords().subscribe((words) => {
      this.words = words;
    });
  }

  public addWordHandler(): void {
    const newWord = {
      word: this.newWordInput,
      id: -1,
    };

    this.adminService.addWord(newWord).subscribe((word) => {
      this.words.push(word);
      this.newWordInput = '';
    });
  }

  public deleteWordHandler(word: Word): void {
    this.adminService.deleteWord(word).subscribe(() => {
      this.words = this.words.filter((w) => w.id !== word.id);
    });
  }

  public updateWordHandler(data: any): void {
    this.adminService.updateWord(data).subscribe((updatedWord) => {
      const index = this.words.findIndex((w) => w.word === data[0].word);
      this.words[index] = updatedWord;
    });
  }
}
