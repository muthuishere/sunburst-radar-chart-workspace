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


export function writeTextOnArc(options) {


  const defaults = {text: '', pathId: ''  ,      'font-size': '14px',  };
  options = {...defaults, ...(options || {})};

  const {text, pathId} = options;

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