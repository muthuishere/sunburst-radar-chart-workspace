import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AngularSunburstRadarChartComponent} from './angular-sunburst-radar-chart.component';

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
  it('Long things should generate', () => {
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


  });

  it('No color should generate random', () => {
    expect(component).toBeTruthy();

    const items = [{      name: 'Delaware ',    color: '#b24bb7',    value: 100,           children: [{          name: 'Kent County',          value: 100        },{          name: 'New Castle County',          value: 100        },{          name: 'Sussex County',          value: 100        }]},
      {      name: 'Hawaii ',      value: 95,         color: '#3bb54a',       children: [{          name: 'Hawaii County',          value: 95        },{          name: 'Honolulu County',          value: 95        },{          name: 'Kauai County',          value: 95        },{          name: 'Maui County',          value: 95        }]},
      {      name: 'District of Columbia ',     color: '#6351a2',    value: 89,           children: [{          name: 'District of Columbia',          value: 83        },{          name: 'Ward 2',          value: 79        },{          name: 'Ward 3',          value: 84        },{          name: 'Ward 4',          value: 88        },{          name: 'Ward 5',          value: 94        },{          name: 'Ward 6',          value: 95        },{          name: 'Ward 7',          value: 94        },{          name: 'Ward 8',          value: 92        }]},
      {      name: 'Arizona ',      value: 98,     color: '#F351a2',         children: [{          name: 'Navajo County',          value: 99        },{          name: 'Maricopa County',          value: 95        },{          name: 'Mohave County',          value: 99        }]}
      ]




      component.size = 800;
    component.items = items;
    component.maxScore = 100;
    component.ngOnInit();
    fixture.detectChanges();


  });
});
