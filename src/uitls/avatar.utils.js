import _ from 'lodash'
import { colorThemes } from '../themes'

const COLORS = ['#ED4C5C', '#2684FF', '#E2806D', '#CA0990']

export const getAvatarNameCut = fullname => {
  if (!fullname) {
    return
  }
  const initialsBasis = fullname?.split('@')[0]
  const wordsArray = _.words(initialsBasis, /[^, ]+/g)
  let initials = ''
  const regex1 = /[a-zA-Z\u0E00-\u0E7F0-9]/g
  const regex2 = /[a-zA-Z\u0E00-\u0E7F]/g
  const regex3 = /[0-9]/g
  const matches = wordsArray.map(word => word.match(regex1)).filter(Boolean)
  for (const match of matches) {
    if (initials.length === 2) break
    initials += match[0].toUpperCase()
  }
  if (initials.length === 1) {
    if (initials.match(regex2)) {
      initials += wordsArray[0].match(regex3)?.[0] || ''
    } else {
      initials += wordsArray[0].match(regex2)?.[0] || ''
    }
  }
  return initials
}

export const getAvatarColorByName = (name, conutNumber) => {
  if (conutNumber) {
    return { backgroundColor: colorThemes.Light.Primary.Main }
  }
  if (!name) {
    return
  }
  let hash = 0
  for (var i = 0; i < name?.length; i++) {
    hash = hash + name.charCodeAt(i)
  }
  const colorIndex = hash % COLORS?.length
  return { backgroundColor: COLORS[colorIndex] }
}
