export function hashCode(obj) {

  let s = JSON.stringify(obj);
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }

  return h;
}


export function clone(obj) {

  return JSON.parse(JSON.stringify(obj));
}
export function generateRandomColor() {
  const letters = '0123456789ABCDEF';


  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[(Math.floor(Math.random() * 16))];
  }
  return color;
}
