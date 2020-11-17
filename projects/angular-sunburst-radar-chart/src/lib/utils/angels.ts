//Not Used now ,Might Use later
import {polarToCartesian} from './trignometry';

// function anglesBasedOnPercentage(items) {
//
//   const total = items.reduce((prevValue, curValue) => prevValue + curValue, 0);
//   if (Math.round(total) != 100) {
//     console.error('Cannnot draw as the sum of values should be 100');
//     throw new Error('Cannnot draw as the sum of values should be 100');
//   }
//   let prevDegree = 0;
//   const results = [];
//   for (let i = 0; i < items.length; i++) {
//
//     const item = items[i];
//     const currentDegree = item * 3.6;
//
//     const degreeToBeDrawn = currentDegree + prevDegree;
//     results.push(degreeToBeDrawn);
//     prevDegree = prevDegree + currentDegree;
//   }
//
//
//   return results;
// }
//

export function splitCircleToAngles(num) {

  const perLocation = 360 / num;
  const middleLocation = perLocation / 2;
  const startMiddle = middleLocation;

  const angles = [];
  const middleAngles = [];
  for (let i = 1; i <= num; i++) {

    const currentDegree = i * perLocation;
    const middleDegree = startMiddle + (i * perLocation);
    angles.push(currentDegree);
    middleAngles.push(middleDegree);
  }
  //return angles;
  return {angles, middleAngles};


}

export function positionsOnAngles(centerX, centerY, radius, angels) {

  const results = [];
  for (let i = 0; i < angels.length; i++) {

    const degreeToBeDrawn = angels[i];
    results.push(polarToCartesian(centerX, centerY, radius, degreeToBeDrawn));

  }
  return results;
}

export function splitAngles(num, totalDegrees, startDegree) {

  const perLocation = totalDegrees / num;
  const middleLocation = perLocation / 2;

  const startMiddle = startDegree + middleLocation;

  const angles = [startDegree];
  const middleAngles = [startMiddle];
  for (let i = 1; i < num; i++) {

    const currentDegree = startDegree + (i * perLocation);
    const middleDegree = startMiddle + (i * perLocation);
    angles.push(currentDegree);
    middleAngles.push(middleDegree);
  }
  return {angles, middleAngles};


}

export function getPointsOnCircleAtAngels(centerX, centerY, radius, angels) {

  const results = []
  for (let i = 0; i < angels.length; i++) {

    const degreeToBeDrawn = angels[i]
    results.push(polarToCartesian(centerX, centerY, radius, degreeToBeDrawn))

  }
  return results;
}
