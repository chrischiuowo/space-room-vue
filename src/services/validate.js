import validator from 'validator'

// 欄位不得為空
export function isNotEmpty (val) {
  return validator.isEmpty(val.toString()) ? '欄位不得為空' : ''
}

// 驗證密碼至少 8 個字元以上
export function isValidPassword (pw) {
  return validator.isLength(pw, { min: 8 }) ? '' : '密碼至少 8 碼以上'
}

// 驗證密碼是否一致
export function isSamePassword (pw, checkPw) {
  return pw === checkPw ? '' : '密碼填寫不一致'
}

// 驗證新舊密碼不可相同
export function isRepeatPassword (pw, oldPw) {
  return pw === oldPw ? '新密碼不可與原密碼相同' : ''
}

// 驗證 email 格式
export function isValidEmail (val) {
  return validator.isEmail(val) ? '' : 'Email 格式錯誤'
}
