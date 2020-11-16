import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {createCircle, createLine, createPath} from './utils/elements';
import {createArcToWriteText, writeTextOnArc} from './utils/textelement';
import {createBarWithInArc} from './utils/inner-bar';
import {getGlobalPositions, GlobalPosition, Point} from './utils/positions';
import {polarToCartesian} from './utils/trignometry';
import {createLegends, createLegendWithOptions} from './utils/legend';
import {generateRandomColor, hashCode} from './utils/utils';
import {getPointsOnCircleAtAngels, positionsOnAngles, splitAngles, splitCircleToAngles} from './utils/angels';
import {convertToPercentage} from './utils/math';
import {AngularSvgElement} from './utils/models';


@Component({
  selector: 'lib-sunburst-radar-chart',
  templateUrl: './angular-sunburst-radar-chart.component.html',
  styles: []
})
export class AngularSunburstRadarChartComponent implements OnInit, OnChanges {

  @Input()
  size: number;

  @Input()
  items;

  @Input()
  maxScore: number;

  @Input()
  animateChart;

  viewBox;

  initialized = false;
  innerCircleRadius;

  innerBorderHeight = 30;
  outerBorderHeight = 30;


  elements: AngularSvgElement[] = [];
  globalPosition: GlobalPosition;
  hasChildren = false;
  chartBorder;
  outerBorderCircleRef = 'outerBorderCircle';


  constructor() {
  }


  appendToSvg(element: AngularSvgElement) {

    this.elements.push(element);
  }


  insertAdjacentToSvg(refName, elementToBeInserted: AngularSvgElement) {

    let changeIndex = -1;
    for (let i = 0; i < this.elements.length; i++) {

      const element = this.elements[i];
      if (element.options.ref && element.options.ref === refName) {
        changeIndex = i + 1;
        break;
      }
    }

    if (changeIndex !== -1) {
      // console.log('inserting on ' + changeIndex);
      this.elements.splice(changeIndex, 0, elementToBeInserted);
    } else {
      throw new Error('Invalid Ref name');
    }

  }


  ngOnChanges(changes: SimpleChanges) {


    console.log("changes",changes)
    const isFirstChange = Object.values(changes).some(c => c.isFirstChange());

    if (!isFirstChange) {

      this.initialize();
    }


  }

  ngOnInit(): void {
    this.initialize();
  }


  initialize(): void {

    if (!this.size || !this.items) {

      return;
    }
    this.initialized = false;
    console.log('animation', this.animateChart);

    this.viewBox = '0 0 ' + this.size + ' ' + this.size;


    this.innerCircleRadius = Math.abs(this.size / 5.33);

    this.innerBorderHeight = this.innerCircleRadius / 5;
    this.outerBorderHeight = this.innerCircleRadius / 5;

    this.globalPosition = getGlobalPositions({
      size: this.size,
      maxScore: this.maxScore,
      items: this.items

    });

    this.hasChildren = this.items.find(item => !!item.children) !== null;


    this.drawLayout();


    const {innerRadius, innerTextRadius, textSize, outerTextSize, outerRadiusBorder, outerTextRadius, center} = this.globalPosition;
    const [centerX, centerY] = [center.x, center.y];

    const items = this.items;
    const hasChildren = this.hasChildren;
    let angles;
    angles = splitCircleToAngles(items.length);

    let angleDifference = 0;
    if (angles.length > 1) {
      angleDifference = angles[1] - angles[0];
    }

    const points = positionsOnAngles(centerX, centerY, this.chartBorder, angles);

    const lines = [];

    let elements = [];
    let nextLevelElements = [];


    for (let i = 0; i < points.length; i++) {

      const {x, y} = points[i];

      let endAngleIndex = i + 1;
      if (endAngleIndex >= points.length) {
        endAngleIndex = 0;
      }


      const endAngle = angles[endAngleIndex];
      const startAngle = angles[i];
      let item = items[i];


      if (!!item.color === false) {


        const defaults = {
          color: generateRandomColor()
        };
        item = {...defaults, ...item};

      }


      if (item.children && item.children.length > 0) {


        nextLevelElements = nextLevelElements.concat(this.drawOnLevel({
          items: item.children,
          totalDegrees: angleDifference,
          startDegree: startAngle,
          endDegree: endAngle,
          color: item.color
        }));

      }


      lines.push(createLine({x1: centerX, y1: centerY, x2: x, y2: y, width: 2}));


      // Create Arc for inner values
      const barWithinArc = createBarWithInArc({
        startPoint: center,
        item,
        radius: innerRadius,
        startAngle,
        endAngle,
        maxScore: this.maxScore
      });
      elements.push(barWithinArc);

      // Set Background for Outer Stuff
      if (hasChildren) {
        this.drawOuterBackground(item, center, outerRadiusBorder, startAngle, endAngle);
      }


      // Write Text for Inner Values


      const innerTextElements = this.addArcText({
        arcForTextId: 'arc-text-inner' + this.getUniqueCode() + '-' + i,
        radius: innerTextRadius,
        fontSize: textSize,
        startAngle,
        endAngle,
        item
      });
      elements = elements.concat(innerTextElements);


      if (hasChildren) {

        const outerBackgroundTextElements = this.addArcText(
          {
            arcForTextId: 'arc-text-outer' + this.getUniqueCode() + '-' + i,
            radius: outerTextRadius,
            fontSize: outerTextSize,
            startAngle,
            endAngle,
            item
          });
        elements = elements.concat(outerBackgroundTextElements);
      }


    }


    nextLevelElements.forEach(line => {
      this.appendToSvg(line);

    });


    this.drawInnerBorders();


    elements.forEach(line => {
      this.appendToSvg(line);

    });

    lines.forEach(line => {
      this.appendToSvg(line);

    });


    this.drawLegends(angles[0]);
    this.addSmallCirclesAtCenter(centerX, centerY);

   this.initialized = true;
  }


