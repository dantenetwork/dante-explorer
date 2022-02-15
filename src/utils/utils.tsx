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
      return format(val) + ' byte';
    } else if (val >= 1024 && val < 1024 * 1024) {
      return format((val / 1024).toFixed(2)) + ' KB';
    } else if (val >= 1024 * 1024 && val < 1024 * 1024 * 1024) {
      return format((val / 1024 / 1024).toFixed(2)) + ' MB';
    } else if (val >= 1024 * 1024 * 1024) {
      return format((val / (1024 * 1024 * 1024)).toFixed(2)) + ' GB';
    }
  }
}

/**
 * 格式化时间
 *
 * @param time
 *            长整型时间
 * @param fmt
 *            时间格式，默认：yyyy-MM-dd
 * @returns
 */
export function formatDate(receiveTime: any, fmt: string) {
  if (receiveTime == null) {
    return;
  }
  var fmt = fmt ? fmt : 'yyyy-MM-dd';
  var time = new Date(parseInt(receiveTime));
  var z = {
    M: time.getMonth() + 1,
    d: time.getDate(),
    h: time.getHours(),
    m: time.getMinutes(),
    s: time.getSeconds(),
  };
  fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
    return ((v.length > 1 ? '0' : '') + eval('z.' + v.slice(-1))).slice(-2);
  });
  return fmt.replace(/(y+)/g, function (v) {
    return time.getFullYear().toString().slice(-v.length);
  });
}

/**
 * 千分位
 *
 * @param num
 * @returns
 */
export function format(num: any) {
  num = num;
  return (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
}

export function arrayAort(val: any, parameter: string) {
  let key = val.map((e: any) => e[parameter]);

  key.sort((key1: number, key2: number) => key2 - key1);

  let newVal = [];
  for (let v in key) {
    newVal.push(...val.filter((e: any) => e[parameter] === key[v]));
  }
  return newVal;
}
