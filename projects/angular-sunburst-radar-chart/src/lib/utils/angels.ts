//Not Used now ,Might Use later
import {polarToCartesian} from './trignometry';

// function anglesBasedOnPercentage(items) {
//
//   const total = items.reduce((prevValue, curValue) => prevValue +
//curValue, 0);
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

function getInitialPosition(startLocation, totalDegrees, num) {


  const perLocation = totalDegrees / num;
  const middleLocation = perLocation / 2;
  const startMiddle = startLocation + middleLocation;

  return {startLocation, perLocation, middleLocation, startMiddle};


}

function getDegreeForIndexBasedOnSplitAngle(index, data) {


  const {perLocation, middleLocation, startMiddle, startLocation} = data;
  let position = index;// + 1;


  const startDegree = startLocation + (position * perLocation);
  const middleDegree = startMiddle + (position * perLocation);
  const endDegree = startLocation + (position * perLocation) + perLocation;


  return {startDegree, middleDegree, endDegree};

}

export function getAllAnglesBasedOnChild(items) {

  const num = items.length;
  const results = [];


  const totalChildren = items.filter(item => item.children).map(item => item.children.length).reduce(((a, b) => a + b),0);

  const childAngleDifference = 360 / totalChildren;

  let currentStartLocation = 0;
  for (let i = 0; i < items.length; i++) {

    const item = items[i];
    const childCount = item.children ? item.children.length : 0;
    const totalDegrees = childCount * childAngleDifference;


    const endDegree = currentStartLocation + (childCount * childAngleDifference);

    const middleDegree = (endDegree - currentStartLocation) / 2;


    const currentItem = {};
    currentItem['item'] = item;
    currentItem['startDegree'] = currentStartLocation;
    currentItem['middleDegree'] = middleDegree;
    currentItem['endDegree'] = endDegree;

    if (childCount > 0) {


      currentItem['children'] = iterateChildrenAndSetAngles({children: item.children, currentItem, angleDifference: totalDegrees});

    }

    currentStartLocation = currentStartLocation + (childCount * childAngleDifference);
    results.push(currentItem);
  }


  return results;
}

export function getAllAnglesBasedOnParent(items) {

  const num = items.length;
  let results = [];
  let angleDifference = 360 / num;

  const data = getInitialPosition(0, 360, num);


  for (let i = 0; i < items.length; i++) {

    const
      {startDegree, middleDegree, endDegree} = getDegreeForIndexBasedOnSplitAngle(i, data);


    const item = items[i];
    const currentItem = {};
    currentItem['item'] = item;
    currentItem['startDegree'] = startDegree;
    currentItem['middleDegree'] = middleDegree;
    currentItem['endDegree'] = endDegree;

    const hasChildren = items.filter(item => !!item.children).length > 0;
    if (hasChildren) {


      currentItem['children'] = iterateChildrenAndSetAngles({children: item.children, currentItem, angleDifference});

    }

    results.push(currentItem);
  }


  return results;
}


function iterateChildrenAndSetAngles({children, currentItem, angleDifference}) {


  const count = children.length;

  const childItems = [];
  const data = getInitialPosition(currentItem['startDegree'], angleDifference, count);


  for (let j = 0; j < count; j++) {
    const childItem = {};


    childItem['item'] = children[j];


    const
      {startDegree, middleDegree, endDegree} = getDegreeForIndexBasedOnSplitAngle(j, data);


    childItem['startDegree'] = startDegree;
    childItem['middleDegree'] = middleDegree;
    childItem['endDegree'] = endDegree;

    childItems.push(childItem);
  }


  return childItems;


}


export function positionsOnAngles(centerX, centerY, radius, angels) {

  const results = [];
  for (let i = 0; i < angels.length; i++) {

    const degreeToBeDrawn = angels[i];
    results.push(polarToCartesian(centerX, centerY, radius, degreeToBeDrawn));

  }
  return results;
}


export function
getPointsOnCircleAtAngels(centerX, centerY, radius, angels) {

  const results = [];
  for (let i = 0; i < angels.length; i++) {

    const degreeToBeDrawn = angels[i];
    results.push(polarToCartesian(centerX, centerY, radius, degreeToBeDrawn));

  }
  return results;
}