  createLevelChartWith({item, startAngle, endAngle, middleAngle, color, index}) {

    const {middleRadius, innerRadiusBorder, center} = this.globalPosition;

    const [centerX, centerY] = [center.x, center.y];


    if (startAngle >= 360) {
      startAngle = startAngle % 360;
    }
    if (endAngle >= 360) {
      endAngle = endAngle % 360;
    }


    if (middleAngle >= 360) {
      middleAngle = middleAngle % 360;
    }


    const currentVal = item.value;


    const totalRadiusInside = middleRadius - innerRadiusBorder;

    const innerRadius = convertToPercentage({plotMax: totalRadiusInside, actualScore: currentVal, maxScore: this.maxScore});
    const radiusFromCenter = innerRadius + innerRadiusBorder;


    let firstPoint = polarToCartesian(centerX, centerY, radiusFromCenter, startAngle);
    let secondPoint = polarToCartesian(centerX, centerY, radiusFromCenter, endAngle);


    const startPoint = polarToCartesian(centerX, centerY, innerRadiusBorder, startAngle);
    const endPoint = polarToCartesian(centerX, centerY, innerRadiusBorder, endAngle);


    const startMiddlePoint = polarToCartesian(centerX, centerY, innerRadiusBorder, middleAngle);


    const distFromStartToFirst = Math.sqrt(Math.pow((startPoint.x - firstPoint.x), 2) + Math.pow((startPoint.y - firstPoint.y), 2));
    const distFromStartToSecond = Math.sqrt(Math.pow((startPoint.x - secondPoint.x), 2) + Math.pow((startPoint.y - secondPoint.y), 2));

    if (distFromStartToSecond < distFromStartToFirst) {
      const temp = firstPoint;
      firstPoint = secondPoint;
      secondPoint = temp;

    }


    const incFactor = 0;


    const d = [

      'M', firstPoint.x, firstPoint.y,
      'A', middleRadius, middleRadius, 0, 0, 1, secondPoint.x, secondPoint.y,
      'L', endPoint.x, endPoint.y,
      'C', endPoint.x, endPoint.y, startMiddlePoint.x + incFactor, startMiddlePoint.y + incFactor, startPoint.x, startPoint.y,
      'L', firstPoint.x, firstPoint.y,
      'Z'


    ];


    const title = item.name + '-' + item.value;

    return createPath({d: d.join(' '), stroke: 'none', fill: color, title});
  }


  drawOnLevel({items, totalDegrees, startDegree, endDegree, color}) {


    const {innerRadiusBorder, middleRadius, textSize, middleTextRadius, center} = this.globalPosition;
    const [centerX, centerY] = [center.x, center.y];


    const {angles, middleAngles} = splitAngles(items.length, totalDegrees, startDegree);

    const perAngle = totalDegrees / items.length;

    const pointsOnInnerRadiusBorder = getPointsOnCircleAtAngels(centerX, centerY, innerRadiusBorder, angles);


    const pointsOnMiddle = getPointsOnCircleAtAngels(centerX, centerY, middleRadius, angles);


    let elements = [];
    const lines = [];


    let currentDegree = startDegree;

    for (let i = 0; i < pointsOnInnerRadiusBorder.length; i++) {

      const pointOnInnerRadiusBorder = pointsOnInnerRadiusBorder[i];
      const pointOnMiddle = pointsOnMiddle[i];


      lines.push(createLine({
        x1: pointOnInnerRadiusBorder.x, y1: pointOnInnerRadiusBorder.y,
        x2: pointOnMiddle.x, y2: pointOnMiddle.y, width: 2
      }));


      const endAngleIndex = i + 1;
      let endAngle;
      const startAngle = angles[i];
      const middleAngle = middleAngles[i];
      if (endAngleIndex >= pointsOnInnerRadiusBorder.length) {

        endAngle = endDegree;

      } else {
        endAngle = angles[endAngleIndex];
      }


      const item = items[i];


      const params = {startPoint: pointOnInnerRadiusBorder, item, startAngle, endAngle, middleAngle, color, index: i};

      const arcForChart = this.createLevelChartWith(params);

      elements.push(arcForChart);


      const middleTextElements = this.addArcText({
        arcForTextId: 'arc-text-middle' + this.getUniqueCode() + '-' + startAngle + i,
        radius: middleTextRadius,
        fontSize: textSize,
        startAngle,
        endAngle,
        item
      });

      elements = elements.concat(middleTextElements);


      currentDegree = currentDegree + perAngle;

    }


    lines.forEach(line => {
      elements.push(line);

    });


    return elements;

  }

