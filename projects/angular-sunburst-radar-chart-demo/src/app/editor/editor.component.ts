import {Component, OnInit} from '@angular/core';
import {countriesWithCounty, exampleValues} from './items';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {


  items = exampleValues;

  updatedSize = 800;
  updatedSizepx = this.updatedSize + 'px';
  updatedMaxScore = 100;
  updatedAnimateChart = false;

  size: number;
  maxScore: number;
  itemJson: any;
  error = null;
  submitting: any = false;
  animateChart = 'false';

  constructor() {
  }

  ngOnInit(): void {
    this.size = this.updatedSize;
    this.maxScore = this.updatedMaxScore;
    this.itemJson = JSON.stringify(this.items, null, ' ');
  }

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  updateChart() {

    if (!this.IsJsonString(this.itemJson)) {

      this.error = 'Invalid JSON';
      return;
    }

    this.submitting = true;

    setTimeout(() => {
      this.error = null;
      this.updatedSize = this.size;
      this.updatedSizepx = this.updatedSize + 'px';
      this.updatedMaxScore = this.maxScore;

        this.updatedAnimateChart = (this.animateChart =='true');

      console.log('max', this.updatedMaxScore);
      this.items = JSON.parse(this.itemJson);
      this.submitting = false;
    }, 10);

  }
}
