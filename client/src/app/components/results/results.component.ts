import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TestData } from 'src/app/models/test';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  @ViewChild('chart') chart: any;

  @Input() wpm!: number;
  @Input() accuracy!: number;
  @Input() testData!: TestData[];

  constructor() {}

  ngOnInit(): void {
    const myChart = new Chart('chart', {
      type: 'line',
      data: {
        labels: this.testData.map((testData) => testData.time),
        datasets: [
          {
            label: "wpm",
            data: this.testData.map((testData) => testData.netwpm),
            borderColor: '#9ec7ac',
            backgroundColor: '#323437',
            fill: false,
            pointBackgroundColor: '#323437',
            pointBorderColor: '#9ec7ac',
          },
          {
            label: "raw",
            data: this.testData.map((testData) => testData.wpm),
            borderColor: '#676661',
            backgroundColor: '#676661',
            fill: false,
            pointBackgroundColor: '#323437',
            pointBorderColor: '#9ec7ac',
          },
         
        ],
      },
      options: {
        animation: {
          duration: 200
        },
        scales: {
          x: {
            min: 1,
            grid: {
              drawBorder: true,
            },
            title: {
              display: true,
              text: 'Time (s)',
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 7,
            },
          },
          y: {
            title: {
              display: true,
              text: 'WPM',
            },
            max: Math.max(...this.testData.map((testData) => testData.wpm)),
            ticks: {
              autoSkip: true,
              stepSize: Math.round((Math.max(...this.testData.map((testData) => testData.wpm))+10) / 4),
            },
          },
        },
      },
    });
  }
}
