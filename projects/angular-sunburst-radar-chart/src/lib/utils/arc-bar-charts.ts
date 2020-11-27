import {getLargeArcFlag, polarToCartesian} from './trignometry';
import {convertToPercentage} from './math';
import {createPath, createPathForBar} from './elements';
import {getItemTitle} from './utils';
import {Point} from './positions';

export function createOuterChartBarWithInArc({item, startAngle, endAngle, middleAngle, color, middleRadius,maxScore, innerRadiusBorder, center}) {


  const [centerX, centerY] = [center.x, center.y];


  const currentVal = item.value;


  const totalRadiusInside = middleRadius - innerRadiusBorder;

  const innerRadius = convertToPercentage({plotMax: totalRadiusInside, actualScore: currentVal, maxScore});
  const radiusFromCenter = innerRadius + innerRadiusBorder;


  const firstPoint = polarToCartesian(centerX, centerY, radiusFromCenter, startAngle);
  const secondPoint = polarToCartesian(centerX, centerY, radiusFromCenter, endAngle);


  const startPoint = polarToCartesian(centerX, centerY, innerRadiusBorder, startAngle);
  const endPoint = polarToCartesian(centerX, centerY, innerRadiusBorder, endAngle);


  const startMiddlePoint = polarToCartesian(centerX, centerY, innerRadiusBorder, middleAngle);

  const distFromStartToFirst = Math.sqrt(Math.pow((startPoint.x - firstPoint.x), 2) + Math.pow((startPoint.y - firstPoint.y), 2));
  const distFromStartToSecond = Math.sqrt(Math.pow((startPoint.x - secondPoint.x), 2) + Math.pow((startPoint.y - secondPoint.y), 2));


  const {updatedFirstPoint, updatedSecondPoint} = getUpdatedPoints(firstPoint, secondPoint, distFromStartToFirst, distFromStartToSecond);


  const d = getDrawPositions(updatedFirstPoint, middleRadius, updatedSecondPoint, endPoint, startMiddlePoint, startPoint);


  const title = getItemTitle(item);

  return createPathForBar({d: d.join(' '), stroke: 'none', fill: color,"fill-opacity":'0.5', title});

}
function getDrawPositions(firstPoint: { x: any; y: any }, middleRadius, secondPoint: { x: any; y: any }, endPoint: { x: any; y: any }, startMiddlePoint: { x: any; y: any }, startPoint: { x: any; y: any }) {
  const d = [

    'M', firstPoint.x, firstPoint.y,
    'A', middleRadius, middleRadius, 0, 0, 1, secondPoint.x, secondPoint.y,
    'L', endPoint.x, endPoint.y,
    'C', endPoint.x, endPoint.y, startMiddlePoint.x, startMiddlePoint.y, startPoint.x, startPoint.y,
    'L', firstPoint.x, firstPoint.y,
    'Z'


  ];
  return d;
}


export function getUpdatedPoints(firstPoint: Point, secondPoint: Point, distFromStartToFirst, distFromStartToSecond) {

  let [updatedFirstPoint, updatedSecondPoint] = [firstPoint, secondPoint];

  if (distFromStartToSecond < distFromStartToFirst) {
    updatedSecondPoint = firstPoint;
    updatedFirstPoint = secondPoint;


  }
  return {updatedSecondPoint, updatedFirstPoint};
}

export function createInnerChartBarWithInArc({startPoint, item, radius, startAngle, endAngle,maxScore}) {

  const [centerX, centerY] = [startPoint.x, startPoint.y];

  const currentVal = item.value;
  const color = item.color;
  const arcRadius = convertToPercentage({plotMax: radius, actualScore: currentVal,maxScore});


  const start = polarToCartesian(centerX, centerY, arcRadius, endAngle);
  const end = polarToCartesian(centerX, centerY, arcRadius, startAngle);

  const largeArcFlag = getLargeArcFlag(startAngle,endAngle)
  //const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', centerX, centerY,
    'L', start.x, start.y,
    'A', arcRadius, arcRadius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');


  const title = getItemTitle(item);


  const arcForInnerChart = createPathForBar({d, fill: color, title});

  return arcForInnerChart;
}
