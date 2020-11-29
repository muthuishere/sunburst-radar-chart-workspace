import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AngularSunburstRadarChartComponent} from './angular-sunburst-radar-chart.component';
import {getMaxDepth} from './utils/positions';
import {clone, getCurrentPointFromEvent, getItemTitle, getOptionsOrEmpty, hashCode} from './utils/utils';
import {SimpleChange} from '@angular/core';
import {convertToPercentage} from './utils/math';
import {getUpdatedPoints} from './utils/arc-bar-charts';
import {getAllAnglesBasedOnChild, getAllAnglesBasedOnParent} from './utils/angels';
import {adjustAngleRadianDifference, getLargeArcFlag} from './utils/trignometry';
import {By} from '@angular/platform-browser';
import {getTextForAngle, writeTextOnArc} from './utils/textelement';


const itemsWithChildren = [
  {
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

const itemsWithNoChildren = [
  {
    name: 'Arizona a ',
    value: 98,
    color: '#F351a2'
  },
  {
    name: 'Arizona ',
    value: 98,
    color: '#F351a2'
  }
];
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
    const {updatedSecondPoint, updatedFirstPoint} = getUpdatedPoints(firstPoint, secondPoint, distFromStartToFirst, distFromStartToSecond);
    expect(updatedSecondPoint).toEqual(secondPoint);
    expect(updatedFirstPoint).toEqual(firstPoint);
  });

  it('Distance distFromStartToSecond lesser than distFromStartToFirst should  swap', () => {
    expect(component).toBeTruthy();

    const firstPoint = {x: 3, y: 5};
    const secondPoint = {x: 30, y: 50};
    const distFromStartToFirst = 55;
    const distFromStartToSecond = 50;
    const {updatedSecondPoint, updatedFirstPoint} = getUpdatedPoints(firstPoint, secondPoint, distFromStartToFirst, distFromStartToSecond);
    expect(updatedSecondPoint).toEqual(firstPoint);
    expect(updatedFirstPoint).toEqual(secondPoint);
  });

  it('Tests on tooltip', () => {
    expect(component).toBeTruthy();

    component.showTooltipText({pageX: 34, pageY: 43}, 'Ho');
    expect(component.showToolTip).toEqual(true);
    expect(component.tooltipText).toEqual('Ho');
    component.hideTooltip();
    expect(component.showToolTip).toEqual(false);

  });

  it('No color should generate random', () => {
    expect(component).toBeTruthy();


    component.items = itemsWithChildren;


    component.options = {size: 300, maxScore: 100, animateChart: true, splitBasedOnChildren: false, legendAxisLinePosition: 1};


    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hasChildren).toBe(true);


  });


  it('modifyOnFirstChange should initialize if its first change', () => {
    expect(component).toBeTruthy();


    component.items = itemsWithChildren;


    component.options = {size: 300, maxScore: 100, animateChart: true, splitBasedOnChildren: false, legendAxisLinePosition: 1};


    component.modifyOnFirstChange(true);


  });
  it('Start Rotate tests', () => {
    expect(component).toBeTruthy();


    component.items = itemsWithChildren;


    component.options = {size: 300, maxScore: 100, animateChart: true, splitBasedOnChildren: false, legendAxisLinePosition: 1};


    component.ngOnInit();
    fixture.detectChanges();
    const groupElement = fixture.debugElement.query(By.css('#' + component.svgGroupId));
    const mouseDownEvent = new MouseEvent('mousedown');
    groupElement.nativeElement.dispatchEvent(mouseDownEvent);

    fixture.detectChanges();


    const mouseMoveEvent = new MouseEvent('mousemove');
    groupElement.nativeElement.dispatchEvent(mouseMoveEvent);

    fixture.detectChanges();

    expect(component.startRotation).toBeTrue();


  });

  it('Start Rotate tests - initPoint CHanges', () => {
    expect(component).toBeTruthy();


    component.items = itemsWithChildren;


    component.options = {size: 300, maxScore: 100, animateChart: true, splitBasedOnChildren: false, legendAxisLinePosition: 1};


    component.ngOnInit();
    fixture.detectChanges();
    const groupElement = fixture.debugElement.query(By.css('#' + component.svgGroupId));
    const mouseDownEvent = new MouseEvent('mousedown');
    groupElement.nativeElement.dispatchEvent(mouseDownEvent);

    fixture.detectChanges();


    const mouseMoveEvent = new MouseEvent('mousemove');
    groupElement.nativeElement.dispatchEvent(mouseMoveEvent);

    fixture.detectChanges();


    component.svgHandler.initPoint = 40;
    component.svgHandler.previousPoint = 20;
    component.svgHandler.updateInitPointFromCurrentPoint(25);
    expect(component.svgHandler.initPoint).toEqual(35);

    component.svgHandler.initPoint = 40;
    component.svgHandler.previousPoint = 20;
    component.svgHandler.updateInitPointFromCurrentPoint(15);
    expect(component.svgHandler.initPoint).toEqual(45);


  });
  it('Start Rotate tests - out of component', () => {
    expect(component).toBeTruthy();


    component.items = itemsWithChildren;


    component.options = {size: 300, maxScore: 100, animateChart: true, splitBasedOnChildren: false, legendAxisLinePosition: 1};


    component.ngOnInit();
    fixture.detectChanges();
    component.onOutOfComponent();
    expect(component.startRotation).toBeFalse();
    expect(component.showToolTip).toBeFalse();


  });
  it('Start Rotate tests - should not draw if mouse is not dragged', () => {
    expect(component).toBeTruthy();


    component.items = itemsWithChildren;


    component.options = {size: 300, maxScore: 100, animateChart: true, splitBasedOnChildren: false, legendAxisLinePosition: 1};


    component.ngOnInit();
    fixture.detectChanges();
    component.startRotation = false;
    const existingRotationPoint = component.rotationPoint;
    component.rotateChart(null);
    expect(component.rotationPoint).toEqual(existingRotationPoint);


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

  it('Legend Axis Index should return 0 if angles is empty array or greater than size of angles array', () => {


    const angles = [80, 90];
    component.legendAxisLinePosition = 0;

    expect(component.getLegendAxisIndex(angles)).toBe(0);

    component.legendAxisLinePosition = 3;
    expect(component.getLegendAxisIndex(angles)).toBe(0);
  });
});


