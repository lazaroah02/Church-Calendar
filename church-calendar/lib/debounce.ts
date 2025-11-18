export function debounce(func: any, timeout = 100) {
  let timer: any;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}