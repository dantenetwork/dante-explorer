//防抖回调 默认一秒
export function debounce(
  func: <T>(parms: T) => T | void,
  wait = 1000,
): () => void {
  let timer: null | any = null;
  return () => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(func, wait);
  };
}

//节流回调 默认一秒
export function throttle(
  func: <T>(parms: T) => T | void,
  wait = 1000,
): () => void {
  let lastTime = 0;
  return function () {
    const nowTime = Date.now();
    if (nowTime - lastTime > (wait || 1000)) {
      func.call('', lastTime);
      lastTime = nowTime;
    }
  };
}

export function toSize(val: any) {
  val = Number(val);
  if (val) {
    if (val < 1024) {
      return val + ' byte';
    } else if (val >= 1024 && val < 1024 * 1024) {
      return (val / 1024).toFixed(2) + ' KB';
    } else if (val >= 1024 * 1024 && val < 1024 * 1024 * 1024) {
      return ((val / 1024) * 1024).toFixed(2) + ' MB';
    } else if (val >= 1024 * 1024 * 1024) {
      return ((val / 1024) * 1024 * 1024).toFixed(2) + ' GB';
    }
  }
}
