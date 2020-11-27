
export function createSvgHandlerWithSelector(selectorName, center) {
  const svg = document.querySelector(selectorName);
  const pt = svg.createSVGPoint();


  const maxRad = 6.283185307179586;
  const maxDeg = 360;


  return {

    initPoint: 0,
    cursorPoint(evt) {
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());

    },
    startDrag(evt, initialPoint) {
      this.previousPoint = this.angleFromCenter(evt);
      this.initPoint = initialPoint;
    },
    getRotationAngle(evt) {
      const currentPoint = this.angleFromCenter(evt);

      const difference = Math.abs(this.previousPoint - currentPoint);
      if (currentPoint < this.previousPoint) {
        this.initPoint += difference;
      } else {
        this.initPoint -= difference;
      }
      this.previousPoint = currentPoint;

      return this.initPoint;

    },

    angleFromCenter(evt) {

      const [centerX, centerY] = [center.x, center.y];
      const {x, y} = this.cursorPoint(evt);

      let angleInRadian = Math.atan2(x - centerY, y - centerX);

      angleInRadian += maxRad / 4;
      if (angleInRadian < 0) {
        angleInRadian += maxRad;
      }

      const currentDegree = maxDeg * angleInRadian / (2 * Math.PI);
      return currentDegree;

    }
  };
}
