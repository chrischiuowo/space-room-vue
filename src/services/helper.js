export const checkConsole = (text, ...response) => {
  const isShowConsole = import.meta.env.VITE_ENV
  if (isShowConsole === 'true') {
    console.log(text, ...response)
  } else {
    return false
  }
}

export const dateFormat = (dateTimeStamp) => {
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const now = new Date().getTime()
  const diffValue = now - dateTimeStamp
  if (diffValue < 0) return
  let result
  const minDiff = diffValue / minute
  const hourDiff = diffValue / hour
  const dayDiff = diffValue / day
  const weekDiff = diffValue / week
  const monthDiff = diffValue / month
  if (monthDiff >= 1 && monthDiff <= 3) {
    result = ' ' + parseInt(monthDiff) + '月前'
  } else if (weekDiff >= 1 && weekDiff <= 3) {
    result = ' ' + parseInt(weekDiff) + '周前'
  } else if (dayDiff >= 1 && dayDiff <= 6) {
    result = ' ' + parseInt(dayDiff) + '天前'
  } else if (hourDiff >= 1 && hourDiff <= 23) {
    result = ' ' + parseInt(hourDiff) + '小時前'
  } else if (minDiff >= 1 && minDiff <= 59) {
    result = ' ' + parseInt(minDiff) + '分鐘前'
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = '剛剛'
  } else {
    const yyyy = new Date(dateTimeStamp).getFullYear()
    const mm = String(new Date(dateTimeStamp).getMonth() + 1).padStart(2, '0')
    const dd = String(new Date(dateTimeStamp).getDate()).padStart(2, '0')
    result = `${yyyy}/${mm}/${dd}`
  }
  return result
}
