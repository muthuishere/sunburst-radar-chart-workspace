export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {

  const adjustedViewPortAngle = (angleInDegrees - 90);
  const angleInRadians = adjustedViewPortAngle * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}



