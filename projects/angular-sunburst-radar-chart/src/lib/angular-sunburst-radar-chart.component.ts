import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {createCircle, createLine, createPath} from './utils/elements';
import {createArcToWriteText, getTextForAngle, writeTextOnArc} from './utils/textelement';
import {createInnerChartBarWithInArc, createOuterChartBarWithInArc} from './utils/arc-bar-charts';
import {calculatePointBetween, getGlobalPositions, GlobalPosition} from './utils/positions';
import {distanceBetweenTwoPoints, polarToCartesian} from './utils/trignometry';
import {createLegends, createLegendWithOptions} from './utils/legend';
import {formatItems, generateRandomColor, getFormattedAngle, getOptionsOrEmpty, hashCode} from './utils/utils';
import {getAllAnglesBasedOnChild, getAllAnglesBasedOnParent, getPointsOnCircleAtAngels, positionsOnAngles} from './utils/angels';
import {AngularSvgElement} from './utils/models';

import {createSvgHandlerWithSelector} from './utils/svg-rotator';



@Component({
  selector: 'lib-sunburst-radar-chart',
  templateUrl: './angular-sunburst-radar-chart.component.html',
  styleUrls: ['./angular-sunburst-radar-chart.component.scss']
})
export class AngularSunburstRadarChartComponent implements OnInit, OnChanges {


  constructor() {
  }


  showToolTip = false;
  tooltipTopInPx = '0px';
  tooltipLeftInPx = '0px';
  tooltipText = '';
  svgId = null;
  svgGroupId = null;

  svgHandler = null;

  currentRotationAngle = 10;
  rotationPoint;
  svgCursor='default';


  @Input()
  items;

  @Input()
  options;

  size: number;


  maxScore: number;

  legendAxisLinePosition: number;

  animateChart;

  splitBasedOnChildren;

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
  error: any = null;
  hasError = false;

  startRotation = false;

  showError(msg) {

    this.error = msg;
    this.hasError = true;
  }

  hideError() {

    this.error = null;
    this.hasError = false;
  }

  appendToSvg(element: AngularSvgElement) {

    this.elements.push(element);
  }


  ngOnChanges(changes: SimpleChanges) {


    this.hideError();
    const isFirstChange = Object.values(changes).some(c => c.isFirstChange());
    this.modifyOnFirstChange(isFirstChange);


  }

  modifyOnFirstChange(isFirstChange: boolean) {
    if (!isFirstChange) {

      this.initialize();
    }
  }

  ngOnInit(): void {
    this.hideError();
    this.initialize();
  }


