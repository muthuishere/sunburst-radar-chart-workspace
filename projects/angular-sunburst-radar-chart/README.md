# Angular Sunburst Radar Chart

A Sunburst chart component in Angular developed using no dependencies, offCourse used SVG



[Chart Demo](https://muthuishere.github.io/sunburst-radar-chart-workspace/)

To Use 

Import AngularSunburstRadarChartModule  to your module .

```
 imports: [
    ... Other modules
    AngularSunburstRadarChartModule
  ],

```
in your component.ts
 ```
  const items = [{      name: 'Delaware ',    color: '#b24bb7',    value: 100,           children: [{          name: 'Kent County',          value: 100        },{          name: 'New Castle County',          value: 100        },{          name: 'Sussex County',          value: 100        }]},
      {      name: 'Hawaii ',      value: 95,         color: '#3bb54a',       children: [{          name: 'Hawaii County',          value: 95        },{          name: 'Honolulu County',          value: 95        },{          name: 'Kauai County',          value: 95        },{          name: 'Maui County',          value: 95        }]},
      {      name: 'District of Columbia ',     color: '#6351a2',    value: 89,           children: [{          name: 'District of Columbia',          value: 83        },{          name: 'Ward 2',          value: 79        },{          name: 'Ward 3',          value: 84        },{          name: 'Ward 4',          value: 88        },{          name: 'Ward 5',          value: 94        },{          name: 'Ward 6',          value: 95        },{          name: 'Ward 7',          value: 94        },{          name: 'Ward 8',          value: 92        }]},
      {      name: 'Arizona ',      value: 98,     color: '#F351a2',         children: [{          name: 'Navajo County',          value: 99        },{          name: 'Maricopa County',          value: 95        },{          name: 'Mohave County',          value: 99        }]}
      ]
```


in your component.html
```
<lib-sunburst-radar-chart animateChart="true" size="800" [maxScore]="100" [items]="items"></lib-sunburst-radar-chart>

```

The above will display chart something like below


![SunBurst Radar Chart Output ](https://raw.githubusercontent.com/muthuishere/sunburst-radar-chart-workspace/main/projects/angular-sunburst-radar-chart/sample.JPG)




|Parameter|Data Type|Description|
|--- |--- |--- |
|items|Array|List of items to be displayed on chart in Array format of type Item |
|size|number|Size of chart|
|animateChart|boolean|Animate the chart while showing|
|maxScore|number|Maximum score on axis|

Item Data Type
```
Item -{
           name:string
          value:number,
          color:HexCode String
           children: Item[]
  } 
  
```



If you find it useful, try considering

<a href="https://www.buymeacoffee.com/muthuishere" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>




