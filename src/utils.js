const randomNum = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const emojis = ['🤪', '😁', '😸', '😜', '👻', '🌚']
const randomEmoji = () => {
  const num = randomNum(0, 5)
  return emojis[num]
}
const greetings = ['nice.', 'looks good.', 'sounds great.']
const randomGreeting = () => {
  const num = randomNum(0, 2)
  return greetings[num]
}
const debounce = (func, wait, immediate) => {
  var timeout, args, context, timestamp, result
  if (null == wait) wait = 100
  function later() {
    var last = Date.now() - timestamp
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        context = args = null
      }
    }
  }
  var debounced = function() {
    context = this
    args = arguments
    timestamp = Date.now()
    var callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args)
      context = args = null
      clearTimeout(timeout)
      timeout = null
    }
  }
  return debounced
}
const db = (debouncedRef = {}, fn = () => {}, delayMs = 1000) => {
  return (() => {
    if (debouncedRef.current) debouncedRef.current.clear()
    debouncedRef.current = debounce(() => fn(), delayMs)
    debouncedRef.current()
  })()
}
const noop = () => {}
export { randomNum, randomEmoji, randomGreeting, db, noop }