  initialize(): void {


    const defaults = {size: 300, maxScore: 100, animateChart: true, splitBasedOnChildren: true, legendAxisLinePosition: 1};
    const options = {...defaults, ...(getOptionsOrEmpty(this.options))};

    this.size = options.size;
    this.maxScore = options.maxScore;
    this.animateChart = options.animateChart;
    this.splitBasedOnChildren = options.splitBasedOnChildren;
    this.legendAxisLinePosition = options.legendAxisLinePosition;


    if (!this.hasValidParameters()) {

      this.showError('Input Values not set or Items was improper');
      return;
    }
    this.initialized = false;
    this.svgId = 'svg' + hashCode(this.items);
    this.svgGroupId = 'svg-group' + hashCode(this.items);


    this.viewBox = '0 0 ' + this.size + ' ' + this.size;


    this.innerCircleRadius = Math.abs(this.size / 5.33);

    this.innerBorderHeight = this.innerCircleRadius / 5;
    this.outerBorderHeight = this.innerCircleRadius / 5;

    this.globalPosition = getGlobalPositions({
      size: this.size,
      maxScore: this.maxScore,
      items: this.items

    });

    this.hasChildren = this.items.filter(item => !!item.children).length > 0;


    this.drawLayout();


    const {innerRadius, innerTextRadius, textSize, outerTextSize, outerRadiusBorder, outerTextRadius, center} = this.globalPosition;
    const [centerX, centerY] = [center.x, center.y];

    let items = this.items;
    let allAngels = [];
    const hasChildren = this.hasChildren;

    if (this.splitBasedOnChildren) {

      // Cannot have no children
      items = formatItems(items);
      allAngels = getAllAnglesBasedOnChild(items);
    } else {
      allAngels = getAllAnglesBasedOnParent(items);
    }


    const angleDifference = 360 / items.length;

    const angles = allAngels.map(value => value.startDegree);
    const middleAngles = allAngels.map(value => value.middleDegree);
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
      const middleAngle = middleAngles[i];

      let item = items[i];


      if (!!item.color === false) {


        const colorDefaults = {
          color: generateRandomColor()
        };
        item = {...colorDefaults, ...item};

      }


      if (this.hasChildren && item.children && item.children.length > 0) {

        const childAngels = allAngels[i].children;


        nextLevelElements = nextLevelElements.concat(this.drawOnLevel({
          items: item.children,
          totalDegrees: angleDifference,
          childAngels,
          color: item.color
        }));

      }


      lines.push(createLine({x1: centerX, y1: centerY, x2: x, y2: y, width: 2}));


      // Create Arc for inner values
      const barWithinArc = createInnerChartBarWithInArc({
        startPoint: center,
        item,
        radius: innerRadius,
        startAngle,
        endAngle,
        maxScore: this.maxScore
      });
      elements.push(barWithinArc);


      const innerTextElements = this.addArcText({
        arcForTextId: 'arc-text-inner' + this.getUniqueCode() + '-' + i,
        radius: innerTextRadius,
        fontSize: textSize,
        startAngle,
        endAngle,
        perAngle: angleDifference,
        item
      });
      elements = elements.concat(innerTextElements);


      if (hasChildren) {

        elements.push(this.drawOuterBackgroundWithMiddle({item, startAngle, middleAngle, endAngle}));
        const outerBackgroundTextElements = this.addArcText(
          {
            arcForTextId: 'arc-text-outer' + this.getUniqueCode() + '-' + i,
            radius: outerTextRadius,
            fontSize: outerTextSize,
            perAngle: angleDifference,
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
    const legendAxisIndex = this.getLegendAxisIndex(angles);

    this.drawLegends(angles[legendAxisIndex]);
    this.addSmallCirclesAtCenter(centerX, centerY);

    this.initialized = true;


    this.currentRotationAngle = 10;
    this.rotationPoint = getFormattedAngle(this.currentRotationAngle, center);

  }


  getLegendAxisIndex(angles: any[]) {
    let legendAxisIndex = this.legendAxisLinePosition - 1;
    if (legendAxisIndex < 0 || legendAxisIndex >= angles.length) {
      legendAxisIndex = 0;
    }
    return legendAxisIndex;
  }

  hasValidParameters() {

    return this.items && this.items.length > 1;
  }


  drawOuterBackgroundWithMiddle({item, startAngle, middleAngle, endAngle}) {


    const color = item.color;

    const {outerTextRadius, center} = this.globalPosition;

    const [centerX, centerY] = [center.x, center.y];


    const middleCircle = calculatePointBetween({centerX, centerY, startAngle, middleAngle, endAngle, radius: outerTextRadius});


    const d = [

      'M', middleCircle.start.x, middleCircle.start.y,
      'A', outerTextRadius, outerTextRadius, 0, 0, 1, middleCircle.end.x, middleCircle.end.y


    ];

    const title = item.name + '-' + item.value;

    const strokeWidth = 0.0775 * this.size;
    return createPath({d: d.join(' '), stroke: color, 'stroke-width': strokeWidth, title});

  }


  drawOnLevel({items, totalDegrees, childAngels, color}) {


    const {innerRadiusBorder, middleRadius, textSize, middleTextRadius, center} = this.globalPosition;
    const [centerX, centerY] = [center.x, center.y];


    const angles = childAngels.map(item => item.startDegree);
    const middleAngles = childAngels.map(item => item.middleDegree);
    const endAngles = childAngels.map(item => item.endDegree);
    const perAngle = totalDegrees / items.length;

    const pointsOnInnerRadiusBorder = getPointsOnCircleAtAngels(centerX, centerY, innerRadiusBorder, angles);


    const pointsOnMiddle = getPointsOnCircleAtAngels(centerX, centerY, middleRadius, angles);


    let elements = [];
    const lines = [];


    let currentDegree = angles[0];

    for (let i = 0; i < pointsOnInnerRadiusBorder.length; i++) {

      const pointOnInnerRadiusBorder = pointsOnInnerRadiusBorder[i];
      const pointOnMiddle = pointsOnMiddle[i];


      lines.push(createLine({
        x1: pointOnInnerRadiusBorder.x, y1: pointOnInnerRadiusBorder.y,
        x2: pointOnMiddle.x, y2: pointOnMiddle.y, width: 0.5
      }));


      const startAngle = angles[i];
      const middleAngle = middleAngles[i];
      const endAngle = endAngles[i];


      const item = items[i];


      const params = {
        startPoint: pointOnInnerRadiusBorder,
        item,
        startAngle,
        endAngle,
        middleAngle,
        middleRadius,
        innerRadiusBorder,
        center,
        maxScore: this.maxScore,
        color,
        index: i
      };


      const arcForChart = createOuterChartBarWithInArc(params);

      elements.push(arcForChart);


      const middleTextElements = this.addArcText({
        arcForTextId: 'arc-text-middle' + this.getUniqueCode() + '-' + startAngle + i,
        radius: middleTextRadius,
        fontSize: textSize,
        perAngle,
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

  getUniqueCode() {

    return hashCode(this.items) + '-' + this.size;

  }

  drawInnerBorders() {

    const {innerRadius, innerRadiusBorder, center} = this.globalPosition;
    const [centerX, centerY] = [center.x, center.y];

    const innerContainer = createCircle({
      x: centerX,
      y: centerY,
      radius: innerRadius,
      fillColor: 'none'
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

  addSmallCirclesAtCenter(centerX: number, centerY: number) {

    const outerRadius = 0.0025 * 2 * this.size;
    const innerRadius = 0.0005 * 2 * this.size;
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

  drawLegends(degreeToBeDrawn) {

    const {innerRadius, innerRadiusBorder, middleRadius, center} = this.globalPosition;


    const [centerX, centerY] = [center.x, center.y];
    const maxScore = this.maxScore;

    let legends = createLegends({startPoint: center, radius: innerRadius, degreeToBeDrawn, maxScore});


    const startFrom = polarToCartesian(centerX, centerY, innerRadiusBorder, degreeToBeDrawn);

    if (this.hasChildren) {
      const nextLevelLegends = createLegendWithOptions({
        startPoint: startFrom,
        center,
        startRadius: innerRadiusBorder,
        endRadius: middleRadius,
        maxScore,
        degreeToBeDrawn
      });

      legends = legends.concat(nextLevelLegends);
    }
    legends.forEach(elem => {
      this.appendToSvg(elem);
    });

  }


  addArcText({arcForTextId, radius, startAngle, fontSize, endAngle, perAngle, item}) {
    const elements = [];
    const {center} = this.globalPosition;
    const [centerX, centerY] = [center.x, center.y];
    const arcForText = createArcToWriteText({id: arcForTextId, startPoint: center, radius, startAngle, endAngle});
    elements.push(arcForText);
    const distance = distanceBetweenTwoPoints(centerX, centerY, radius, startAngle, endAngle);


    const label = getTextForAngle(item.name, distance, fontSize);
    elements.push(writeTextOnArc({label, text: item.name, pathId: arcForTextId, 'font-size': fontSize + 'px'}));
    return elements;
  }

  drawLayout() {

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
        fillColor: 'none',
        'stroke-width': '5',
        ref: this.outerBorderCircleRef

      });
      this.appendToSvg(outerBorderCircle);
      const outerCircle = createCircle({
        x: centerX,
        y: centerY,
        radius: outerRadius,
        fillColor: 'none'
      });
      this.appendToSvg(outerCircle);

      innerRadiusEnd = middleRadius;
      innerRadiusBorderEnd = middleRadiusBorder;
      this.chartBorder = outerRadiusBorder;
    }

    this.appendToSvg(createCircle({x: centerX, y: centerY, radius: innerRadiusEnd}));
    this.appendToSvg(createCircle({x: centerX, y: centerY, radius: innerRadiusBorderEnd}));
  }

  hideTooltip() {
    this.showToolTip = false;
  }

  showTooltipText($event: any, text: any) {
    this.tooltipLeftInPx = $event.pageX + 10 + 'px';
    this.tooltipTopInPx = $event.pageY + 10 + 'px';
    this.tooltipText = text;

    this.showToolTip = true;


  }



  stopRotate() {
    this.svgCursor="default"
    this.startRotation = false;
  }

  onOutOfComponent() {

    this.hideTooltip();
    this.stopRotate();
  }


  startRotate($event: MouseEvent) {

    this.startRotation = true;
    this.svgCursor="grab"
    const {outerRadiusBorder, center} = this.globalPosition;

    this.svgHandler = createSvgHandlerWithSelector('#' + this.svgId, center);
    this.svgHandler.startDrag($event, this.currentRotationAngle);

    $event.preventDefault();

  }


  rotateChart($event: MouseEvent) {



    if (this.startRotation == false) {
      return;
    }
    this.svgCursor="grabbing"
    const {center} = this.globalPosition;

    this.currentRotationAngle = this.svgHandler.getRotationAngle($event);


    this.rotationPoint = getFormattedAngle(Math.round(this.currentRotationAngle), center);


  }

}
