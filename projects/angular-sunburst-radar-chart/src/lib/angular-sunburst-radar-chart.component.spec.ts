import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AngularSunburstRadarChartComponent} from './angular-sunburst-radar-chart.component';
import {getMaxDepth} from './utils/positions';
import {clone, getItemTitle, getOptionsOrEmpty, hashCode} from './utils/utils';
import {SimpleChange} from '@angular/core';
import {convertToPercentage} from './utils/math';

describe('AngularSunburstRadarChartComponent', () => {
  let component: AngularSunburstRadarChartComponent;
  let fixture: ComponentFixture<AngularSunburstRadarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AngularSunburstRadarChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularSunburstRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const items = [
      {
        name: 'Enterprise Agility ',
        value: 90,
        color: '#b24bb7'


      },
      {
        name: 'Teamwork',
        value: 50,
        color: '#3bb54a',
        children: [
          {
            name: 'Working Agreement',
            value: 40
          }, {
            name: 'Short Term Goals',
            value: 100
          }, {
            name: 'Team Meetings',
            value: 30
          }
        ]

      },
      {
        name: 'Facilitation',
        value: 75,
        color: '#6351a2',
        children: [
          {
            name: 'Engagement',
            value: 40
          }, {
            name: 'Preparation and design',
            value: 36
          }
        ]
      },


    ];
    component.size = 800;
    component.items = items;
    component.maxScore = 100;
    component.ngOnInit();
    fixture.detectChanges();


  });
  it('Long things should generate vhart', () => {
    expect(component).toBeTruthy();

    const items = [
      {
        name: 'Enterprise Agility ',
        value: 90,


      },
      {
        name: 'Teamwork',
        value: 50,

        children: [
          {
            name: 'Working Agreement',
            value: 40
          }, {
            name: 'Short Term Goals',
            value: 100
          }, {
            name: 'Team Meetings',
            value: 30
          }
        ]

      },
      {
        name: 'Facilitation',
        value: 75,

        children: [
          {
            name: 'Engagement',
            value: 40
          }, {
            name: 'Preparation and design',
            value: 36
          }
        ]
      },


    ];
    component.size = 800;
    component.items = items;
    component.maxScore = 100;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('Distance distFromStartToSecond greater than distFromStartToFirst should not swap', () => {
    expect(component).toBeTruthy();

    const firstPoint = {x: 3, y: 5};
    const secondPoint = {x: 30, y: 50};
    const distFromStartToFirst = 25;
    const distFromStartToSecond = 50;
    const {updatedSecondPoint, updatedFirstPoint} = component.getUpdatedPoints(firstPoint, secondPoint, distFromStartToFirst, distFromStartToSecond);
    expect(updatedSecondPoint).toEqual(secondPoint);
    expect(updatedFirstPoint).toEqual(firstPoint);
  });

  it('Distance distFromStartToSecond lesser than distFromStartToFirst should  swap', () => {
    expect(component).toBeTruthy();

    const firstPoint = {x: 3, y: 5};
    const secondPoint = {x: 30, y: 50};
    const distFromStartToFirst = 55;
    const distFromStartToSecond = 50;
    const {updatedSecondPoint, updatedFirstPoint} = component.getUpdatedPoints(firstPoint, secondPoint, distFromStartToFirst, distFromStartToSecond);
    expect(updatedSecondPoint).toEqual(firstPoint);
    expect(updatedFirstPoint).toEqual(secondPoint);
  });

  it('No color should generate random', () => {
    expect(component).toBeTruthy();

    const items = [{
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


    component.size = 800;
    component.items = items;
    component.maxScore = 100;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hasChildren).toBe(true);


  });
  it('Ensure When items does not have children hasChildren should be false', () => {
    expect(component).toBeTruthy();

    const items = [{name: 'Delaware ', color: '#b24bb7', value: 100},
      {name: 'Hawaii ', value: 95, color: '#3bb54a'}];


    component.size = 800;
    component.items = items;
    component.maxScore = 100;
    component.animateChart = false;
    component.ngOnInit();
    fixture.detectChanges();


  });
  it('Ensure When onchanges update things', () => {
    expect(component).toBeTruthy();


    component.items = null;
    component.ngOnChanges({
      size: new SimpleChange(null, 1200, false),
      maxScore: new SimpleChange(50, 100, false),
    });


  });
});


describe('position tests', () => {

  it('should be level 2', () => {

    const items = [
      {
        name: 'Individual over greater things ',
        value: 190,
        color: '#f6951f',
        children: [
          {
            name: 'Time Management',
            value: 5,
            children: [
              {
                name: 'inner Time Management',
                value: 5,
              }
            ]
          }, {
            name: 'Prioritization',
            value: 70
          }, {
            name: 'Focus',
            value: 30
          }, {
            name: 'Time Management',
            value: 5
          }, {
            name: 'Prioritization',
            value: 70
          }, {
            name: 'Focus',
            value: 30
          }, {
            name: 'Time Management',
            value: 5
          }, {
            name: 'Prioritization',
            value: 70
          }, {
            name: 'Focus',
            value: 30
          }
        ]

      },
      {
        name: 'Enterprise Agility ',
        value: 90,
        color: '#b24bb7'


      },
      {
        name: 'Teamwork',
        value: 50,
        color: '#3bb54a',
        children: [
          {
            name: 'Working Agreement',
            value: 40
          }, {
            name: 'Short Term Goals',
            value: 100
          }, {
            name: 'Team Meetings',
            value: 30
          }
        ]

      },
      {
        name: 'Facilitation',
        value: 75,
        color: '#6351a2',
        children: [
          {
            name: 'Engagement',
            value: 40
          }, {
            name: 'Preparation and design',
            value: 36
          }
        ]
      },


    ];


    expect(getMaxDepth(items)).toBe(2);
  });
});

describe('utils tests', () => {

  it('should be empty if null', () => {


    expect(getOptionsOrEmpty(null)).toEqual({});
  });

  it('should be empty if item is null', () => {


    expect(getItemTitle(null)).toEqual('');
  });
  it('clone should return', () => {

    let obj = {'name': 'Mr x'};
    const item = clone(obj);

    expect(obj).toEqual(item);
  });

  it('hashCode should return value for empty as well', () => {

    expect(hashCode(null)).not.toBe(null);
  });
});
describe('math tests', () => {

  it('convertToPercentage should return actual score ,if maxScore is less', () => {


    expect(convertToPercentage({plotMax: 100, actualScore: 156, maxScore: 100})).toEqual(100);
  });
});
