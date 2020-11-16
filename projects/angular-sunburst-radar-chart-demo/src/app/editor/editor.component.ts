import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {


  items = [{
    name: 'Delaware ',
    color: '#b24bb7',
    value: 100,
    children: [{name: 'Kent County', value: 100}, {name: 'New Castle County', value: 100}, {name: 'Sussex County', value: 100}]
  },
    {
      name: 'Hawaii ',
      value: 95,
      color: '#3bb54a',
      children: [{name: 'Hawaii County', value: 95}, {name: 'Honolulu County', value: 95}, {
        name: 'Kauai County',
        value: 95
      }, {name: 'Maui County', value: 95}]
    },
    {
      name: 'District of Columbia ',
      color: '#6351a2',
      value: 89,
      children: [{name: 'District of Columbia', value: 83}, {name: 'Ward 2', value: 79}, {name: 'Ward 3', value: 84}, {
        name: 'Ward 4',
        value: 88
      }, {name: 'Ward 5', value: 94}, {name: 'Ward 6', value: 95}, {name: 'Ward 7', value: 94}, {name: 'Ward 8', value: 92}]
    },
    {
      name: 'Arizona ',
      value: 98,
      color: '#F351a2',
      children: [{name: 'Navajo County', value: 99}, {name: 'Maricopa County', value: 95}, {name: 'Mohave County', value: 99}]
    }
  ];


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
