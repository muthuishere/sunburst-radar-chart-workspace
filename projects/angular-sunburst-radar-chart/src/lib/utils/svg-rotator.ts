import {getCurrentPointFromEvent} from './utils';
import {calculateAngleRadian} from './trignometry';

export function createSvgHandlerWithSelector(selectorName, center) {
  const svg = document.querySelector(selectorName);
  const pt = svg.createSVGPoint();


  const maxRad = 6.283185307179586;
  const maxDeg = 360;


  return {

    initPoint: 0,


    cursorPoint(evt) {
      const {x, y} = getCurrentPointFromEvent(evt);
      pt.x = x;
      pt.y = y;
      return pt.matrixTransform(svg.getScreenCTM().inverse());

    },
    startDrag(evt, initialPoint) {
      this.previousPoint = this.angleFromCenter(evt);
      this.initPoint = initialPoint;
    },
    updateInitPointFromCurrentPoint(currentPoint) {

      const difference = Math.abs(this.previousPoint - currentPoint);
      if (currentPoint < this.previousPoint) {
        this.initPoint += difference;
      } else {
        this.initPoint -= difference;
      }

    },
    getRotationAngle(evt) {
      const currentPoint = this.angleFromCenter(evt);

      this.updateInitPointFromCurrentPoint(currentPoint);
      this.previousPoint = currentPoint;

      return this.initPoint;

    },

    angleFromCenter(evt) {

      const [centerX, centerY] = [center.x, center.y];
      const {x, y} = this.cursorPoint(evt);

      const angleInRadian = calculateAngleRadian({x, y, centerX, centerY, maxRad});
      const currentDegree = maxDeg * angleInRadian / (2 * Math.PI);
      return currentDegree;

    }
  };
}
