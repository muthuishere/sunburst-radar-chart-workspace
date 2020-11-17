import {createPath} from './elements';
import {polarToCartesian} from './trignometry';
import {AngularSvgElement} from './models';


export function createArcToWriteText({startPoint, radius, id, startAngle, endAngle}) {

  const [centerX, centerY] = [startPoint.x, startPoint.y];

  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');


  return createPath({d, borderColor: '', id});


}


export function getTextForAngle(text, distance, fontSize) {


  let result = text;


  let perCharacter = 10.07;
  if (fontSize < 18) {
    perCharacter = 8.7;

  }
  //Max for 14 is 18
  // len 9 distance 79.00696650144559 fontSize 14
  //8.7 d per character for fs 14
  //0.62 per distance  +

  //total distance *0.035


  //0.07
//.015
  //Max for 18 is 43
  // len 42 distance 423 fontSize 18
  //10.07 per char for fs 18
  //0.559
  //0.58 character by distance


  const totalTextLength = Math.round(distance / perCharacter);
  console.log('text ' + text + ' len ' + text.length + 'totalTextLength' + totalTextLength + ' distance' + distance + ' fontSize' + fontSize);
  if (text.length > 0 && text.length > totalTextLength) {

    result = text.substring(0, totalTextLength - 1) + '..';
  }
  return result;
}

export function writeTextOnArc(options) {


  const defaults = {text: '', label: '', pathId: '', 'font-size': '14px',};
  options = {...defaults, ...(options || {})};

  const {text, pathId, label} = options;

  if (pathId !== '') {
    options['href'] = '#' + pathId;
    options['startOffset'] = '50%';
    options['text-anchor'] = 'middle';
    options['title'] = text;

  }

  const textOnArc: AngularSvgElement = {name: 'text-on-arc', options, children: []};
  return textOnArc;

  //
  // const textPath = document.createElementNS(svgns, "textPath");
  // textPath.setAttribute("href", "#" + pathId);
  // textPath.setAttribute("startOffset", "50%");
  // textPath.setAttribute("text-anchor", "middle");
  //
  // textPath.innerHTML = text
  //
  //
  // const textElem = document.createElementNS(svgns, "text");
  // textElem.appendChild(textPath)
  //
  //
  // textElem.appendChild(createTitle(text))
  //
  // //<title>I'm a circle</title>
  //
  // return textElem


}


export function createText(options) {

  const defaults = {
    content: '', x: 0, y: 0,
    stroke: 'white',
    'stroke-width': '1px',
    'font-size': '6px',
    'text-anchor': 'middle'
  };
  options = {...defaults, ...(options || {})};

  const textElement: AngularSvgElement = {name: 'text', options, children: []};
  return textElement;
  // const {content, x, y, color, size} = options
  //
  // const textElem = document.createElementNS(svgns, "text");
  // textElem.setAttribute("x", x)
  // textElem.setAttribute("y", y)
  // textElem.setAttribute("text-anchor", "middle")
  // textElem.setAttribute("stroke", color)
  // textElem.setAttribute("stroke-width", "1px")
  // textElem.setAttribute("font-size", size)
  // textElem.innerHTML = content
  // textElem.appendChild(createTitle(content))

  //return textElem;


}
