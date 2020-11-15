import {convertToPercentage} from './math';
import {polarToCartesian} from './trignometry';
import {createCircle} from './elements';
import {createText} from './textelement';


export function createLegendWithOptions({startPoint, center, startRadius, endRadius,  degreeToBeDrawn,maxScore}) {

  const [centerX, centerY] = [center.x, center.y];

  const actRadius = endRadius - startRadius;

  const axisIncrement = maxScore/4
  const legendRadius = convertToPercentage({plotMax: actRadius, actualScore: axisIncrement,maxScore});

  const smallCircleRadius=Math.round(0.083 *actRadius)
  const smallCircleFontSize=Math.round(0.067 *actRadius)

  const groups = [1, 2, 3]
    .map(val => {
      return {radius: val * legendRadius, content: val * axisIncrement};
    })
    .map(res => {

      const {radius, content} = res;
      const {x, y} = polarToCartesian(startPoint.x, startPoint.y, radius, degreeToBeDrawn);


      const circle = createCircle({
        x,
        y,
        radius: smallCircleRadius,
        'fillColor': '#000000'
      });
      const legendCircle = createCircle({
        x: centerX,
        y: centerY,
        radius: startRadius + radius,
        'stroke-dasharray': 4,
        'stroke-opacity': 0.3
      });



      const fontSize= smallCircleFontSize +"px"
      //console.log("font-size",fontSize)
      const text = createText({content, x, y, 'stroke': 'white', 'font-size': fontSize});

      return [circle, legendCircle, text];

    });


  return [].concat.apply([], groups);



}

export function createLegends({startPoint, radius,  degreeToBeDrawn,maxScore}) {

  return createLegendWithOptions({startPoint, center: startPoint, startRadius: 0, endRadius: radius,  degreeToBeDrawn,maxScore});

}
