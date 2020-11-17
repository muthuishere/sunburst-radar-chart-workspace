export function hashCode(obj) {
  let h = 0;
  obj = getOptionsOrEmpty(obj);

  let s = JSON.stringify(obj);


  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }


  return h;
}

export function getOptionsOrEmpty(options) {
  return options || {};
}


export function getItemTitle(item) {
  item = item || {name: '', value: ''};

  const dash = item.name.length > 0 ? '-' : '';

  return item.name + dash + item.value;

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
