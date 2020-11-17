import {AngularSvgElement} from './models';

export function createCircle(options) {


  const defaults = {
    x: 0,
    y: 0,
    radius: 0,
    fillColor: 'none',
    'stroke-width': '1',
    'stroke': '#000000',
    'stroke-dasharray': 'none',
    'stroke-opacity': '1',
    'title': ''
  };
  options = {...defaults, ...(options || {})};

  const circle: AngularSvgElement = {name: 'circle', options, children: []};
  return circle;


}


export function createLine(options) {


  const defaults = {x1: 0, y1: 0, x2: 0, y2: 0, color: '#000000', width: '2', title: ''};
  options = {...defaults, ...(options || {})};

  const line: AngularSvgElement = {name: 'line', options, children: []};
  return line;


}


export function createPath(options) {

  const defaults = {d: '', fill: 'none', stroke: 'none', 'stroke-width': '0',title: '', id: null};
  options = {...defaults, ...(options || {})};

  const {d, color, borderColor} = options;


  const path: AngularSvgElement = {name: 'path', options, children: []};
  return path;



}
