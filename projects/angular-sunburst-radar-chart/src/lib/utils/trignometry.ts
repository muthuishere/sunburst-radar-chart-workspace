export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {

  const adjustedViewPortAngle = (angleInDegrees - 90);
  const angleInRadians = adjustedViewPortAngle * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export function getLargeArcFlag(startAngle, endAngle) {


  return (endAngle - startAngle) <= 180 ? '0' : '1';
}

export function distanceBetweenTwoPoints(centerX, centerY, radius, startAngle, endAngle) {

  const startPoint = polarToCartesian(centerX, centerY, radius, startAngle);
  const endPoint = polarToCartesian(centerX, centerY, radius, endAngle);


  const distFromStartToEnd = Math.sqrt(Math.pow((startPoint.x - endPoint.x), 2) + Math.pow((startPoint.y - endPoint.y), 2));
  return Math.abs(distFromStartToEnd);


}

export function calculateAngleRadian({x, y, centerX, centerY, maxRad}) {

  let angleInRadian = Math.atan2(x - centerY, y - centerX);

  angleInRadian = adjustAngleRadianDifference(angleInRadian, maxRad);

  return angleInRadian;

}

export function adjustAngleRadianDifference(input, maxRad) {
  let angleInRadian = input;
  angleInRadian += maxRad / 4;

  if (angleInRadian < 0) {
    angleInRadian += maxRad;

  }
  return angleInRadian;
}


