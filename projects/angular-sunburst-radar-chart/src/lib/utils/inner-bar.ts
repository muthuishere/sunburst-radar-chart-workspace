import {polarToCartesian} from './trignometry';
import {convertToPercentage} from './math';
import {createPath} from './elements';

export function createBarWithInArc({startPoint, item, radius, startAngle, endAngle,maxScore}) {

  const [centerX, centerY] = [startPoint.x, startPoint.y];

  const currentVal = item.value;
  const color = item.color;
  const arcRadius = convertToPercentage({plotMax: radius, actualScore: currentVal,maxScore});


  const start = polarToCartesian(centerX, centerY, arcRadius, endAngle);
  const end = polarToCartesian(centerX, centerY, arcRadius, startAngle);


  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', centerX, centerY,
    'L', start.x, start.y,
    'A', arcRadius, arcRadius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');


  let title = '';

  if (item.name && item.value) {
    title = item.name + '-' + item.value;
  }

  const arcForInnerChart = createPath({d, fill: color, title});

  return arcForInnerChart;
}
