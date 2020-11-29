import {polarToCartesian} from './trignometry';

export interface Point {
  x: number;
  y: number;
}

export interface GlobalPosition {
  innerRadius;
  innerRadiusBorder;
  innerTextRadius;
  middleRadius;
  middleTextRadius;
  middleRadiusBorder;
  outerRadius;
  outerRadiusBorder;
  outerTextRadius;
  textSize;
  outerTextSize;
  levels;
  center: Point;
}

function getRadiusForBorderAndText(radius, borderHeight) {
  const borderRadius = radius + borderHeight;
  const textRadius = radius + ((borderRadius - radius) / 2);

  return [borderRadius, textRadius];

}


export function getMaxDepth(items, currentLevel = 0) {

  let depths=[];
  if (items && items.length > 0) {
    const nextLevel = currentLevel + 1;
    depths = items
      .filter(item => !!item.children)
      .filter(item => item.children.length > 0)
      .map(item => getMaxDepth(item.children, nextLevel));


  }

  return depths.length !== 0 ? Math.max(...depths) : currentLevel;


}

export function getGlobalPositions({size, maxScore, items}) {


  const center: Point = {x: size / 2, y: size / 2};
  const maxDepth = getMaxDepth(items);

  const totalLevels = maxDepth + 1;

  const innerCircleRadius = Math.abs(size / 5.33);


  const totalRadiusToBeDrawn = 2 * Math.abs(size / 5.33);
  const borderHeight = 0.0375 * size;

  const everyLevelRadius = totalRadiusToBeDrawn / totalLevels;

  const levels = [];
  for (let i = 1; i <= totalLevels; i++) {

    const startRadius = i * everyLevelRadius;
    const [endRadius, textRadius] = getRadiusForBorderAndText(startRadius, borderHeight);
    levels.push({startRadius, endRadius, textRadius});


  }
  const innerRadius = innerCircleRadius;
  const [innerRadiusBorder, innerTextRadius] = getRadiusForBorderAndText(innerRadius, borderHeight);

  const middleRadius = innerCircleRadius * 2;
  const [middleRadiusBorder, middleTextRadius] = getRadiusForBorderAndText(middleRadius, borderHeight);

  const outerRadius = middleRadius + borderHeight;
  const [outerRadiusBorder, outerTextRadius] = getRadiusForBorderAndText(outerRadius, borderHeight * 2);

  const textSize = 0.0175 * size;
  const outerTextSize = 0.0225 * size;

  const result = {
    textSize,
    outerTextSize,
    levels,
    innerRadius,
    innerRadiusBorder,
    innerTextRadius,
    middleRadius,
    middleTextRadius,
    middleRadiusBorder,
    outerRadius,
    outerRadiusBorder,
    outerTextRadius,
    center
  };

  return result;
}


export function calculatePointBetween({centerX, centerY, startAngle, middleAngle, endAngle, radius}) {



  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const middle = polarToCartesian(centerX, centerY, radius, middleAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);

  return {start, middle, end};

}
