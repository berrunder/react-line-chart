const tooltipMonths = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

/**
 * Format date for tooltip
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = date => {
  return ('0' + date.getDate()).substr(-2) + ' ' +
    tooltipMonths[date.getMonth()] + ' ' +
    date.getFullYear();
}

/**
 * Get long russian name for month
 * @param date
 */
export const getLongMonth = date => months[date.getMonth()];

const argsEqual = (prev, next) => {
  if (prev === null) {
    return false;
  }

  let i = next.length;
  while (i--) {
    if (prev[i] !== next[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Memoize last function call
 * @param {Function} fn
 * @returns {Function}
 */
export function memoizeLast(fn) {
  let lastArgs = null;
  let cached = null;

  return function () {
    if (cached === null || !argsEqual(lastArgs, arguments)) {
      cached = fn.apply(this, arguments);
    }

    lastArgs = arguments;
    return cached;
  };
}

/**
 * Generate array of consecutive integers from zero
 * @param {Number} to
 */
export const range = (to) => [...new Array(to).keys()];