  private getUniqueCode() {

    return hashCode(this.items) + '-' + this.size;

  }

  private drawInnerBorders() {

    const {innerRadius, innerRadiusBorder, center} = this.globalPosition;
    const [centerX, centerY] = [center.x, center.y];

    const innerContainer = createCircle({
      x: centerX,
      y: centerY,
      radius: innerRadius,
      fillColor: '#FFFFFF'
    });


    const innerBorderContainer = createCircle({
      x: centerX,
      y: centerY,
      radius: innerRadiusBorder,
      fillColor: '#FFFFFF'
    });

    this.appendToSvg(innerBorderContainer);
    this.appendToSvg(innerContainer);
  }

  private addSmallCirclesAtCenter(centerX: number, centerY: number) {

    const outerRadius = 0.0025 * 2* this.size;
    const innerRadius = 0.0005 *  2 * this.size;
    this.appendToSvg(createCircle({
      x: centerX,
      y: centerY,
      radius: outerRadius,
      fillColor: '#FFFFFF'
    }));

    this.appendToSvg(createCircle({
      x: centerX,
      y: centerY,
      radius: innerRadius,
      fillColor: '#FFFFFF'
    }));

  }

  private drawLegends(degreeToBeDrawn) {

    const {innerRadius, innerRadiusBorder, middleRadius, center} = this.globalPosition;


    const [centerX, centerY] = [center.x, center.y];
    const maxScore = this.maxScore;

    let legends = createLegends({startPoint: center, radius: innerRadius, degreeToBeDrawn, maxScore});


    const startFrom = polarToCartesian(centerX, centerY, innerRadiusBorder, degreeToBeDrawn);

    const nextLevelLegends = createLegendWithOptions({
      startPoint: startFrom,
      center,
      startRadius: innerRadiusBorder,
      endRadius: middleRadius,
      maxScore,
      degreeToBeDrawn
    });

    legends = legends.concat(nextLevelLegends);

    legends.forEach(elem => {
      this.appendToSvg(elem);
    });

  }

  private drawOuterBackground(item, center: Point, outerRadiusBorder, startAngle, endAngle) {
    const backgroundItem = {color: item.color, value: 100};
    const backgroundForOuterArc = createBarWithInArc({
      startPoint: center,
      item: backgroundItem,
      radius: outerRadiusBorder,
      maxScore: this.maxScore,
      startAngle,
      endAngle
    });

    this.insertAdjacentToSvg(this.outerBorderCircleRef, backgroundForOuterArc);
  }

  addArcText({arcForTextId, radius, startAngle, fontSize, endAngle, item}) {
    const elements = [];
    const {center} = this.globalPosition;
    const arcForText = createArcToWriteText({id: arcForTextId, startPoint: center, radius, startAngle, endAngle});
    elements.push(arcForText);
    elements.push(writeTextOnArc({text: item.name, pathId: arcForTextId, 'font-size': fontSize + 'px'}));
    return elements;
  }

  private drawLayout() {

    const {innerRadius, innerRadiusBorder, middleRadius, middleRadiusBorder, outerRadius, outerRadiusBorder, center} = this.globalPosition;

    const [centerX, centerY] = [center.x, center.y];


    let innerRadiusEnd = innerRadius;
    let innerRadiusBorderEnd = innerRadiusBorder;
    this.chartBorder = innerRadiusBorder;

    if (this.hasChildren) {

      const outerBorderCircle = createCircle({
        x: centerX,
        y: centerY,
        radius: outerRadiusBorder,
        fillColor: '#DE00AB',
        "stroke-width": '5',
        ref: this.outerBorderCircleRef

      });
      this.appendToSvg(outerBorderCircle);
      const outerCircle = createCircle({
        x: centerX,
        y: centerY,
        radius: outerRadius,
        fillColor: '#FFFFFF'
      });
      this.appendToSvg(outerCircle);

      innerRadiusEnd = middleRadius;
      innerRadiusBorderEnd = middleRadiusBorder;
      this.chartBorder = outerRadiusBorder;
    }

    this.appendToSvg(createCircle({x: centerX, y: centerY, radius: innerRadiusEnd}));
    this.appendToSvg(createCircle({x: centerX, y: centerY, radius: innerRadiusBorderEnd}));
  }

}
