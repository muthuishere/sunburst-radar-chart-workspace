import {createPath} from './elements';
import {getLargeArcFlag, polarToCartesian} from './trignometry';
import {AngularSvgElement} from './models';
import {getOptionsOrEmpty} from './utils';


export function createArcToWriteText({startPoint, radius, id, startAngle, endAngle}) {

  const [centerX, centerY] = [startPoint.x, startPoint.y];

  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = getLargeArcFlag(startAngle, endAngle);


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
  const totalTextLength = Math.round(distance / perCharacter);
  if (text.length > 0 && text.length > totalTextLength) {

    result = text.substring(0, totalTextLength - 1) + '..';
  }
  return result;
}

export function writeTextOnArc(options) {


  const defaults = {text: '', label: '', pathId: '', 'font-size': '14px',};
  options = {...defaults, ...(getOptionsOrEmpty(options))};

  const {text, pathId, label} = options;

  if (pathId !== '') {
    options['href'] = '#' + pathId;
    options['startOffset'] = '50%';
    options['text-anchor'] = 'middle';
    options['title'] = text;

  }

  const textOnArc: AngularSvgElement = {name: 'text-on-arc', options, children: []};
  return textOnArc;


}


export function createText(options) {

  const defaults = {
    content: '', x: 0, y: 0,
    stroke: 'white',
    'stroke-width': '1px',
    'font-size': '6px',
    'text-anchor': 'middle'
  };
  options = {...defaults, ...(getOptionsOrEmpty(options))};

  const textElement: AngularSvgElement = {name: 'text', options, children: []};
  return textElement;


}