describe('position tests', () => {

  it('should be level 2 for 2 levels', () => {

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
  it('should be 0 for null or empty items', () => {

    let items = [];


    expect(getMaxDepth(items)).toBe(0);
    items = null;


    expect(getMaxDepth(items)).toBe(0);
  });
});

describe('utils tests', () => {


  it('should return touch event co ordinates , if its been from touch', () => {


    const expectedTouch = {x: 100, y: 123};
    const expectedMouse = {x: 150, y: 173};
    let targetTouches = [{pageX: 100, pageY: 123}];

    let event: any = {clientX: 150, clientY: 173, targetTouches};
    let actual = getCurrentPointFromEvent(event);
    expect(actual).toEqual(expectedTouch);
    event = {clientX: 150, clientY: 173};
    actual = getCurrentPointFromEvent(event);
    expect(actual).toEqual(expectedMouse);
    targetTouches = [];
    event = {clientX: 150, clientY: 173, targetTouches};
    actual = getCurrentPointFromEvent(event);
    expect(actual).toEqual(expectedMouse);

  });

  it('should be empty if null', () => {


    expect(getOptionsOrEmpty(null)).toEqual({});
  });
  it('adjustAngleRadianDifference should subtract if divided by 4 leads to zero', () => {


    expect(adjustAngleRadianDifference(-3, 1)).toEqual(-1.75);
    expect(adjustAngleRadianDifference(0, 4)).toEqual(1);
  });


  it('should be empty if item is null', () => {


    expect(getItemTitle(null)).toEqual('');
  });
  it('clone should return', () => {

    const obj = {name: 'Mr x'};
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
describe('trignometry tests', () => {

  it('getLargeArcFlag should return 1 if the difference of endAngle and Start Angle Less Than 180', () => {


    expect(getLargeArcFlag(100, 300)).toEqual('1');
  });
});

describe('textelement tests', () => {

  it('getLargeArcFlag should return 1 if the difference of endAngle and Start Angle Less Than 180', () => {


    expect(getLargeArcFlag(100, 300)).toEqual('1');
  });
  it('getTextForAngle should return valid value ', () => {


    expect(getTextForAngle('yes sir', 2, 16)).toEqual('..');
    expect(getTextForAngle('yes sir', 2, 19)).toEqual('..');
  });
  it('writeTextOnArc should not set href if path is not empty ', () => {


    let result: any = writeTextOnArc({});

    expect(result).not.toBeNull();
    result = writeTextOnArc({pathId: 'somepath'});

    expect(result).not.toBeNull();
  });
});
describe('angle tests', () => {

  it('calling getAllAnglesBasedOnChild with items of no child nodes should not set children angles', () => {

    const allAngles = getAllAnglesBasedOnChild(itemsWithNoChildren);
    const childCount = allAngles.filter(currentItem => !!currentItem.children).length;
    expect(childCount).toEqual(0);


  });
  it('calling getAllAnglesBasedOnParent with items of no child nodes should not set children angles', () => {

    const allAngles = getAllAnglesBasedOnParent(itemsWithNoChildren);
    const childCount = allAngles.filter(currentItem => !!currentItem.children).length;
    expect(childCount).toEqual(0);


  });
});
