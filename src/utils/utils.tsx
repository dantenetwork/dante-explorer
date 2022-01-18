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
