import {Component, OnInit} from '@angular/core';
import {exampleValues} from './items';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {


  items = exampleValues;

  size: number=800;
  maxScore: number=100;
  legendAxisLinePosition=1;
  itemJson: any;
  error = null;
  submitting: any = false;
  animateChart = 'true';
  splitBasedOnChildren='true';


  options = {size: this.size, maxScore: this.maxScore,legendAxisLinePosition:this.legendAxisLinePosition,
    animateChart: (this.animateChart == 'true'),
    splitBasedOnChildren: (this.splitBasedOnChildren == 'true')};





  constructor() {
  }

  ngOnInit(): void {


    this.itemJson = JSON.stringify(this.items, null, ' ');

  }

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      this.error = 'Invalid JSON' + e.toString();
      return false;
    }
    return true;
  }

  updateChart() {

    if (!this.IsJsonString(this.itemJson)) {


      return;
    }


    this.submitting = true;

    setTimeout(() => {
      this.error = null;


      this.options.size = this.size;

      this.options.maxScore = this.maxScore;
      this.options.legendAxisLinePosition = this.legendAxisLinePosition;

      this.options.animateChart = (this.animateChart == 'true');
      this.options.splitBasedOnChildren = (this.splitBasedOnChildren == 'true');

      this.items = JSON.parse(this.itemJson);
      this.submitting = false;
    }, 10);

  }
}
