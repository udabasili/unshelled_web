export function checkPassword (userPassword, correctPassword) {
  if (!userPassword || !correctPassword) {
    throw new Error('Two passwords are required')
  }
  if (userPassword !== correctPassword) {
    return false
  }
  return true
}
